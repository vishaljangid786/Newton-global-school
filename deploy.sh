#!/usr/bin/env bash
#
# Zero-touch deploy for the Newton Global School site.
#
#   git pull && npm run deploy
#
# Runs on the server, behind nginx. It installs dependencies, builds into a
# scratch directory, swaps the new build in only once the build has succeeded,
# restarts the app and then proves the site actually answers before declaring
# success. If anything fails at any point the previous build, the previous
# commit and the previous dependencies are put back and the old version keeps
# serving — so a broken deploy never takes the site down.
#
# Everything below can be overridden from the environment or from a
# .env.deploy file sitting next to this script.

set -Eeuo pipefail

# ─────────────────────────────── configuration ───────────────────────────────
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

# Optional per-server overrides, never committed.
# shellcheck disable=SC1091
[ -f "$ROOT/.env.deploy" ] && . "$ROOT/.env.deploy"

APP_NAME="${APP_NAME:-newton-global-school}"   # pm2 process / systemd unit name
PORT="${PORT:-3000}"                           # the port nginx proxies to
HEALTH_PATH="${HEALTH_PATH:-/}"                # path that must return 2xx/3xx
HEALTH_TIMEOUT="${HEALTH_TIMEOUT:-60}"         # seconds to wait for a healthy app
PROCESS_MANAGER="${PROCESS_MANAGER:-auto}"     # auto | pm2 | systemd | none
ROLLBACK_CODE="${ROLLBACK_CODE:-1}"            # 1 = also revert the checkout
KEEP_RELEASES="${KEEP_RELEASES:-1}"            # keep .next.previous after success

BUILD_DIR=".next"
STAGING_DIR=".next.staging"
PREVIOUS_DIR=".next.previous"
STATE_DIR=".deploy"
LAST_GOOD_FILE="$STATE_DIR/last-good-commit"

# ───────────────────────────────── output ────────────────────────────────────
if [ -t 1 ]; then
  BOLD=$'\033[1m'; RED=$'\033[31m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; DIM=$'\033[2m'; OFF=$'\033[0m'
else
  BOLD=""; RED=""; GREEN=""; YELLOW=""; DIM=""; OFF=""
fi
STEP=0
step()  { STEP=$((STEP + 1)); printf '\n%s[%d/%d] %s%s\n' "$BOLD" "$STEP" "$TOTAL_STEPS" "$1" "$OFF"; }
info()  { printf '      %s%s%s\n' "$DIM" "$1" "$OFF"; }
ok()    { printf '      %s✓ %s%s\n' "$GREEN" "$1" "$OFF"; }
warn()  { printf '      %s! %s%s\n' "$YELLOW" "$1" "$OFF"; }
die()   { printf '\n%s✗ %s%s\n' "$RED" "$1" "$OFF" >&2; exit 1; }
TOTAL_STEPS=7

# ──────────────────────────────── rollback ───────────────────────────────────
# Set once we have something worth undoing. The trap fires on any non-zero
# exit, on an unset variable, and on Ctrl-C.
ROLLBACK_ARMED=0
SWAPPED=0
DEPLOYED_COMMIT=""
PREVIOUS_COMMIT=""

rollback() {
  local exit_code=$?
  trap - ERR EXIT INT TERM
  [ "$ROLLBACK_ARMED" = "1" ] || exit "$exit_code"

  printf '\n%s──────── deploy failed — rolling back ────────%s\n' "$RED$BOLD" "$OFF"

  # 1. Put the previous build back.
  if [ "$SWAPPED" = "1" ] && [ -d "$PREVIOUS_DIR" ]; then
    rm -rf "$BUILD_DIR"
    mv "$PREVIOUS_DIR" "$BUILD_DIR"
    ok "restored the previous build"
  else
    rm -rf "$STAGING_DIR"
    info "no build was swapped in; previous build untouched"
  fi

  # 2. Put the previous commit back, and its dependencies with it.
  if [ "$ROLLBACK_CODE" = "1" ] && [ -n "$PREVIOUS_COMMIT" ] \
     && [ "$PREVIOUS_COMMIT" != "$DEPLOYED_COMMIT" ]; then
    warn "reverting checkout to ${PREVIOUS_COMMIT:0:8}"
    if git reset --hard "$PREVIOUS_COMMIT" >/dev/null 2>&1; then
      ok "checkout reverted"
      install_dependencies >/dev/null 2>&1 && ok "dependencies reinstalled for the old commit" \
        || warn "could not reinstall dependencies — run npm ci by hand"
    else
      warn "could not revert the checkout — do it by hand: git reset --hard $PREVIOUS_COMMIT"
    fi
  fi

  # 3. Bring the old version back up.
  restart_app || warn "could not restart the app — check it by hand"

  printf '\n%s✗ Deploy aborted. The site is back on %s.%s\n' \
    "$RED$BOLD" "${PREVIOUS_COMMIT:0:8}" "$OFF" >&2
  exit "${exit_code:-1}"
}
trap rollback ERR EXIT INT TERM

# ──────────────────────────────── helpers ────────────────────────────────────
detect_process_manager() {
  if [ "$PROCESS_MANAGER" != "auto" ]; then echo "$PROCESS_MANAGER"; return; fi
  if command -v pm2 >/dev/null 2>&1 && pm2 describe "$APP_NAME" >/dev/null 2>&1; then
    echo pm2
  elif command -v systemctl >/dev/null 2>&1 && systemctl list-unit-files 2>/dev/null | grep -q "^${APP_NAME}\.service"; then
    echo systemd
  else
    echo none
  fi
}

install_dependencies() {
  if [ -f package-lock.json ]; then
    npm ci --no-audit --no-fund
  else
    npm install --no-audit --no-fund
  fi
}

restart_app() {
  case "$PM" in
    pm2)     pm2 reload "$APP_NAME" --update-env >/dev/null ;;
    systemd) sudo -n systemctl restart "$APP_NAME" 2>/dev/null || systemctl restart "$APP_NAME" ;;
    none)    return 0 ;;
  esac
}

