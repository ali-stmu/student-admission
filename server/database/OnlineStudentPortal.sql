-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 19, 2023 at 07:16 AM
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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `degree`
--

INSERT INTO `degree` (`degree_id`, `degree_name`, `degree_description`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 'Matric', 'Testing Description Matric', '', NULL, NULL, NULL, NULL),
(2, 'Intermediate', 'Description Intermediate', '1', NULL, NULL, NULL, NULL),
(3, 'Bachelors', 'Testing Bachelors', '1', NULL, NULL, NULL, NULL),
(4, 'Masters', 'Description Masters', '', NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `document`
--

CREATE TABLE `document` (
  `document_id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `degree_id` int(255) NOT NULL,
  `document_file_path` varchar(255) NOT NULL,
  `upload_date` date NOT NULL DEFAULT current_timestamp(),
  `status` varchar(255) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `document`
--

INSERT INTO `document` (`document_id`, `student_id`, `degree_id`, `document_file_path`, `upload_date`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(83, 26, 1, 'degrees/gzJ2h8zjkw60uTaxeGqotlCjT5roBs6Zpk0i3cpQ.pdf', '2023-06-15', '1', '2023-06-15 05:48:19', '2023-06-15 05:48:19', NULL, NULL),
(84, 26, 4, 'degrees/f2VFaTRiTNlKQwKEm50fX2x1aCKzkHntvpYPnUcM.jpg', '2023-06-15', '1', '2023-06-15 05:48:19', '2023-06-15 05:48:19', NULL, NULL),
(85, 27, 1, 'degrees/42e8y6Ph6RlIrlD2yqSrbjqcv8PUYb7pX07SSTIO.jpg', '2023-06-15', '1', '2023-06-15 06:09:58', '2023-06-15 06:09:58', NULL, NULL),
(86, 27, 2, 'degrees/EJobtgQj6dCHqRwQVbZgJIQucLEARoWDqqJ1Ql6E.jpg', '2023-06-15', '1', '2023-06-15 06:09:58', '2023-06-15 06:09:58', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `education`
--

CREATE TABLE `education` (
  `education_id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `degree_id` int(255) NOT NULL,
  `institution_name` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `passing_year` int(11) NOT NULL,
  `total_marks` double NOT NULL,
  `obtained_marks` double NOT NULL,
  `percentage_criteria` double NOT NULL,
  `result_status` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `education`
--

INSERT INTO `education` (`education_id`, `student_id`, `degree_id`, `institution_name`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`, `passing_year`, `total_marks`, `obtained_marks`, `percentage_criteria`, `result_status`) VALUES
(89, 26, 1, 'asdasdsdddddddd', '1', '2023-06-15 05:48:19', '2023-06-15 05:48:19', NULL, NULL, 2, 2, 2, 100, 'awaited'),
(90, 26, 4, 'asdasdsdddddddd', '1', '2023-06-15 05:48:19', '2023-06-15 05:48:19', NULL, NULL, 2, 3, 3, 100, 'awaited'),
(91, 27, 1, 'asdasdsdddddddd', '1', '2023-06-15 06:09:58', '2023-06-15 06:09:58', NULL, NULL, 22, 2, 2, 100, 'awaited'),
(92, 27, 2, '22', '1', '2023-06-15 06:09:58', '2023-06-15 06:09:58', NULL, NULL, 2, 2, 2, 100, 'declared');

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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `program_criteria` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `program`
--

INSERT INTO `program` (`program_id`, `program_name`, `program_type`, `program_description`, `degree_id`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`, `program_criteria`) VALUES
(1, 'BS Computer Science', 'Bachelors', 'Test desription', 2, '1', '0000-00-00 00:00:00', NULL, NULL, NULL, 65),
(2, 'BS Software Engineering ', 'Bachelors', 'Test Description', 1, '1', NULL, NULL, NULL, NULL, 60),
(3, 'BS Data Science ', 'Bachelors', 'Test Description', 2, '1', NULL, NULL, NULL, NULL, 50),
(4, 'BS Artificial Intelligence', 'Bachelors', 'Testing Description', 2, '', NULL, NULL, NULL, NULL, 45),
(5, 'Master in Computer Science', 'Masters', 'Description of MSCS', 3, '1', NULL, NULL, NULL, NULL, 55);

-- --------------------------------------------------------

--
-- Table structure for table `program_degree`
--

CREATE TABLE `program_degree` (
  `program_degree_id` int(11) NOT NULL,
  `program_id` int(11) NOT NULL,
  `degree_id` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `created_by` varchar(200) NOT NULL,
  `updated_by` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `program_degree`
--

INSERT INTO `program_degree` (`program_degree_id`, `program_id`, `degree_id`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(1, 2, 2, 1, '2023-06-07 10:24:25', '2023-06-07 10:33:10', '', ''),
(2, 1, 2, 1, '2023-06-07 10:26:38', NULL, '', ''),
(3, 3, 2, 1, '2023-06-07 10:27:10', NULL, '', ''),
(4, 4, 2, 1, '2023-06-07 10:27:20', NULL, '', '');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `student_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) NOT NULL,
  `middle_name` varchar(255) DEFAULT NULL,
  `date_of_birth` date NOT NULL,
  `gender` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `cnic` varchar(255) NOT NULL,
  `religion` varchar(25) NOT NULL,
  `city` varchar(255) DEFAULT NULL,
  `state` varchar(255) DEFAULT NULL,
  `zip_code` varchar(255) DEFAULT NULL,
  `country` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
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

INSERT INTO `student` (`student_id`, `user_id`, `first_name`, `last_name`, `middle_name`, `date_of_birth`, `gender`, `phone_number`, `image`, `address`, `cnic`, `religion`, `city`, `state`, `zip_code`, `country`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`, `relegion`, `mother_name`, `father_name`, `father_contact`, `father_occupation`, `passport_number`, `family_member`, `t_address`, `land_line`, `t_city`, `t_state`, `t_zip_code`, `t_country`) VALUES
(16, 55, 'Muhammadasas', 'Khan', 'null', '2023-05-02', 'male', '03155038997', '/studentsImages/1686553353.jpeg', 'sd', '38201-8723031-7', 'christianity', 'asd', 'sd', 'sd', 'sd', NULL, '2023-05-29 01:37:04', '2023-06-14 02:48:25', NULL, NULL, NULL, 'Abdullahsasa', 'Muhammad', '03155038994', 'Khan', NULL, NULL, 'house 571 street 17 margalla town', '03155038994', 'islamabad', 'as', '44000', 'as'),
(26, 71, 'test', 'test', 'test', '2023-06-13', 'male', '03155038994', '/studentsImages/1686825586.jpeg', 'house 571 street 17 margalla town', '38201-8723031-7', 'islam', 'islamabad', 'islamabad', '44000', 'pakistan', NULL, '2023-06-15 05:39:46', '2023-06-15 05:39:52', NULL, NULL, NULL, 'test', 'test', 'test', 'test', NULL, NULL, 'house 571 street 17 margalla town', 'test', 'islamabad', 'islamabad', '44000', 'pakistan'),
(27, 72, 'zxc', 'zxc', 'zxc', '2023-06-08', 'male', '03155038994', '/studentsImages/1686827373.jpeg', 'house 571 street 17 margalla town', '38201-8723031-7', 'islam', 'islamabad', 'islamabad', '44000', 'Pakistan', NULL, '2023-06-15 06:09:33', '2023-06-15 06:09:41', NULL, NULL, NULL, 'zxc', 'zx', 'cccc', 'zx', NULL, NULL, 'house 571 street 17 margalla town', 'cccc', 'islamabad', 'islamabad', '44000', 'Pakistan');

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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `created_by` varchar(30) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `email`, `password`, `role`, `status`, `created_at`, `updated_at`, `created_by`, `updated_by`) VALUES
(55, 'mak@gmail.com', '$2y$10$qWuBdks3iH8GXtaZcP7/neU3UecSvjuzKndTetXkbqXpMCyYk.ByW', 'Student', 'Active', '2023-04-26 01:56:29', '2023-04-26 01:56:29', 'mak@gmail.com', NULL),
(71, 'test@gmail.com', '$2y$10$Ox5wYmdPLbbJwfzP/oeynOwTPcjzh/ExzbdWNKMPY7AjJVa8AWAei', 'Student', 'Active', '2023-06-15 05:36:22', '2023-06-15 05:36:22', 'test@gmail.com', NULL),
(72, '1122@gmail.com', '$2y$10$VWfnHF5aiOOJ8zkkx5YYmuqirgn.nyWW8rrNcQASc6gqnnRGCAUQK', 'Student', 'Active', '2023-06-15 06:07:42', '2023-06-15 06:07:42', '1122@gmail.com', NULL);

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
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
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
  ADD KEY `student_id` (`student_id`),
  ADD KEY `fk_degree_id` (`degree_id`);

--
-- Indexes for table `education`
--
ALTER TABLE `education`
  ADD PRIMARY KEY (`education_id`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `fk_education_degree` (`degree_id`);

--
-- Indexes for table `program`
--
ALTER TABLE `program`
  ADD PRIMARY KEY (`program_id`),
  ADD KEY `degree_id` (`degree_id`);

--
-- Indexes for table `program_degree`
--
ALTER TABLE `program_degree`
  ADD PRIMARY KEY (`program_degree_id`),
  ADD KEY `fk_program_degree_program` (`program_id`),
  ADD KEY `fk_program_degree_degree` (`degree_id`);

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
  MODIFY `degree_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `document`
--
ALTER TABLE `document`
  MODIFY `document_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=87;

--
-- AUTO_INCREMENT for table `education`
--
ALTER TABLE `education`
  MODIFY `education_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- AUTO_INCREMENT for table `program`
--
ALTER TABLE `program`
  MODIFY `program_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `program_degree`
--
ALTER TABLE `program_degree`
  MODIFY `program_degree_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `student`
--
ALTER TABLE `student`
  MODIFY `student_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

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
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

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
  ADD CONSTRAINT `document_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  ADD CONSTRAINT `fk_degree_id` FOREIGN KEY (`degree_id`) REFERENCES `degree` (`degree_id`);

--
-- Constraints for table `education`
--
ALTER TABLE `education`
  ADD CONSTRAINT `education_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`),
  ADD CONSTRAINT `fk_education_degree` FOREIGN KEY (`degree_id`) REFERENCES `degree` (`degree_id`);

--
-- Constraints for table `program`
--
ALTER TABLE `program`
  ADD CONSTRAINT `program_ibfk_1` FOREIGN KEY (`degree_id`) REFERENCES `degree` (`degree_id`);

--
-- Constraints for table `program_degree`
--
ALTER TABLE `program_degree`
  ADD CONSTRAINT `fk_program_degree_degree` FOREIGN KEY (`degree_id`) REFERENCES `degree` (`degree_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_program_degree_program` FOREIGN KEY (`program_id`) REFERENCES `program` (`program_id`) ON DELETE CASCADE;

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
