-- MySQL dump 10.13  Distrib 5.7.25, for Linux (x86_64)
--
-- Host: localhost    Database: elexisoob
-- ------------------------------------------------------
-- Server version	5.5.5-10.3.12-MariaDB-1:10.3.12+maria~bionic

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `config`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE IF NOT EXISTS `config` (
  `id` varchar(40) DEFAULT NULL,
  `deleted` char(1) DEFAULT '0',
  `lastupdate` bigint(20) DEFAULT NULL,
  `param` varchar(80) NOT NULL,
  `wert` text DEFAULT NULL,
  PRIMARY KEY (`param`)
) ENGINE=InnoDB DEFAULT CHARSET=utf-8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `config`
--

LOCK TABLES `config` WRITE;
/*!40000 ALTER TABLE `config` DISABLE KEYS */;
INSERT INTO `config` VALUES (NULL,'0',1549629580378,'LocalXIDDomains','www.xid.ch/id/complementary#1#complementary#;www.xid.ch/id/analysenliste_ch2009/#2#Analysenliste 2009#;www.elexis.ch/xid#5#UUID#ch.elexis.data.PersistentObject,;www.xid.ch/id/tarmedsuisse#1#Tarmed#;www.xid.ch/id/oid#7#OID#ch.elexis.data.PersistentObject,;www.xid.ch/id/pharmacode/ch#2#Pharmacode#;www.elexis.ch/xid/kontakt/rolle#2#Rolle#;www.ahv.ch/xid#2#AHV#ch.elexis.data.Person,;www.xid.ch/id/customservices#5#Eigenleistung#;www.xid.ch/id/physiotarif#1#Physiotarif#;www.elexis.ch/xid/kontakt/kanton#2#Kanton#ch.elexis.data.Person,;www.xid.ch/id/elexis_leistungsblock#5#Leistungsblock#;www.elexis.ch/xid/kontakt/lab/sendingfacility#2#Sendende Institution#ch.elexis.data.Labor,;www.xid.ch/id/ean#2#EAN#ch.elexis.data.Kontakt,;www.elexis.ch/xid/kontakt/spez#2#Spezialität#ch.elexis.data.Person,;www.elexis.ch/xid/kontakt/anrede#2#Anrede#ch.elexis.data.Person,;');
/*!40000 ALTER TABLE `config` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-02-08 16:03:15
