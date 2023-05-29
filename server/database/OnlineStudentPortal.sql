-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 17, 2023 at 07:04 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 7.4.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `OnlineStudentPortal`
--

-- --------------------------------------------------------

--
-- Table structure for table `application`
--

CREATE TABLE `application` (
  `application_id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `program_id_1` int(11) DEFAULT NULL,
  `program_id_2` int(11) DEFAULT NULL,
  `program_id_3` int(11) DEFAULT NULL,
  `application_status` varchar(255) NOT NULL,
  `application_date` date NOT NULL,
  `decision_date` date DEFAULT NULL,
  `form_state` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `degree`
--

CREATE TABLE `degree` (
  `degree_id` int(11) NOT NULL,
  `degree_name` varchar(255) NOT NULL,
  `degree_description` text DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

CREATE TABLE `document` (
  `document_id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `document_name` varchar(255) NOT NULL,
  `document_file_name` varchar(255) NOT NULL,
  `upload_date` date NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `education`
--

CREATE TABLE `education` (
  `education_id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `degree_type` varchar(255) NOT NULL,
  `qualification` varchar(255) NOT NULL,
  `institution_name` varchar(255) NOT NULL,
  `institution_location` varchar(255) NOT NULL,
  `graduation_date` date NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `passing_year` int(11) NOT NULL,
  `total_marks` double NOT NULL,
  `obtained_marks` double NOT NULL,
  `CGPA` double NOT NULL,
  `percentage_criteria` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `program`
--

CREATE TABLE `program` (
  `program_id` int(11) NOT NULL,
  `program_name` varchar(255) NOT NULL,
  `program_type` varchar(255) NOT NULL,
  `program_description` text DEFAULT NULL,
  `degree_id` int(11) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `student_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `email_address` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `relegion` varchar(50) DEFAULT NULL,
  `mother_name` varchar(100) DEFAULT NULL,
  `father_name` varchar(100) NOT NULL,
  `father_contact` varchar(50) DEFAULT NULL,
  `father_occupation` varchar(100) DEFAULT NULL,
  `passport_number` varchar(30) DEFAULT NULL,
  `family_member` int(11) DEFAULT NULL,
  `t_address` varchar(255) DEFAULT NULL,
  `land_line` varchar(20) DEFAULT NULL,
  `t_city` varchar(255) DEFAULT NULL,
  `t_state` varchar(255) DEFAULT NULL,
  `t_zip_code` varchar(255) DEFAULT NULL,
  `t_country` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `student`
--

INSERT INTO `student` (`student_id`, `user_id`, `first_name`, `last_name`, `date_of_birth`, `gender`, `phone_number`, `image`, `email_address`, `address`, `city`, `state`, `zip_code`, `country`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`, `relegion`, `mother_name`, `father_name`, `father_contact`, `father_occupation`, `passport_number`, `family_member`, `t_address`, `land_line`, `t_city`, `t_state`, `t_zip_code`, `t_country`) VALUES
(4, NULL, 'Muhammad', 'Khan', '2023-05-06', 'male', '03155038994', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-05-02 10:53:37', '2023-05-02 10:53:37', NULL, NULL, NULL, 'Abdullah', 'Muhammad', '03155038994', 'Khan', NULL, NULL, NULL, '03155038994', NULL, NULL, NULL, NULL),
(5, NULL, 'Muhammad', 'Khan', '2023-05-06', 'male', '03155038994', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-05-02 10:57:21', '2023-05-02 10:57:21', NULL, NULL, NULL, 'Abdullah', 'Muhammad', '03155038994', 'Khan', NULL, NULL, NULL, '03155038994', NULL, NULL, NULL, NULL),
(6, NULL, 'Muhammad', 'Khan', '2023-05-06', 'male', '03155038994', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-05-02 11:03:37', '2023-05-02 11:03:37', NULL, NULL, NULL, 'Abdullah', 'Muhammad', '03155038994', 'Khan', NULL, NULL, NULL, '03155038994', NULL, NULL, NULL, NULL),
(7, NULL, 'Muhammad', 'Khan', '2023-05-09', 'male', '03155038994', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-05-02 11:05:35', '2023-05-02 11:05:35', NULL, NULL, NULL, 'Abdullah', 'Muhammad', '03155038994', 'Khan', NULL, NULL, NULL, '03155038994', NULL, NULL, NULL, NULL),
(8, NULL, 'Theodore', 'Brooks', '1972-03-17', 'male', '03155038994', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-05-05 11:56:18', '2023-05-05 11:56:18', NULL, NULL, NULL, 'Deacon Cardenas', 'Rudyard', '+1 (626) 194-7829', 'Buckley', NULL, NULL, NULL, '+1 (101) 254-2507', NULL, NULL, NULL, NULL),
(9, NULL, 'Francesca', 'Hale', '2019-12-25', 'male', '03155038994', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-05-05 12:05:33', '2023-05-05 12:05:33', NULL, NULL, NULL, 'Heidi Pickett', 'Shelby', '+1 (474) 322-9675', 'Alexander', NULL, NULL, NULL, '+1 (418) 518-3238', NULL, NULL, NULL, NULL),
(10, NULL, 'Muhammad', 'Khan', '2023-05-11', 'male', '03155038994', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-05-05 12:08:14', '2023-05-05 12:08:14', NULL, NULL, NULL, 'Abdullah', 'Muhammad', '03155038994', 'Khan', NULL, NULL, NULL, '03155038994', NULL, NULL, NULL, NULL),
(11, NULL, 'Muhammad', 'Khan', '2023-05-02', 'male', '03155038994', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-05-05 12:23:35', '2023-05-05 12:23:35', NULL, NULL, NULL, 'Abdullah', 'Muhammad', '03155038994', 'Khan', NULL, NULL, NULL, '03155038994', NULL, NULL, NULL, NULL),
(12, NULL, 'Muhammad', 'Khan', '2023-05-04', 'male', '03155038994', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-05-05 12:24:43', '2023-05-05 12:24:43', NULL, NULL, NULL, 'Abdullah', 'Muhammad', '03155038994', 'Khan', NULL, NULL, NULL, '03155038994', NULL, NULL, NULL, NULL),
(13, NULL, 'Muhammad', 'Khan', '2023-05-04', 'male', '03155038994', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-05-05 12:27:40', '2023-05-05 12:27:40', NULL, NULL, NULL, 'Abdullah', 'Muhammad', '03155038994', 'Khan', NULL, NULL, NULL, '03155038994', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `test`
--

CREATE TABLE `test` (
  `test_id` int(11) NOT NULL,
  `test_name` varchar(255) NOT NULL,
  `test_type` varchar(255) NOT NULL,
  `test_description` text DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `test_score`
--

CREATE TABLE `test_score` (
  `test_score_id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `test_id` int(11) DEFAULT NULL,
  `test_score` int(11) NOT NULL,
  `test_date` date NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` varchar(30) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `email`, `password`, `role`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(55, 'mak@gmail.com', '$2y$10$qWuBdks3iH8GXtaZcP7/neU3UecSvjuzKndTetXkbqXpMCyYk.ByW', 'Student', 'Active', '2023-04-26 06:56:29', '2023-04-26 06:56:29', 'mak@gmail.com', NULL),
(56, 'mak30497@gmail.com', '$2y$10$L6V35OcM2MA5aMVYauxNiuth9LOjKtPUNmKLAJJ3bcadVbXHiqF1W', 'Student', 'Active', '2023-04-28 05:21:44', '2023-04-28 05:21:44', 'mak30497@gmail.com', NULL),
(57, 'asas@gmail.com', '$2y$10$5lnFO1Xj5wVO49.06uln4eoogIC6anf1Othk4sjjQzEHdoLfaw0Du', 'Student', 'Active', '2023-04-28 05:22:50', '2023-04-28 05:22:50', 'asas@gmail.com', NULL),
(58, 'mak304957@gmail.comss', '$2y$10$djmMHxqmnRw4PB4miwt3ve/I4mzuyMk1gdGq61B6d.b5FDcUSRbDe', 'Student', 'Active', '2023-04-28 05:23:33', '2023-04-28 05:23:33', 'mak304957@gmail.comss', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `voucher`
--

CREATE TABLE `voucher` (
  `voucher_id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `voucher_code` varchar(255) NOT NULL,
  `voucher_file_name` varchar(255) NOT NULL,
  `upload_date` date NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` datetime DEFAULT NULL,
  `updated_at` datetime DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `application`
--
ALTER TABLE `application`
  ADD PRIMARY KEY (`application_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `degree`
--
ALTER TABLE `degree`
  ADD PRIMARY KEY (`degree_id`);

--
-- Indexes for table `document`
--
ALTER TABLE `document`
  ADD PRIMARY KEY (`document_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `education`
--
ALTER TABLE `education`
  ADD PRIMARY KEY (`education_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `program`
--
ALTER TABLE `program`
  ADD PRIMARY KEY (`program_id`),
  ADD KEY `degree_id` (`degree_id`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `test`
--
ALTER TABLE `test`
  ADD PRIMARY KEY (`test_id`);

--
-- Indexes for table `test_score`
--
ALTER TABLE `test_score`
  ADD PRIMARY KEY (`test_score_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `voucher`
--
ALTER TABLE `voucher`
  ADD PRIMARY KEY (`voucher_id`),
  ADD KEY `student_id` (`student_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `application`
--
ALTER TABLE `application`
  MODIFY `application_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `degree`
--
ALTER TABLE `degree`
  MODIFY `degree_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `document`
--
ALTER TABLE `document`
  MODIFY `document_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `education`
--
ALTER TABLE `education`
  MODIFY `education_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `program`
--
ALTER TABLE `program`
  MODIFY `program_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `test`
--
ALTER TABLE `test`
  MODIFY `test_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `test_score`
--
ALTER TABLE `test_score`
  MODIFY `test_score_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `voucher`
--
ALTER TABLE `voucher`
  MODIFY `voucher_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `application`
--
ALTER TABLE `application`
  ADD CONSTRAINT `application_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`);

--
-- Constraints for table `document`
--
ALTER TABLE `document`
  ADD CONSTRAINT `document_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`);

--
-- Constraints for table `education`
--
ALTER TABLE `education`
  ADD CONSTRAINT `education_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`);

--
-- Constraints for table `program`
--
ALTER TABLE `program`
  ADD CONSTRAINT `program_ibfk_1` FOREIGN KEY (`degree_id`) REFERENCES `degree` (`degree_id`);

--
-- Constraints for table `student`
--
ALTER TABLE `student`
  ADD CONSTRAINT `student_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `test_score`
--
ALTER TABLE `test_score`
  ADD CONSTRAINT `test_score_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`);

--
-- Constraints for table `voucher`
--
ALTER TABLE `voucher`
  ADD CONSTRAINT `voucher_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
