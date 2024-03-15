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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts_with_hashtag`
--

LOCK TABLES `accounts_with_hashtag` WRITE;
/*!40000 ALTER TABLE `accounts_with_hashtag` DISABLE KEYS */;
INSERT INTO `accounts_with_hashtag` VALUES (1,3,71),(2,3,72),(3,3,74),(4,3,75),(5,3,77),(6,3,78),(7,3,81),(8,3,73),(9,3,82),(10,3,79),(11,3,83),(12,3,84),(13,3,85),(14,3,86);
/*!40000 ALTER TABLE `accounts_with_hashtag` ENABLE KEYS */;
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instagram_accounts`
--

LOCK TABLES `instagram_accounts` WRITE;
/*!40000 ALTER TABLE `instagram_accounts` DISABLE KEYS */;
INSERT INTO `instagram_accounts` VALUES (32,'millane',141,1454635,452,'2024-02-20',1),(33,'shopcider',3979,5142032,549,'2024-02-20',1),(35,'korman_ajla',16,267,346,'2024-02-25',1),(36,'asyya.m',37,239,493,'2024-03-09',1),(37,'officeshoes_bih',1284,52654,21,'2024-03-09',1),(44,'tominhobjl',614,5782,2777,'2024-03-11',1),(45,'renshawspt',4119,848932,246,'2024-03-11',1),(46,'job_lucci',514,60107,4097,'2024-03-11',1),(47,'cicconefreak',2831,22381,479,'2024-03-11',1),(48,'briannee_wagner',383,47746,1051,'2024-03-11',1),(49,'patdamiano_',1437,221998,2015,'2024-03-11',1),(50,'runningfervor',11515,1502443,420,'2024-03-11',1),(51,'sandysira',826,5562,399,'2024-03-11',1),(52,'sivkkvnt',470,63279,271,'2024-03-11',1),(53,'marujoreal',378,66720,35,'2024-03-11',1),(54,'officialwarrenbuffetts',6594,346093,31,'2024-03-11',1),(55,'studio_rustic_',497,57930,1132,'2024-03-11',1),(56,'theeverydayperspective',614,7147,1945,'2024-03-11',1),(57,'sang_ss_fm',128,46540,105,'2024-03-11',1),(58,'aiba_ryota',315,33205,883,'2024-03-11',1),(59,'la_usgirl',257,25447,23,'2024-03-11',1),(60,'btkbhs',918,38119,950,'2024-03-11',1),(61,'loft_interior',6093,1302179,7,'2024-03-11',1),(62,'interiorbymeryem',109,38257,195,'2024-03-11',1),(63,'__m._______',1186,10448,68,'2024-03-11',1),(64,'_h_o_r__m',713,12297,489,'2024-03-11',1),(65,'oitomaroom',121,12591,565,'2024-03-11',1),(66,'film__tm',1115,9924,1019,'2024-03-11',1),(67,'currentepisode',NULL,NULL,NULL,NULL,0),(68,'ddeobim',NULL,NULL,NULL,NULL,0),(69,'tsubottlee',NULL,NULL,NULL,NULL,0),(70,'tariho29',NULL,NULL,NULL,NULL,0),(71,'about.staars',NULL,NULL,NULL,NULL,0),(72,'ip_for_blossoms',NULL,NULL,NULL,NULL,0),(73,'espiritualidad_y_conciencia',NULL,NULL,NULL,NULL,0),(74,'sguardi_reciproci',NULL,NULL,NULL,NULL,0),(75,'team_falchetta_',NULL,NULL,NULL,NULL,0),(76,'thatkittenuniverse',NULL,NULL,NULL,NULL,0),(77,'princesascoreanas',NULL,NULL,NULL,NULL,0),(78,'ig.nhatkycuachungta',NULL,NULL,NULL,NULL,0),(79,'good.life.powers',NULL,NULL,NULL,NULL,0),(80,'elbetoval',NULL,NULL,NULL,NULL,0),(81,'kalsi_simran18',NULL,NULL,NULL,NULL,0),(82,'soy.oveja',NULL,NULL,NULL,NULL,0),(83,'goodly_cat',NULL,NULL,NULL,NULL,0),(84,'khanedarie_berooz',NULL,NULL,NULL,NULL,0),(85,'mopar_musclecars',NULL,NULL,NULL,NULL,0),(86,'alejandroaravena.cl',NULL,NULL,NULL,NULL,0);
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `hashtag_name_UNIQUE` (`hashtag_name`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instagram_hashtags`
--

LOCK TABLES `instagram_hashtags` WRITE;
/*!40000 ALTER TABLE `instagram_hashtags` DISABLE KEYS */;
INSERT INTO `instagram_hashtags` VALUES (1,'fitness'),(3,'love'),(2,'room');
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
  `email` varchar(128) NOT NULL,
  `password` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Ajla','Korman','ajlakorman@gmail.com','19cf8fc05187049569a7fc2991782bac'),(2,'Suada','Korman','skorman@gmail.com','826196cbeaa1140b364d3131173edd52'),(3,'Admir123','Korman','admirkorman123@gmail.com','453233df5f4316bf96b117a287e92e69');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `id_idx` (`users_id`),
  KEY `id_idx1` (`recipients_id`),
  CONSTRAINT `id` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`),
  CONSTRAINT `recipients_id` FOREIGN KEY (`recipients_id`) REFERENCES `instagram_accounts` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users_dms`
--

LOCK TABLES `users_dms` WRITE;
/*!40000 ALTER TABLE `users_dms` DISABLE KEYS */;
INSERT INTO `users_dms` VALUES (29,2,'skorman@gmail.com','suada',35,'Hello World2','2024-02-24','Sent'),(30,2,'skorman@gmail.com','suada',36,'Hello World2','2024-02-24','Sent');
/*!40000 ALTER TABLE `users_dms` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-15 12:47:34
