CREATE DATABASE  IF NOT EXISTS `sdp_project` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `sdp_project`;
-- MySQL dump 10.13  Distrib 8.0.29, for Win64 (x86_64)
--
-- Host: localhost    Database: sdp_project
-- ------------------------------------------------------
-- Server version	8.0.29

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
-- Table structure for table `accounts_with_hashtag`
--

DROP TABLE IF EXISTS `accounts_with_hashtag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts_with_hashtag` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hashtag_id` int DEFAULT NULL,
  `account_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `account_id_idx` (`account_id`),
  KEY `hashtag_id_idx` (`hashtag_id`),
  CONSTRAINT `account_id` FOREIGN KEY (`account_id`) REFERENCES `instagram_accounts` (`id`),
  CONSTRAINT `hashtag_id` FOREIGN KEY (`hashtag_id`) REFERENCES `instagram_hashtags` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts_with_hashtag`
--

LOCK TABLES `accounts_with_hashtag` WRITE;
/*!40000 ALTER TABLE `accounts_with_hashtag` DISABLE KEYS */;
/*!40000 ALTER TABLE `accounts_with_hashtag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facebook_accounts`
--

DROP TABLE IF EXISTS `facebook_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facebook_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `account_name` varchar(256) DEFAULT NULL,
  `activity` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facebook_accounts`
--

LOCK TABLES `facebook_accounts` WRITE;
/*!40000 ALTER TABLE `facebook_accounts` DISABLE KEYS */;
INSERT INTO `facebook_accounts` VALUES (1,'suada.korman','1');
/*!40000 ALTER TABLE `facebook_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `facebook_dms`
--

DROP TABLE IF EXISTS `facebook_dms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `facebook_dms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `users_email` varchar(256) NOT NULL,
  `users_password` varchar(256) NOT NULL,
  `recipients_id` int NOT NULL,
  `message` varchar(500) NOT NULL,
  `status` varchar(500) NOT NULL,
  `port_value` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk1_idx` (`recipients_id`),
  KEY `fk2_idx` (`users_id`),
  CONSTRAINT `fk1` FOREIGN KEY (`recipients_id`) REFERENCES `facebook_accounts` (`id`),
  CONSTRAINT `fk2` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `facebook_dms`
--

LOCK TABLES `facebook_dms` WRITE;
/*!40000 ALTER TABLE `facebook_dms` DISABLE KEYS */;
INSERT INTO `facebook_dms` VALUES (1,57,'korman.ajla115@gmail.com','lalesuzute115',1,'This is an automated message.','Sent','2347'),(2,57,'ajla.korman@stu.ibu.edu.ba','lalesuzute115',1,'This is an automated message. ','Sent','2348');
/*!40000 ALTER TABLE `facebook_dms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instagram_accounts`
--

DROP TABLE IF EXISTS `instagram_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instagram_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(128) DEFAULT NULL,
  `post_number` int DEFAULT NULL,
  `followers_number` int DEFAULT NULL,
  `followings_number` int DEFAULT NULL,
  `date_and_time` varchar(256) DEFAULT NULL,
  `stats` tinyint(1) DEFAULT NULL,
  `activity` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=215 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instagram_accounts`
--

LOCK TABLES `instagram_accounts` WRITE;
/*!40000 ALTER TABLE `instagram_accounts` DISABLE KEYS */;
INSERT INTO `instagram_accounts` VALUES (213,'suada_korman',NULL,NULL,NULL,NULL,0,'active'),(214,'asyya.m',NULL,NULL,NULL,NULL,0,'active');
/*!40000 ALTER TABLE `instagram_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `instagram_hashtags`
--

DROP TABLE IF EXISTS `instagram_hashtags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `instagram_hashtags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hashtag_name` varchar(128) DEFAULT NULL,
  `activity` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instagram_hashtags`
--