wait_until_healthy() {
  local url="http://127.0.0.1:${PORT}${HEALTH_PATH}"
  local waited=0
  until curl -fsS --max-time 5 -o /dev/null "$url" 2>/dev/null; do
    waited=$((waited + 2))
    [ "$waited" -ge "$HEALTH_TIMEOUT" ] && return 1
    sleep 2
  done
  return 0
}

# ───────────────────────────────── preflight ─────────────────────────────────
step "Preflight"
command -v node >/dev/null || die "node is not installed"
command -v npm  >/dev/null || die "npm is not installed"
command -v git  >/dev/null || die "git is not installed"
[ -f package.json ] || die "no package.json here — run this from the project root"
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || die "not a git repository"

mkdir -p "$STATE_DIR"
DEPLOYED_COMMIT="$(git rev-parse HEAD)"
PREVIOUS_COMMIT="$(cat "$LAST_GOOD_FILE" 2>/dev/null || echo "$DEPLOYED_COMMIT")"
PM="$(detect_process_manager)"

info "node $(node -v)  npm $(npm -v)"
info "commit    ${DEPLOYED_COMMIT:0:8}  $(git log -1 --pretty=%s | cut -c1-52)"
info "previous  ${PREVIOUS_COMMIT:0:8}"
info "process manager: $PM   port: $PORT"
[ "$PM" = "none" ] && warn "no pm2 process or systemd unit named '$APP_NAME' — the app will not be restarted"

# From here on there is state worth undoing.
ROLLBACK_ARMED=1

# ────────────────────────────── dependencies ─────────────────────────────────
step "Installing dependencies"
install_dependencies
ok "dependencies ready"

# ──────────────────────────────── build ──────────────────────────────────────
# Built into a scratch directory so the live build keeps serving while this
# runs. A failed build therefore cannot leave a half-written .next behind.
step "Building"
rm -rf "$STAGING_DIR"
NEXT_DIST_DIR="$STAGING_DIR" npm run build
[ -d "$STAGING_DIR" ] || die "the build produced no $STAGING_DIR directory"
ok "build succeeded"

# ─────────────────────────────── swap in ─────────────────────────────────────
step "Swapping in the new build"
rm -rf "$PREVIOUS_DIR"
[ -d "$BUILD_DIR" ] && mv "$BUILD_DIR" "$PREVIOUS_DIR"
mv "$STAGING_DIR" "$BUILD_DIR"
SWAPPED=1
ok "new build is in place"

# ─────────────────────────────── restart ─────────────────────────────────────
step "Restarting the app"
restart_app
[ "$PM" = "none" ] && info "skipped — no process manager" || ok "restarted via $PM"

# ──────────────────────────── health check ───────────────────────────────────
step "Health check"
if [ "$PM" = "none" ]; then
  warn "skipped — nothing was restarted, so there is nothing to check"
else
  wait_until_healthy || die "the site did not answer on 127.0.0.1:${PORT}${HEALTH_PATH} within ${HEALTH_TIMEOUT}s"
  ok "site is answering on 127.0.0.1:${PORT}${HEALTH_PATH}"
fi

# ──────────────────────────────── finish ─────────────────────────────────────
step "Done"
echo "$DEPLOYED_COMMIT" > "$LAST_GOOD_FILE"
[ "$KEEP_RELEASES" = "1" ] || rm -rf "$PREVIOUS_DIR"

# Disarm the rollback: everything from here is success-path only.
ROLLBACK_ARMED=0
trap - ERR EXIT INT TERM

printf '\n%s✓ Live on %s%s\n' "$GREEN$BOLD" "${DEPLOYED_COMMIT:0:8}" "$OFF"
[ -d "$PREVIOUS_DIR" ] && info "previous build kept at $PREVIOUS_DIR (set KEEP_RELEASES=0 to discard)"
exit 0
