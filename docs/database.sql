-- ============================================================================
-- DATABASE SCHEMA FOR FLIPBOOK E-MODUL KKA SMAN 1 PALEMBANG
-- Dialect: MySQL 8.0+ / MariaDB 10.4+
-- Versi: 2.0 (Tanpa Login - Skor Anonim)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `db_flipbook_kka`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `db_flipbook_kka`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `skor_siswa`;
DROP TABLE IF EXISTS `bab`;
DROP TABLE IF EXISTS `buku`;

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 1. TABEL BUKU (E-Book Master)
-- ============================================================================
CREATE TABLE `buku` (
  `id_buku`        VARCHAR(50)  NOT NULL,
  `judul_buku`     VARCHAR(255) NOT NULL,
  `mata_pelajaran` VARCHAR(100) NOT NULL,
  `tingkat_kelas`  VARCHAR(50)  NOT NULL,
  `kurikulum`      VARCHAR(50)  NOT NULL,
  `deskripsi`      TEXT         NULL,
  `total_bab`      INT          NOT NULL DEFAULT 6,
  `created_at`     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_buku`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 2. TABEL BAB (Chapters)
-- ============================================================================
CREATE TABLE `bab` (
  `id_bab`               VARCHAR(50)  NOT NULL,
  `id_buku`              VARCHAR(50)  NOT NULL,
  `nomor_bab`            INT          NOT NULL,
  `judul_bab`            VARCHAR(255) NOT NULL,
  `deskripsi_bab`        TEXT         NULL,
  `ikon_bab`             VARCHAR(20)  NULL,
  `warna_tema_primary`   VARCHAR(50)  DEFAULT 'teal',
  `warna_tema_secondary` VARCHAR(50)  DEFAULT 'purple',
  `lottie_url`           VARCHAR(500) NULL,
  `jumlah_halaman`       INT          DEFAULT 0,
  `jumlah_soal`          INT          DEFAULT 20,
  `created_at`           TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  `updated_at`           TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_bab`),
  INDEX `idx_bab_buku` (`id_buku`),
  CONSTRAINT `fk_bab_buku` FOREIGN KEY (`id_buku`)
    REFERENCES `buku` (`id_buku`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- 3. TABEL SKOR SISWA (Penyimpanan Skor Anonim - Tanpa Login)
-- ============================================================================
CREATE TABLE `skor_siswa` (
  `id`          INT          NOT NULL AUTO_INCREMENT,
  `nama_siswa`  VARCHAR(100) NOT NULL,
  `id_bab`      VARCHAR(50)  NOT NULL,
  `tipe`        ENUM('latihan','ujian') NOT NULL,
  `skor`        INT          NOT NULL DEFAULT 0,
  `created_at`  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_skor_bab` (`id_bab`),
  INDEX `idx_skor_nama` (`nama_siswa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================================
-- SEED DATA
-- ============================================================================

-- Data Buku
INSERT INTO `buku` (`id_buku`, `judul_buku`, `mata_pelajaran`, `tingkat_kelas`, `kurikulum`, `deskripsi`, `total_bab`) VALUES
('BUKU-KKA-10',
 'E-Modul Interaktif Koding & Kecerdasan Artifisial SMA Kelas 10',
 'Koding dan Kecerdasan Artifisial',
 '10',
 'Kurikulum Merdeka',
 'E-Modul interaktif dengan flipbook digital, soal latihan formatif, dan ujian analitis sumatif untuk SMA Kelas 10.',
 6);

-- Data Bab (6 Bab)
INSERT INTO `bab` (`id_bab`, `id_buku`, `nomor_bab`, `judul_bab`, `deskripsi_bab`, `ikon_bab`, `warna_tema_primary`, `warna_tema_secondary`, `lottie_url`, `jumlah_halaman`, `jumlah_soal`) VALUES
('BAB-1', 'BUKU-KKA-10', 1,
 'Berpikir Komputasional',
 'Pelajari 4 fondasi berpikir komputasional: Dekomposisi, Abstraksi, Pengenalan Pola, dan Algoritma.',
 '🧠', 'teal', 'purple',
 'https://assets3.lottiefiles.com/packages/lf20_sk5h1kfn.json',
 16, 20),

('BAB-2', 'BUKU-KKA-10', 2,
 'Algoritma & Pemrograman Lanjut',
 'Flowchart, struktur kontrol, percabangan, perulangan, dan teknik debugging dalam pemrograman.',
 '💻', 'blue', 'pink',
 'https://assets2.lottiefiles.com/packages/lf20_w51pcehl.json',
 16, 20),

('BAB-3', 'BUKU-KKA-10', 3,
 'Literasi & Etika Kecerdasan Artifisial',
 'Bagaimana AI mengenali gambar dan suara, etika penggunaan AI, bias data, dan karir di bidang AI.',
 '🤖', 'green', 'orange',
 'https://assets5.lottiefiles.com/packages/lf20_5e7wgehs.json',
 16, 20),

('BAB-4', 'BUKU-KKA-10', 4,
 'Prompt Engineering & Design Thinking',
 'Cara berkomunikasi efektif dengan AI Generatif dan merancang solusi berbasis desain berpusat pada pengguna.',
 '✨', 'red', 'yellow',
 'https://assets7.lottiefiles.com/packages/lf20_khzniaya.json',
 16, 20),

('BAB-5', 'BUKU-KKA-10', 5,
 'Kreativitas & Etika Konten Media Sosial',
 'Produksi multimedia, etika digital, copyright HAKI, dan tanggung jawab dalam membuat konten.',
 '🎬', 'indigo', 'rose',
 'https://assets3.lottiefiles.com/packages/lf20_rwq6ciql.json',
 16, 20),

('BAB-6', 'BUKU-KKA-10', 6,
 'Pengelolaan Informasi Digital',
 'Database relasional, perintah SQL dasar CRUD, manajemen server lokal, dan keamanan data.',
 '🗄️', 'cyan', 'amber',
 'https://assets10.lottiefiles.com/packages/lf20_jzzuzxus.json',
 16, 20);