LOCK TABLES `instagram_hashtags` WRITE;
/*!40000 ALTER TABLE `instagram_hashtags` DISABLE KEYS */;
/*!40000 ALTER TABLE `instagram_hashtags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(128) NOT NULL,
  `last_name` varchar(128) NOT NULL,
  `email_address` varchar(128) NOT NULL,
  `password` varchar(256) NOT NULL,
  `phone` varchar(128) NOT NULL,
  `status` varchar(45) DEFAULT NULL,
  `register_token` varchar(400) DEFAULT NULL,
  `activation_token` varchar(500) DEFAULT NULL,
  `activation_token_count` int DEFAULT NULL,
  `forget_password_count` int DEFAULT '0',
  `last_request` varchar(500) DEFAULT NULL,
  `is_admin` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email_address`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (57,'Ajla','Korman','korman.ajla115@gmail.com','$2y$10$Acip4WXTeg5aFnlKiZuoT.JGnuyouBTdSnfuZpu4TIX4T4VeBxzVG','+38762421745','verified','user_66deaf11280d38.76298838',NULL,NULL,0,NULL,0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_accounts`
--

DROP TABLE IF EXISTS `users_accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_accounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int DEFAULT NULL,
  `accounts_id` int DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `users_id_idx` (`users_id`),
  KEY `accounts_id_idx` (`accounts_id`),
  CONSTRAINT `accounts_id` FOREIGN KEY (`accounts_id`) REFERENCES `instagram_accounts` (`id`),
  CONSTRAINT `users_id` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_accounts`
--

LOCK TABLES `users_accounts` WRITE;
/*!40000 ALTER TABLE `users_accounts` DISABLE KEYS */;
INSERT INTO `users_accounts` VALUES (23,57,213,'active'),(24,57,214,'active');
/*!40000 ALTER TABLE `users_accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_dms`
--

DROP TABLE IF EXISTS `users_dms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_dms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int NOT NULL,
  `users_email` varchar(128) NOT NULL,
  `users_password` varchar(256) NOT NULL,
  `recipients_id` int NOT NULL,
  `message` varchar(256) NOT NULL,
  `date_and_time` varchar(256) NOT NULL,
  `status` varchar(128) NOT NULL,
  `port_value` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `id_idx` (`users_id`),
  KEY `id_idx1` (`recipients_id`),
  CONSTRAINT `id` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`),
  CONSTRAINT `recipients_id` FOREIGN KEY (`recipients_id`) REFERENCES `instagram_accounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=75 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_dms`
--

LOCK TABLES `users_dms` WRITE;
/*!40000 ALTER TABLE `users_dms` DISABLE KEYS */;
INSERT INTO `users_dms` VALUES (73,57,'korman_ajla','a1b2c3d4',213,'Proba 23','2024-09-10 10:18:30','Sent','9226'),(74,57,'suncanovic','#a1b2c3.D4',214,'Demo sa novog accounta','2024-09-10 10:18:30','Sent','3601');
/*!40000 ALTER TABLE `users_dms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_emails`
--

DROP TABLE IF EXISTS `users_emails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_emails` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `description` varchar(500) DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `users_id_idx` (`users_id`),
  KEY `users_id_id3` (`users_id`),
  CONSTRAINT `email_user_id` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_emails`
--

LOCK TABLES `users_emails` WRITE;
/*!40000 ALTER TABLE `users_emails` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_emails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users_hashtags`
--

DROP TABLE IF EXISTS `users_hashtags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users_hashtags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `users_id` int DEFAULT NULL,
  `hashtags_id` int DEFAULT NULL,
  `status` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `users_id_idx` (`users_id`),
  KEY `hashtags_id_idx` (`hashtags_id`),
  CONSTRAINT `hashtags_id` FOREIGN KEY (`hashtags_id`) REFERENCES `instagram_hashtags` (`id`),
  CONSTRAINT `users_id1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_hashtags`
--

LOCK TABLES `users_hashtags` WRITE;
/*!40000 ALTER TABLE `users_hashtags` DISABLE KEYS */;
/*!40000 ALTER TABLE `users_hashtags` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-01 20:47:10
