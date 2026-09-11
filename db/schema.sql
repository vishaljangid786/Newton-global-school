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

-- Principal photos (added after initial release — MariaDB 10.3+/MySQL 8
-- support ADD COLUMN IF NOT EXISTS so re-running this file stays safe).
ALTER TABLE branches
  ADD COLUMN IF NOT EXISTS principal_photo_url VARCHAR(500) NULL AFTER principal_message;
ALTER TABLE branch_overrides
  ADD COLUMN IF NOT EXISTS principal_photo_url VARCHAR(500) NULL AFTER principal_message;

-- Branch hero photographs (added later still; hero_tone remains the gradient
-- fallback for a campus that has no photo yet).
ALTER TABLE branches
  ADD COLUMN IF NOT EXISTS hero_image_url VARCHAR(500) NULL AFTER hero_tone;
ALTER TABLE branch_overrides
  ADD COLUMN IF NOT EXISTS hero_image_url VARCHAR(500) NULL AFTER principal_photo_url;

-- ————————————————————————————————————————————————————————————————
-- Gallery images (admin-uploaded photos per campus; merged ahead of the
-- static placeholder gallery on the public pages)
-- ————————————————————————————————————————————————————————————————
-- Photographs AND videos. The table keeps its original name so every existing
-- row, index and foreign key survives; `media_type` is the discriminator and
-- defaults to 'image', so rows written before videos existed stay correct.
-- An existing database is brought up to date by `npm run db:migrate:video`.
CREATE TABLE IF NOT EXISTS gallery_images (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  branch_ref VARCHAR(40) NOT NULL,
  -- Widened when the school's own photographs replaced the placeholder set;
  -- the four original values are kept so older rows still validate.
  category   ENUM('Campus', 'Classrooms', 'Library', 'Labs', 'Sports', 'Pre-Primary', 'Transport', 'Assembly', 'Our Team', 'Annual Day', 'Trips') NOT NULL,
  caption    VARCHAR(200) NOT NULL,
  media_type ENUM('image', 'video') NOT NULL DEFAULT 'image',
  -- Photographs: the picture itself. Videos: the poster frame, which may be
  -- NULL for an uploaded clip (the player shows its own first frame instead).
  -- Site-relative path (e.g. /uploads/gallery-….webp) or an absolute URL.
  image_url  VARCHAR(500) NULL,
  -- Videos only: an /uploads/… file path, or a YouTube video id.
  video_url  VARCHAR(500) NULL,
  -- Videos only: how to read video_url.
  video_source ENUM('file', 'youtube') NULL,
  created_by INT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_gallery_branch (branch_ref),
  KEY idx_gallery_category (category),
  KEY idx_gallery_media (media_type),
  CONSTRAINT fk_gallery_user FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ————————————————————————————————————————————————————————————————
-- Testimonials (branch-wise voices from students, parents and teachers;
-- 'all' rows appear on every campus page)
-- ————————————————————————————————————————————————————————————————
CREATE TABLE IF NOT EXISTS testimonials (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  -- 'all' = shown on every branch, otherwise a branch slug.
  branch_ref  VARCHAR(40) NOT NULL DEFAULT 'all',
  author_name VARCHAR(120) NOT NULL,
  author_role ENUM('student', 'parent', 'teacher') NOT NULL,
  -- Free-text line under the name, e.g. "Grade 9 student" / "Parent of two".
  role_detail VARCHAR(120) NOT NULL DEFAULT '',
  quote       TEXT NOT NULL,
  status      ENUM('draft', 'published') NOT NULL DEFAULT 'published',
  created_by  INT UNSIGNED NULL,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_testimonials_branch (branch_ref),
  KEY idx_testimonials_status (status),
  CONSTRAINT fk_testimonials_user FOREIGN KEY (created_by) REFERENCES users (id) ON DELETE SET NULL
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
  -- Uploaded cover photograph; the tone above is the fallback when absent.
  cover_image_url VARCHAR(500) NULL,
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

-- ————————————————————————————————————————————————————————————————
-- Registration form submissions (the public "Apply Now" form). Kept apart
-- from `enquiries`: an enquiry is a question, a registration is an
-- application, and it carries the fields an application needs.
-- ————————————————————————————————————————————————————————————————
CREATE TABLE IF NOT EXISTS registrations (
  id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  student_name    VARCHAR(120) NOT NULL,
  date_of_birth   DATE NULL,
  gender          ENUM('male', 'female', 'other') NULL,
  class_applied   VARCHAR(60) NOT NULL,
  father_name     VARCHAR(120) NOT NULL DEFAULT '',
  mother_name     VARCHAR(120) NOT NULL DEFAULT '',
  phone           VARCHAR(20) NOT NULL,
  email           VARCHAR(190) NOT NULL DEFAULT '',
  address         VARCHAR(300) NOT NULL DEFAULT '',
  previous_school VARCHAR(160) NOT NULL DEFAULT '',
  branch_slug     VARCHAR(40) NOT NULL DEFAULT 'all',
  message         TEXT NULL,
  status          ENUM('new', 'contacted', 'closed') NOT NULL DEFAULT 'new',
  created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_registrations_status (status),
  KEY idx_registrations_branch (branch_slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
