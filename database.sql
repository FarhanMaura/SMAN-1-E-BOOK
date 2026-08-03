-- ============================================================
-- DATABASE DDL SCRIPT UNTUK FLIPBOOK / SYSTEM MAGANG
-- Berdasarkan ERD (docs/erdsela.drawio.png)
-- Database Engine: MySQL / MariaDB (InnoDB)
-- Charset: utf8mb4 / utf8mb4_unicode_ci
-- ============================================================

CREATE DATABASE IF NOT EXISTS `db_magang` 
  DEFAULT CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;

USE `db_magang`;

-- Nonaktifkan pemeriksaan FK saat dropping dan pembuatannya
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `penilaians`;
DROP TABLE IF EXISTS `absensis`;
DROP TABLE IF EXISTS `pesertas`;
DROP TABLE IF EXISTS `pengajuans`;
DROP TABLE IF EXISTS `pembimbings`;
DROP TABLE IF EXISTS `instansis`;
DROP TABLE IF EXISTS `bidangs`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------
-- 1. TABEL users
-- Deskripsi: Akun pengguna (Admin, Pembimbing, Peserta)
-- ------------------------------------------------------------
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` TINYINT UNSIGNED NOT NULL DEFAULT 3 COMMENT '1: Admin, 2: Pembimbing, 3: Peserta',
  `email_verified_at` TIMESTAMP NULL DEFAULT NULL,
  `remember_token` VARCHAR(100) NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 2. TABEL bidangs
-- Deskripsi: Master data bidang/divisi
-- ------------------------------------------------------------
CREATE TABLE `bidangs` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(255) NOT NULL,
  `deskripsi` TEXT NULL DEFAULT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 3. TABEL instansis
-- Deskripsi: Master data instansi/sekolah/universitas
-- ------------------------------------------------------------
CREATE TABLE `instansis` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama` VARCHAR(255) NOT NULL,
  `alamat` TEXT NULL DEFAULT NULL,
  `telp` VARCHAR(255) NULL DEFAULT NULL,
  `email` VARCHAR(255) NULL DEFAULT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 4. TABEL pembimbings
-- Deskripsi: Data pembimbing per bidang
-- ------------------------------------------------------------
CREATE TABLE `pembimbings` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `bidang_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `nip` VARCHAR(255) NULL DEFAULT NULL,
  `nama` VARCHAR(255) NOT NULL,
  `no_hp` VARCHAR(255) NULL DEFAULT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pembimbings_user_id_foreign` (`user_id`),
  KEY `pembimbings_bidang_id_foreign` (`bidang_id`),
  CONSTRAINT `pembimbings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pembimbings_bidang_id_foreign` FOREIGN KEY (`bidang_id`) REFERENCES `bidangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 5. TABEL pengajuans
-- Deskripsi: Data permohonan pengajuan magang
-- ------------------------------------------------------------
CREATE TABLE `pengajuans` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `instansi_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `nama_instansi` VARCHAR(255) NULL DEFAULT NULL,
  `pic_nama` VARCHAR(255) NOT NULL,
  `pic_email` VARCHAR(255) NOT NULL,
  `pic_telp` VARCHAR(255) NOT NULL,
  `jml_peserta` INT NOT NULL,
  `tgl_mulai` DATE NOT NULL,
  `tgl_selesai` DATE NOT NULL,
  `file_surat` VARCHAR(255) NULL DEFAULT NULL,
  `file_peserta` VARCHAR(255) NULL DEFAULT NULL,
  `status` VARCHAR(255) NOT NULL DEFAULT 'pending' COMMENT 'pending / approved / rejected',
  `keterangan` TEXT NULL DEFAULT NULL,
  `keterangan_reject` TEXT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pengajuans_instansi_id_foreign` (`instansi_id`),
  CONSTRAINT `pengajuans_instansi_id_foreign` FOREIGN KEY (`instansi_id`) REFERENCES `instansis` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 6. TABEL pesertas
-- Deskripsi: Data peserta magang
-- ------------------------------------------------------------
CREATE TABLE `pesertas` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `pengajuan_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `instansi_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `bidang_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `pembimbing_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `nim_nisn` VARCHAR(255) NULL DEFAULT NULL,
  `nama` VARCHAR(255) NOT NULL,
  `jurusan` VARCHAR(255) NULL DEFAULT NULL,
  `deleted_at` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pesertas_user_id_foreign` (`user_id`),
  KEY `pesertas_pengajuan_id_foreign` (`pengajuan_id`),
  KEY `pesertas_instansi_id_foreign` (`instansi_id`),
  KEY `pesertas_bidang_id_foreign` (`bidang_id`),
  KEY `pesertas_pembimbing_id_foreign` (`pembimbing_id`),
  CONSTRAINT `pesertas_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pesertas_pengajuan_id_foreign` FOREIGN KEY (`pengajuan_id`) REFERENCES `pengajuans` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pesertas_instansi_id_foreign` FOREIGN KEY (`instansi_id`) REFERENCES `instansis` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pesertas_bidang_id_foreign` FOREIGN KEY (`bidang_id`) REFERENCES `bidangs` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `pesertas_pembimbing_id_foreign` FOREIGN KEY (`pembimbing_id`) REFERENCES `pembimbings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 7. TABEL absensis
-- Deskripsi: Data presensi / kehadiran harian
-- ------------------------------------------------------------
CREATE TABLE `absensis` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `peserta_id` BIGINT UNSIGNED NOT NULL,
  `tanggal` DATE NOT NULL,
  `status` VARCHAR(255) NOT NULL COMMENT 'Hadir / Izin / Sakit / Alpa',
  `keterangan` TEXT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `absensis_peserta_id_foreign` (`peserta_id`),
  CONSTRAINT `absensis_peserta_id_foreign` FOREIGN KEY (`peserta_id`) REFERENCES `pesertas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- 8. TABEL penilaians
-- Deskripsi: Data nilai peserta oleh pembimbing
-- ------------------------------------------------------------
CREATE TABLE `penilaians` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `peserta_id` BIGINT UNSIGNED NOT NULL,
  `pembimbing_id` BIGINT UNSIGNED NULL DEFAULT NULL,
  `nilai_angka` DECIMAL(5,2) NULL DEFAULT NULL,
  `keterangan` TEXT NULL DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `penilaians_peserta_id_foreign` (`peserta_id`),
  KEY `penilaians_pembimbing_id_foreign` (`pembimbing_id`),
  CONSTRAINT `penilaians_peserta_id_foreign` FOREIGN KEY (`peserta_id`) REFERENCES `pesertas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `penilaians_pembimbing_id_foreign` FOREIGN KEY (`pembimbing_id`) REFERENCES `pembimbings` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------
-- DATA SAMPLE (Default Admin User)
-- ------------------------------------------------------------
INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `created_at`, `updated_at`) 
VALUES (1, 'Administrator', 'admin@admin.com', '$2y$12$e0MYzXyjpJS7Pd0RVvHwHe1T9D1tLzS1WqH9L.X.xZ5yGzJz1.O2S', 1, NOW(), NOW())
ON DUPLICATE KEY UPDATE `id`=`id`;
