-- phpMyAdmin SQL Dump
-- version 5.1.1deb5ubuntu1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Nov 06, 2022 at 07:35 PM
-- Server version: 8.0.31-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `Adopte1Api`
--
CREATE DATABASE IF NOT EXISTS `Adopte1Api` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `Adopte1Api`;

-- --------------------------------------------------------

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
CREATE TABLE `Users` (
  `id` int NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `last_name` varchar(50) NOT NULL,
  `first_name` varchar(50) NOT NULL,
  `GoogleAuth` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `BattleNetAuth` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Reddit` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `Spotify` varchar(500) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL,
  `widgets` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `Users`
--

INSERT INTO `Users` (`id`, `email`, `password`, `last_name`, `first_name`, `GoogleAuth`, `BattleNetAuth`, `Reddit`, `Spotify`, `widgets`) VALUES
(1, 'admin@admin.com', 'admin', 'admin', 'admin', NULL, NULL, NULL, NULL, 'null'),
(2, 'admintest@admin.com', '$2a$10$7y.olRNPd9n1IuKitCjJN.HpLoZbGzYEGXY.sDpNuhK2S8tmh5wC6', 'admin', 'admin', NULL, NULL, NULL, NULL, 'null'),
(3, 'test@test.com', '$2a$10$y7xy/2tujf578yewcSBaBeMUp4uqlKNgkxkoJInc3tspxb/3QEmNG', 'test', 'test', NULL, NULL, NULL, NULL, 'null'),
(5, 'lepavecmike@gmail.com', NULL, 'Le Pavec', 'Mike', 'ya29.a0AeTM1idQtMI0yoybvODRfreocK1gO_1qAdGp_Q8g24xeAJmpArmw8NtXL0yeTDIyRRqY2g6U4Z5wB_GdWdTvrMVnGWKwb0ObBCt7mkI9II8uAH9qFp_711wNw-8hQ_YeBjxNvgvCz-wxv1HbGxwVGgSwaa5xSAaCgYKAQgSARESFQHWtWOmcskyZNzYXy7DJtBH9bj0zQ0165', 'EULyC1xZJkStF4bMg1lfTvjHTNVskb67Cz', NULL, NULL, '[{\"name\": \"AuctionHouse\", \"width\": \"750px\", \"height\": \"200px\"}]');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Users`
--
ALTER TABLE `Users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Users`
--
ALTER TABLE `Users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
