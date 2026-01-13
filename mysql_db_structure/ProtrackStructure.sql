CREATE DATABASE  IF NOT EXISTS `protrack` /*!40100 DEFAULT CHARACTER SET utf8mb3 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `protrack`;
-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: protrack
-- ------------------------------------------------------
-- Server version	8.0.31

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity`
--

DROP TABLE IF EXISTS `activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity` (
  `activity_name` varchar(100) DEFAULT NULL,
  `proj_id` int DEFAULT NULL,
  `activity_type` varchar(50) DEFAULT NULL,
  `useful` tinyint(1) DEFAULT NULL,
  `department` int DEFAULT NULL,
  `activity_id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`activity_id`),
  KEY `department` (`department`),
  KEY `proj_id` (`proj_id`),
  CONSTRAINT `activity_ibfk_1` FOREIGN KEY (`department`) REFERENCES `departments` (`dep_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `activity_ibfk_2` FOREIGN KEY (`proj_id`) REFERENCES `projects` (`proj_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1018 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `activity_masters`
--

DROP TABLE IF EXISTS `activity_masters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_masters` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `type_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `type_id` (`type_id`),
  CONSTRAINT `activity_masters_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `activity_types` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=137 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `activity_types`
--

DROP TABLE IF EXISTS `activity_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_types` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type_name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type_name` (`type_name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `assigned_leave`
--

DROP TABLE IF EXISTS `assigned_leave`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `assigned_leave` (
  `assigned_leave_id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `leave_type_id` int NOT NULL,
  `max_leaves` decimal(5,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`assigned_leave_id`),
  KEY `employee_id` (`employee_id`),
  KEY `leave_type_id` (`leave_type_id`),
  CONSTRAINT `assigned_leave_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `assigned_leave_ibfk_2` FOREIGN KEY (`leave_type_id`) REFERENCES `leave_type` (`leave_type_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `attendance_regularization`
--

DROP TABLE IF EXISTS `attendance_regularization`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attendance_regularization` (
  `id` int NOT NULL AUTO_INCREMENT,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `hours` float DEFAULT NULL,
  `weekend` tinyint(1) DEFAULT NULL,
  `on_leave` tinyint(1) DEFAULT NULL,
  `holiday` tinyint(1) DEFAULT NULL,
  `date` date NOT NULL,
  `employeecode` int NOT NULL,
  `req_id` bigint NOT NULL,
  `isApproved` varchar(45) NOT NULL,
  `hod_email` varchar(100) NOT NULL,
  `emp_email` varchar(100) DEFAULT NULL,
  `hod_id` int NOT NULL,
  `reason` varchar(200) DEFAULT NULL,
  `hod_feedback` varchar(200) DEFAULT NULL,
  `request_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `req_id_index` (`req_id`)
) ENGINE=InnoDB AUTO_INCREMENT=192 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customer_projects`
--

DROP TABLE IF EXISTS `customer_projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_projects` (
  `customer_id` int NOT NULL,
  `project_id` int NOT NULL,
  PRIMARY KEY (`customer_id`,`project_id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `customer_projects_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`customer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(50) NOT NULL,
  `customer_code` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`customer_id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `days_activities`
--

DROP TABLE IF EXISTS `days_activities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `days_activities` (
  `activity` int NOT NULL,
  `effort_placed` float DEFAULT NULL,
  `description` varchar(4000) NOT NULL,
  `employee` int NOT NULL,
  `day` date NOT NULL,
  PRIMARY KEY (`activity`,`employee`,`day`,`description`(255)),
  KEY `activity` (`activity`),
  KEY `IDX_date` (`day`,`employee`),
  CONSTRAINT `days_activities_ibfk_3` FOREIGN KEY (`activity`) REFERENCES `activity` (`activity_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `departments`
--

DROP TABLE IF EXISTS `departments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `departments` (
  `department_name` varchar(50) NOT NULL,
  `dep_id` int NOT NULL AUTO_INCREMENT,
  `dep_desc` varchar(100) DEFAULT NULL,
  `hod_id` int NOT NULL,
  PRIMARY KEY (`dep_id`),
  KEY `hod` (`hod_id`),
  CONSTRAINT `departments_ibfk_1` FOREIGN KEY (`hod_id`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employee_locations`
--

DROP TABLE IF EXISTS `employee_locations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employee_locations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `event_type` enum('punch_in','punch_out','break_start','break_end') NOT NULL,
  `event_time` datetime NOT NULL,
  `latitude` decimal(10,8) NOT NULL,
  `longitude` decimal(11,8) NOT NULL,
  `accuracy` float DEFAULT NULL,
  `location_name` varchar(255) DEFAULT NULL,
  `area` varchar(100) DEFAULT NULL,
  `recorded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`,`event_time`),
  CONSTRAINT `employee_locations_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7662 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `employees`
--

DROP TABLE IF EXISTS `employees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `employees` (
  `id` int NOT NULL,
  `password` varchar(50) DEFAULT NULL,
  `department` int DEFAULT NULL,
  `first_name` varchar(20) NOT NULL,
  `middle_name` varchar(20) DEFAULT NULL,
  `last_name` varchar(20) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `role` varchar(50) DEFAULT NULL,
  `enabled` bit(1) DEFAULT b'1',
  `email_id` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `department` (`department`),
  CONSTRAINT `employees_ibfk_1` FOREIGN KEY (`department`) REFERENCES `departments` (`dep_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Temporary view structure for view `employees_vw`
--

DROP TABLE IF EXISTS `employees_vw`;
/*!50001 DROP VIEW IF EXISTS `employees_vw`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `employees_vw` AS SELECT 
 1 AS `id`,
 1 AS `department`,
 1 AS `first_name`,
 1 AS `middle_name`,
 1 AS `last_name`,
 1 AS `username`,
 1 AS `role`,
 1 AS `enabled`,
 1 AS `email_id`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `holiday_mst`
--

DROP TABLE IF EXISTS `holiday_mst`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `holiday_mst` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name_UNIQUE` (`name`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `leave_requests`
--

DROP TABLE IF EXISTS `leave_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_requests` (
  `employee_id` int NOT NULL,
  `from_date` date NOT NULL,
  `to_date` date NOT NULL,
  `from_date_leave_duration` enum('0.25','first_half','second_half','0.75','1') NOT NULL,
  `to_date_leave_duration` enum('0.25','first_half','second_half','0.75','1') NOT NULL,
  `reason` varchar(100) DEFAULT NULL,
  `status` varchar(45) NOT NULL,
  `hod_comments` varchar(45) DEFAULT NULL,
  `added_by_admin` tinyint DEFAULT NULL,
  `req_id` varchar(45) DEFAULT NULL,
  `hod_id` varchar(45) DEFAULT NULL,
  `hod_email` varchar(45) DEFAULT NULL,
  `request_date` date DEFAULT NULL,
  `id` int NOT NULL AUTO_INCREMENT,
  `emp_email` varchar(45) NOT NULL,
  `leave_type_id` int NOT NULL,
  `half_day_type` enum('first_half','second_half') DEFAULT NULL,
  `leave_days` decimal(5,2) DEFAULT NULL,
  `leave_type_name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `req_id_UNIQUE` (`req_id`)
) ENGINE=InnoDB AUTO_INCREMENT=175 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `leave_type`
--

DROP TABLE IF EXISTS `leave_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `leave_type` (
  `leave_type_id` int NOT NULL AUTO_INCREMENT,
  `leave_type_name` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`leave_type_id`),
  UNIQUE KEY `leave_type_name` (`leave_type_name`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `loginlogs`
--

DROP TABLE IF EXISTS `loginlogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loginlogs` (
  `employeecode` int NOT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `hours` float DEFAULT NULL,
  `weekend` tinyint(1) DEFAULT NULL,
  `on_leave` tinyint(1) DEFAULT NULL,
  `holiday` tinyint(1) DEFAULT NULL,
  `date` date NOT NULL,
  PRIMARY KEY (`date`,`employeecode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `months`
--

DROP TABLE IF EXISTS `months`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `months` (
  `id` int NOT NULL,
  `name` varchar(64) DEFAULT NULL,
  `days` int DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `proj_id` int NOT NULL AUTO_INCREMENT,
  `proj_name` varchar(50) DEFAULT NULL,
  `proj_desc` varchar(100) DEFAULT NULL,
  `billable` tinyint(1) DEFAULT NULL,
  `capitalizable` tinyint(1) DEFAULT NULL,
  `accountable` tinyint(1) DEFAULT NULL,
  `contact_person` int DEFAULT NULL,
  `customer_code` varchar(50) DEFAULT NULL,
  `non_billable_type` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`proj_id`),
  KEY `contact_person` (`contact_person`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`contact_person`) REFERENCES `employees` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `weekly_plan_reports`
--

DROP TABLE IF EXISTS `weekly_plan_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weekly_plan_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `activity_id` int NOT NULL,
  `year_week` int NOT NULL,
  `employee_id` int NOT NULL,
  `task_description` varchar(1000) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'Incomplete',
  `due_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=155 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `weekly_plan_reports_v2`
--

DROP TABLE IF EXISTS `weekly_plan_reports_v2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weekly_plan_reports_v2` (
  `id` int NOT NULL AUTO_INCREMENT,
  `activity_id` int NOT NULL,
  `year_week` int NOT NULL,
  `employee_id` int NOT NULL,
  `task_description` varchar(1000) NOT NULL,
  `status` varchar(20) NOT NULL DEFAULT 'Planned',
  `due_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3609 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `weekly_ratings`
--

DROP TABLE IF EXISTS `weekly_ratings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weekly_ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `year_week` int NOT NULL,
  `employee_id` int NOT NULL,
  `busyness` decimal(6,2) DEFAULT NULL,
  `satisfaction` decimal(6,2) DEFAULT NULL,
  `learning` decimal(6,2) DEFAULT NULL,
  `core` decimal(6,2) DEFAULT NULL,
  `skill_acquired` varchar(100) DEFAULT NULL,
  `ai_productivity` decimal(6,2) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_employee_week` (`year_week`,`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2718 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `weekly_task_reports`
--

DROP TABLE IF EXISTS `weekly_task_reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weekly_task_reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `activity_id` int DEFAULT NULL,
  `year_week` int NOT NULL,
  `employee_id` int NOT NULL,
  `task_description` varchar(1000) NOT NULL,
  `status` varchar(20) NOT NULL,
  `challenge_description` varchar(1000) NOT NULL DEFAULT 'No Challenges Faced',
  `ai_tool` varchar(100) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13311 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping events for database 'protrack'
--

--
-- Dumping routines for database 'protrack'
--
/*!50003 DROP PROCEDURE IF EXISTS `insert_loginlogs` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`%` PROCEDURE `insert_loginlogs`()
BEGIN
    DECLARE cur_date DATE;
    DECLARE end_date DATE;
    DECLARE emp_code INT;
    SET cur_date = '2024-09-01';
    SET end_date = '2024-09-30';
    
    -- Loop through each employee code
    WHILE cur_date <= end_date DO
        -- Loop through employee codes from 29 to 37
        SET emp_code = 29;
        WHILE emp_code <= 42 DO
            -- Insert record with weekend and holiday set for Saturdays and Sundays
            IF DAYOFWEEK(cur_date) = 7 OR DAYOFWEEK(cur_date) = 1 THEN
                INSERT INTO loginlogs (employeecode, start_time, end_time, hours, weekend, on_leave, holiday, date)
                VALUES (emp_code, NULL, NULL, NULL, 1, NULL, 1, cur_date);
            ELSE
                -- Insert record for regular weekdays with no weekend or holiday flags
                INSERT INTO loginlogs (employeecode, start_time, end_time, hours, weekend, on_leave, holiday, date)
                VALUES (emp_code, NULL, NULL, NULL, NULL, NULL, NULL, cur_date);
            END IF;
            SET emp_code = emp_code + 1;
        END WHILE;
        -- Move to the next day
        SET cur_date = cur_date + INTERVAL 1 DAY;
    END WHILE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Final view structure for view `employees_vw`
--

/*!50001 DROP VIEW IF EXISTS `employees_vw`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `employees_vw` AS select `employees`.`id` AS `id`,`employees`.`department` AS `department`,`employees`.`first_name` AS `first_name`,`employees`.`middle_name` AS `middle_name`,`employees`.`last_name` AS `last_name`,`employees`.`username` AS `username`,`employees`.`role` AS `role`,`employees`.`enabled` AS `enabled`,`employees`.`email_id` AS `email_id` from `employees` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-14  1:55:39
