-- MariaDB dump 10.19  Distrib 10.4.28-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: onlinestudentportal
-- ------------------------------------------------------
-- Server version	10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `application`
--

DROP TABLE IF EXISTS `application`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `application` (
  `application_id` int(11) NOT NULL AUTO_INCREMENT,
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
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`application_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `application_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `application`
--

LOCK TABLES `application` WRITE;
/*!40000 ALTER TABLE `application` DISABLE KEYS */;
/*!40000 ALTER TABLE `application` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `degree`
--

DROP TABLE IF EXISTS `degree`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `degree` (
  `degree_id` int(11) NOT NULL AUTO_INCREMENT,
  `degree_name` varchar(255) NOT NULL,
  `degree_description` text DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`degree_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `degree`
--

LOCK TABLES `degree` WRITE;
/*!40000 ALTER TABLE `degree` DISABLE KEYS */;
INSERT INTO `degree` VALUES (1,'Matric','Testing Description Matric','',NULL,NULL,NULL,NULL),(2,'Intermediate','Description Intermediate','1',NULL,NULL,NULL,NULL),(3,'Bachelors','Testing Bachelors','1',NULL,NULL,NULL,NULL),(4,'Masters','Description Masters','',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `degree` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document`
--

DROP TABLE IF EXISTS `document`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `document` (
  `document_id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) DEFAULT NULL,
  `document_name` varchar(255) NOT NULL,
  `document_file_name` varchar(255) NOT NULL,
  `upload_date` date NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`document_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `document_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document`
--

LOCK TABLES `document` WRITE;
/*!40000 ALTER TABLE `document` DISABLE KEYS */;
/*!40000 ALTER TABLE `document` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `education`
--

DROP TABLE IF EXISTS `education`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `education` (
  `education_id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) DEFAULT NULL,
  `degree_type` varchar(255) NOT NULL,
  `qualification` varchar(255) NOT NULL,
  `institution_name` varchar(255) NOT NULL,
  `institution_location` varchar(255) NOT NULL,
  `graduation_date` date NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `passing_year` int(11) NOT NULL,
  `total_marks` double NOT NULL,
  `obtained_marks` double NOT NULL,
  `CGPA` double NOT NULL,
  `percentage_criteria` double NOT NULL,
  PRIMARY KEY (`education_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `education_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `education`
--

LOCK TABLES `education` WRITE;
/*!40000 ALTER TABLE `education` DISABLE KEYS */;
/*!40000 ALTER TABLE `education` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `program`
--

DROP TABLE IF EXISTS `program`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `program` (
  `program_id` int(11) NOT NULL AUTO_INCREMENT,
  `program_name` varchar(255) NOT NULL,
  `program_type` varchar(255) NOT NULL,
  `program_description` text DEFAULT NULL,
  `degree_id` int(11) DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  `program_criteria` double NOT NULL,
  PRIMARY KEY (`program_id`),
  KEY `degree_id` (`degree_id`),
  CONSTRAINT `program_ibfk_1` FOREIGN KEY (`degree_id`) REFERENCES `degree` (`degree_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program`
--

LOCK TABLES `program` WRITE;
/*!40000 ALTER TABLE `program` DISABLE KEYS */;
INSERT INTO `program` VALUES (1,'BS Computer Science','Bachelors','Test desription',2,'1','0000-00-00 00:00:00',NULL,NULL,NULL,65),(2,'BS Software Engineering ','Bachelors','Test Description',1,'1',NULL,NULL,NULL,NULL,60),(3,'BS Data Science ','Bachelors','Test Description',2,'1',NULL,NULL,NULL,NULL,50),(4,'BS Artificial Intelligence','Bachelors','Testing Description',2,'',NULL,NULL,NULL,NULL,45),(5,'Master in Computer Science','Masters','Description of MSCS',3,'1',NULL,NULL,NULL,NULL,55);
/*!40000 ALTER TABLE `program` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `program_degree`
--

DROP TABLE IF EXISTS `program_degree`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `program_degree` (
  `program_degree_id` int(11) NOT NULL AUTO_INCREMENT,
  `program_id` int(11) NOT NULL,
  `degree_id` int(11) NOT NULL,
  `status` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `created_by` varchar(200) NOT NULL,
  `updated_by` varchar(200) NOT NULL,
  PRIMARY KEY (`program_degree_id`),
  KEY `fk_program_degree_program` (`program_id`),
  KEY `fk_program_degree_degree` (`degree_id`),
  CONSTRAINT `fk_program_degree_degree` FOREIGN KEY (`degree_id`) REFERENCES `degree` (`degree_id`) ON DELETE CASCADE,
  CONSTRAINT `fk_program_degree_program` FOREIGN KEY (`program_id`) REFERENCES `program` (`program_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `program_degree`
--

LOCK TABLES `program_degree` WRITE;
/*!40000 ALTER TABLE `program_degree` DISABLE KEYS */;
INSERT INTO `program_degree` VALUES (1,2,2,1,'2023-06-07 10:24:25','2023-06-07 10:33:10','',''),(2,1,2,1,'2023-06-07 10:26:38',NULL,'',''),(3,3,2,1,'2023-06-07 10:27:10',NULL,'',''),(4,4,2,1,'2023-06-07 10:27:20',NULL,'','');
/*!40000 ALTER TABLE `program_degree` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `student` (
  `student_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `first_name` varchar(255) NOT NULL,
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
  `t_country` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`student_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (16,55,'Muhammadasas','Khan','null','2023-05-02','male','03155038997','/studentsImages/1685517578.jpg','sd','38201-8723031-7','christianity','asd','sd','sd','sd',NULL,'2023-05-29 01:37:04','2023-06-02 00:32:54',NULL,NULL,NULL,'Abdullahsasa','Muhammad','03155038994','Khan',NULL,NULL,NULL,'03155038994',NULL,NULL,NULL,NULL),(21,62,'zxczxc','zxczc','zxczc','2023-05-19','male','03155038994','/studentsImages/1685519658.jpg',NULL,'61101-8195831-5','hinduism',NULL,NULL,NULL,NULL,NULL,'2023-05-31 02:54:18','2023-05-31 02:54:18',NULL,NULL,NULL,'Abdullah','Muhammad','03155038994','Khan',NULL,NULL,NULL,'03155038994',NULL,NULL,NULL,NULL),(22,63,'Muhammadd','Khan','Abdullah','2023-05-10','male','03155038994','/studentsImages/1685521364.jpg',NULL,'61101-8195831-5','islam',NULL,NULL,NULL,NULL,NULL,'2023-05-31 03:22:44','2023-05-31 03:25:56',NULL,NULL,NULL,'Abdullah','Muhammad','0315503899','Khan',NULL,NULL,NULL,'03155038994',NULL,NULL,NULL,NULL),(23,68,'Muhammad Hamza','Asif','null','2023-05-09','male','03155038994','/studentsImages/1685521947.jpg','House 571-C Street 17 Margalla Town islamabad Phase 1','61101-8195831-5','christianity','Islamabad Pakistan','Islamabad','44000','Pakistan',NULL,'2023-05-31 03:32:27','2023-06-01 04:39:56',NULL,NULL,NULL,'Abdullah','Muhammad','03155038997','Khan',NULL,NULL,'House 571-C Street 17 Margalla Town islamabad Phase 1','03155038997','Islamabad Pakistan','Islamabad','44000','Pakistan');
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test`
--

DROP TABLE IF EXISTS `test`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `test` (
  `test_id` int(11) NOT NULL AUTO_INCREMENT,
  `test_name` varchar(255) NOT NULL,
  `test_type` varchar(255) NOT NULL,
  `test_description` text DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`test_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test`
--

LOCK TABLES `test` WRITE;
/*!40000 ALTER TABLE `test` DISABLE KEYS */;
/*!40000 ALTER TABLE `test` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `test_score`
--

DROP TABLE IF EXISTS `test_score`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `test_score` (
  `test_score_id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) DEFAULT NULL,
  `test_id` int(11) DEFAULT NULL,
  `test_score` int(11) NOT NULL,
  `test_date` date NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`test_score_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `test_score_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `test_score`
--

LOCK TABLES `test_score` WRITE;
/*!40000 ALTER TABLE `test_score` DISABLE KEYS */;
/*!40000 ALTER TABLE `test_score` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `created_by` varchar(30) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (55,'mak@gmail.com','$2y$10$qWuBdks3iH8GXtaZcP7/neU3UecSvjuzKndTetXkbqXpMCyYk.ByW','Student','Active','2023-04-26 01:56:29','2023-04-26 01:56:29','mak@gmail.com',NULL),(56,'mak30497@gmail.com','$2y$10$L6V35OcM2MA5aMVYauxNiuth9LOjKtPUNmKLAJJ3bcadVbXHiqF1W','Student','Active','2023-04-28 00:21:44','2023-04-28 00:21:44','mak30497@gmail.com',NULL),(57,'asas@gmail.com','$2y$10$5lnFO1Xj5wVO49.06uln4eoogIC6anf1Othk4sjjQzEHdoLfaw0Du','Student','Active','2023-04-28 00:22:50','2023-04-28 00:22:50','asas@gmail.com',NULL),(58,'mak304957@gmail.comss','$2y$10$djmMHxqmnRw4PB4miwt3ve/I4mzuyMk1gdGq61B6d.b5FDcUSRbDe','Student','Active','2023-04-28 00:23:33','2023-04-28 00:23:33','mak304957@gmail.comss',NULL),(61,'zxc@gmail.com','$2y$10$qWm4L9G6NyclY1EoQEQp7e8RWtHL7sB1r93QEEvaaSK3YauZEQ/g.','Student','Active','2023-05-31 02:24:12','2023-05-31 02:24:12','zxc@gmail.com',NULL),(62,'aa@gmail.com','$2y$10$YGkN7h4KRn5E.zjADhh0NO/PNpr6c6WLB93vvO/ApSTDSCLIFs2MK','Student','Active','2023-05-31 02:43:34','2023-05-31 02:43:34','aa@gmail.com',NULL),(63,'z@gmail.com','$2y$10$HeqjrCG8AubUljXvsaCpCupdkZ3NR8Azm6k5MPtKlR9Q.YD7S1CPa','Student','Active','2023-05-31 02:58:28','2023-05-31 02:58:28','z@gmail.com',NULL),(68,'ll@gmail.com','$2y$10$1WvdPuJHo3gzwSarXmnZE.Xpif76//IBf11MQPBnREXMWo5E3l5.C','Student','Active','2023-05-31 03:30:17','2023-05-31 03:30:17','ll@gmail.com',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voucher`
--

DROP TABLE IF EXISTS `voucher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `voucher` (
  `voucher_id` int(11) NOT NULL AUTO_INCREMENT,
  `student_id` int(11) DEFAULT NULL,
  `voucher_code` varchar(255) NOT NULL,
  `voucher_file_name` varchar(255) NOT NULL,
  `upload_date` date NOT NULL,
  `status` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE current_timestamp(),
  `created_by` int(11) DEFAULT NULL,
  `updated_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`voucher_id`),
  KEY `student_id` (`student_id`),
  CONSTRAINT `voucher_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voucher`
--

LOCK TABLES `voucher` WRITE;
/*!40000 ALTER TABLE `voucher` DISABLE KEYS */;
/*!40000 ALTER TABLE `voucher` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-07 15:42:29
