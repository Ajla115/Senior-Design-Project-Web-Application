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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts_with_hashtag`
--

LOCK TABLES `accounts_with_hashtag` WRITE;
/*!40000 ALTER TABLE `accounts_with_hashtag` DISABLE KEYS */;
INSERT INTO `accounts_with_hashtag` VALUES (1,3,71),(2,3,72),(3,3,74),(4,3,75),(5,3,77),(6,3,78),(7,3,81),(8,3,73),(9,3,82),(10,3,79),(11,3,83),(12,3,84),(13,3,85),(14,3,86),(15,4,88),(16,4,89),(17,4,90),(18,4,91),(19,4,92),(20,4,93),(21,4,94),(22,4,94),(23,4,94),(24,4,95);
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
  `activity` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instagram_accounts`
--

LOCK TABLES `instagram_accounts` WRITE;
/*!40000 ALTER TABLE `instagram_accounts` DISABLE KEYS */;
INSERT INTO `instagram_accounts` VALUES (35,'korman_ajla',16,267,346,'2024-02-25',1,'deleted'),(36,'asyya.m',37,239,493,'2024-03-09',1,'active'),(37,'officeshoes_bih',1284,52654,21,'2024-03-09',1,'active'),(44,'tominhobjl',614,5782,2777,'2024-03-11',1,'deleted'),(45,'renshawspt',4119,848932,246,'2024-03-11',1,'deleted'),(46,'job_lucci',514,60107,4097,'2024-03-11',1,'deleted'),(47,'cicconefreak',2831,22381,479,'2024-03-11',1,'deleted'),(48,'briannee_wagner',383,47746,1051,'2024-03-11',1,'deleted'),(49,'patdamiano_',1437,221998,2015,'2024-03-11',1,'active'),(50,'runningfervor',11515,1502443,420,'2024-03-11',1,'active'),(51,'sandysira',826,5562,399,'2024-03-11',1,'deleted'),(52,'sivkkvnt',470,63279,271,'2024-03-11',1,'deleted'),(53,'marujoreal',378,66720,35,'2024-03-11',1,'active'),(54,'officialwarrenbuffetts',6594,346093,31,'2024-03-11',1,'active'),(55,'studio_rustic_',497,57930,1132,'2024-03-11',1,'active'),(56,'theeverydayperspective',614,7147,1945,'2024-03-11',1,'active'),(58,'aiba_ryota',315,33205,883,'2024-03-11',1,'active'),(59,'la_usgirl',257,25447,23,'2024-03-11',1,'active'),(60,'btkbhs',918,38119,950,'2024-03-11',1,'active'),(61,'loft_interior',6093,1302179,7,'2024-03-11',1,'deleted'),(62,'interiorbymeryem',109,38257,195,'2024-03-11',1,'active'),(63,'__m._______',1186,10448,68,'2024-03-11',1,'active'),(64,'_h_o_r__m',713,12297,489,'2024-03-11',1,'active'),(65,'oitomaroom',121,12591,565,'2024-03-11',1,'active'),(66,'film__tm',1115,9924,1019,'2024-03-11',1,'active'),(67,'currentepisode',2993,23832,974,'2024-03-21',1,'active'),(68,'ddeobim',99,73094,1008,'2024-03-21',1,'active'),(69,'tsubottlee',2454,147963,1100,'2024-03-21',1,'active'),(70,'tariho29',1325,20086,862,'2024-03-21',1,'active'),(71,'about.staars',1289,16126,411,'2024-03-21',1,'active'),(72,'ip_for_blossoms',26494,127659,1562,'2024-03-21',1,'deleted'),(73,'espiritualidad_y_conciencia',6703,492097,2,'2024-03-21',1,'active'),(74,'sguardi_reciproci',0,0,0,'2024-03-21',1,'invalid userame'),(75,'team_falchetta_',2745,22308,629,'2024-03-21',1,'active'),(76,'thatkittenuniverse',316,262751,5,'2024-03-21',1,'active'),(77,'princesascoreanas',3199,54781,774,'2024-03-21',1,'active'),(78,'ig.nhatkycuachungta',363,6937,2,'2024-03-21',1,'active'),(79,'good.life.powers',785,151074,2,'2024-03-21',1,'active'),(80,'elbetoval',1056,250718,685,'2024-03-21',1,'active'),(81,'kalsi_simran18',1291,2466368,72,'2024-03-21',1,'active'),(82,'soy.oveja',2535,377778,54,'2024-03-21',1,'deleted'),(83,'goodly_cat',5173,423924,0,'2024-03-21',1,'active'),(84,'khanedarie_berooz',8148,810685,0,'2024-03-21',1,'active'),(85,'mopar_musclecars',6372,144104,3747,'2024-03-21',1,'active'),(86,'alejandroaravena.cl',257,21494,283,'2024-03-21',1,'active'),(88,'juliettewinteer',39,86149,17,'2024-04-21',1,'active'),(89,'finmood',874,58446,470,'2024-04-21',1,'active'),(90,'vivianadf_75',108,35205,739,'2024-04-21',1,'active'),(91,'_.cote_stylinson_28._',2536,4360,481,'2024-04-21',1,'active'),(92,'visualmediterranean',812,103169,23,'2024-04-21',1,'active'),(93,'daily.sy.75',NULL,NULL,NULL,NULL,0,'deleted'),(94,'nuestromundodegirasoles',7973,40311,972,'2024-04-21',1,'active'),(95,'finnishtime',3339,144120,685,'2024-04-21',1,'active'),(96,NULL,NULL,NULL,NULL,NULL,0,'deleted'),(97,'ajla_korman',0,21,0,'2024-04-21',1,'active'),(99,'suada_korman',0,36,87,'2024-04-21',1,'active');
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
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `hashtag_name_UNIQUE` (`hashtag_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `instagram_hashtags`
--

LOCK TABLES `instagram_hashtags` WRITE;
/*!40000 ALTER TABLE `instagram_hashtags` DISABLE KEYS */;
INSERT INTO `instagram_hashtags` VALUES (1,'fitness','active'),(2,'room','active'),(3,'love','active'),(4,'sun','active');
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `email_UNIQUE` (`email_address`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (2,'Suada','Korman','skorman@gmail.com','826196cbeaa1140b364d3131173edd52'),(26,'Ajla','Korman','korman.ajla115@gmail.com','$2y$10$KRjmLRrBWSRuNWmeF6kBhuffvKF5vaBYuhwpi8VhwRxGtJSLySF3a'),(27,'Asja','Maric','asja.maric@gmail.com','$2y$10$X5UxnfrLsWF.NNY0bpmVZ.q15QH1sxaFuuXFUHFLIv6DoMC6PyqmO');
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

-- Dump completed on 2024-04-22 19:30:50
