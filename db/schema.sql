-- Sunrise International School — admin/RBAC database schema (MySQL 8+)
--
-- Run once after creating the database, e.g.:
--   mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS sunrise_school CHARACTER SET utf8mb4;"
--   mysql -u root -p sunrise_school < db/schema.sql
--   npm run db:seed            # creates the first Super Admin + one Branch Admin
--
-- All content tables use branch scoping: branch_ref is either a specific slug
-- (city-center | green-valley | riverside) or the literal 'all' for group-wide
-- ("parent") items. Branch Admins are restricted to their own slug; Super Admins
-- see everything.

SET NAMES utf8mb4;

-- ————————————————————————————————————————————————————————————————
-- Users & roles (RBAC)
-- ————————————————————————————————————————————————————————————————
CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email         VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(120) NOT NULL,
  role          ENUM('super_admin', 'branch_admin') NOT NULL,
  -- NULL for super_admin; a branch slug for branch_admin.
  branch_slug   VARCHAR(40) DEFAULT NULL,
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ————————————————————————————————————————————————————————————————
-- Admission enquiries (public InquiryForm writes here)
-- ————————————————————————————————————————————————————————————————
CREATE TABLE IF NOT EXISTS enquiries (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  student_name VARCHAR(120) NOT NULL,
  parent_name  VARCHAR(120) NOT NULL,
  phone        VARCHAR(40)  NOT NULL,
  email        VARCHAR(190) NOT NULL,
  branch_slug  VARCHAR(40)  NOT NULL,
  grade        VARCHAR(40)  NOT NULL,
  message      TEXT         NULL,
  status       ENUM('new', 'contacted', 'closed') NOT NULL DEFAULT 'new',
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_enquiries_branch (branch_slug),
  KEY idx_enquiries_status (status),
  KEY idx_enquiries_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ————————————————————————————————————————————————————————————————
-- Notifications (admin-sent, shown on the frontend banner / notice board)
-- ————————————————————————————————————————————————————————————————
CREATE TABLE IF NOT EXISTS notifications (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  title      VARCHAR(200) NOT NULL,
  body       TEXT NOT NULL,
  -- 'all' = group-wide, otherwise a branch slug.
  branch_ref VARCHAR(40) NOT NULL DEFAULT 'all',
  level      ENUM('info', 'success', 'warning') NOT NULL DEFAULT 'info',
  active     TINYINT(1) NOT NULL DEFAULT 1,
  created_by INT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_notifications_branch (branch_ref),
  KEY idx_notifications_active (active),
  CONSTRAINT fk_notifications_user FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ————————————————————————————————————————————————————————————————
-- Branch content overrides (overlay the static src/data/branches.ts)
-- One row per branch; any NULL column falls back to the static default.
-- ————————————————————————————————————————————————————————————————
CREATE TABLE IF NOT EXISTS branch_overrides (
  branch_slug       VARCHAR(40) NOT NULL,
  principal_name    VARCHAR(120) NULL,
  principal_message TEXT NULL,
  students          INT UNSIGNED NULL,
  campus_size       VARCHAR(60) NULL,
  grades            VARCHAR(80) NULL,
  phone             VARCHAR(40) NULL,
  email             VARCHAR(190) NULL,
  address           VARCHAR(255) NULL,
  -- JSON array of strings; NULL keeps the static facilities list.
  facilities        JSON NULL,
  updated_by        INT UNSIGNED NULL,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (branch_slug),
  CONSTRAINT fk_overrides_user FOREIGN KEY (updated_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ————————————————————————————————————————————————————————————————
-- Custom branches created by Super Admins (the 3 built-ins live in
-- src/data/branches.ts). Drafts are admin-only; published ones appear on the
-- public site.
-- ————————————————————————————————————————————————————————————————
CREATE TABLE IF NOT EXISTS branches (
  slug              VARCHAR(40) NOT NULL,
  name              VARCHAR(120) NOT NULL,
  area              VARCHAR(120) NOT NULL,
  address           VARCHAR(255) NOT NULL,
  phone             VARCHAR(40) NOT NULL,
  email             VARCHAR(190) NOT NULL,
  established       INT UNSIGNED NULL,
  grades            VARCHAR(80) NOT NULL DEFAULT '',
  principal_name    VARCHAR(120) NOT NULL DEFAULT '',
  principal_message TEXT NULL,
  students          INT UNSIGNED NULL,
  campus_size       VARCHAR(60) NOT NULL DEFAULT '',
  facilities        JSON NULL,
  hero_tone         VARCHAR(20) NOT NULL DEFAULT 'primary',
  status            ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  created_by        INT UNSIGNED NULL,
  created_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (slug),
  KEY idx_branches_status (status),
  CONSTRAINT fk_branches_user FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ————————————————————————————————————————————————————————————————
-- Blog posts (branch-wise + group/"parent"-wide)
-- ————————————————————————————————————————————————————————————————
CREATE TABLE IF NOT EXISTS blog_posts (
  id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug         VARCHAR(190) NOT NULL,
  title        VARCHAR(200) NOT NULL,
  -- 'all' = group/parent blog, otherwise a branch slug.
  branch_ref   VARCHAR(40) NOT NULL DEFAULT 'all',
  excerpt      VARCHAR(400) NOT NULL,
  body         MEDIUMTEXT NOT NULL,
  cover_tone   VARCHAR(20) NOT NULL DEFAULT 'primary',
  status       ENUM('draft', 'published') NOT NULL DEFAULT 'draft',
  author_id    INT UNSIGNED NULL,
  author_name  VARCHAR(120) NOT NULL,
  published_at DATETIME NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_blog_slug (slug),
  KEY idx_blog_branch (branch_ref),
  KEY idx_blog_status (status),
  CONSTRAINT fk_blog_author FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
