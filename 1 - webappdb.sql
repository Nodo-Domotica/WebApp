-- phpMyAdmin SQL Dump
-- version 3.5.2.2
-- http://www.phpmyadmin.net
--
-- Machine: localhost
-- Genereertijd: 08 apr 2015 om 22:12
-- Serverversie: 5.5.27
-- PHP-versie: 5.3.17

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Databank: `nododom_webappdb`
--

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `nodo_tbl_event_log`
--

CREATE TABLE IF NOT EXISTS `nodo_tbl_event_log` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` mediumint(3) unsigned NOT NULL,
  `nodo_unit_nr` tinyint(3) unsigned NOT NULL,
  `event` tinytext NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `nodo_tbl_groups`
--

CREATE TABLE IF NOT EXISTS `nodo_tbl_groups` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `name` tinytext NOT NULL,
  `devices` tinyint(1) DEFAULT '0',
  `devices_default` tinyint(1) unsigned DEFAULT '0',
  `activities` tinyint(1) DEFAULT '0',
  `activities_default` tinyint(1) unsigned DEFAULT '0',
  `values` tinyint(1) DEFAULT '0',
  `values_default` tinyint(1) unsigned DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `nodo_tbl_help`
--

CREATE TABLE IF NOT EXISTS `nodo_tbl_help` (
  `help_key` int(11) NOT NULL,
  `help_text` text NOT NULL,
  PRIMARY KEY (`help_key`),
  UNIQUE KEY `key` (`help_key`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `nodo_tbl_notifications_new`
--

CREATE TABLE IF NOT EXISTS `nodo_tbl_notifications_new` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `description` tinytext NOT NULL,
  `type` tinyint(4) NOT NULL,
  `event` varchar(25) DEFAULT NULL,
  `unit` varchar(2) NOT NULL DEFAULT '*',
  `par1` varchar(16) DEFAULT '',
  `par2` varchar(16) DEFAULT '',
  `par3` varchar(16) DEFAULT '',
  `par4` varchar(16) DEFAULT '',
  `par5` varchar(16) DEFAULT '',
  `recipient` tinytext NOT NULL,
  `subject` tinytext NOT NULL,
  `body` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `nodo_tbl_objects`
--

CREATE TABLE IF NOT EXISTS `nodo_tbl_objects` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `description` tinytext NOT NULL,
  `type` int(11) NOT NULL DEFAULT '1',
  `icon` int(11) NOT NULL,
  `indicator_icon` tinyint(4) NOT NULL,
  `indicator_text` text NOT NULL,
  `group_id` text,
  `last_update` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `sort_order` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `nodo_tbl_objects_cmd`
--

CREATE TABLE IF NOT EXISTS `nodo_tbl_objects_cmd` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `object_id` int(10) unsigned NOT NULL,
  `user_id` int(11) NOT NULL,
  `unit_event` varchar(4) DEFAULT '',
  `description` tinytext NOT NULL,
  `command` varchar(128) DEFAULT '',
  `cmd_event` varchar(32) DEFAULT '',
  `par1_event` varchar(16) DEFAULT '',
  `par2_event` varchar(16) DEFAULT '',
  `par3_event` varchar(16) DEFAULT '',
  `par4_event` varchar(16) DEFAULT '',
  `par5_event` varchar(16) DEFAULT '',
  `webapp_par1` varchar(16) DEFAULT '',
  `webapp_par2` varchar(16) DEFAULT '',
  `webapp_par3` varchar(16) DEFAULT '',
  `webapp_par4` varchar(16) DEFAULT '',
  `value` varchar(16) DEFAULT '',
  `formula` varchar(128) NOT NULL,
  `round` int(11) NOT NULL DEFAULT '0',
  `state_template` varchar(32) DEFAULT '',
  `state` varchar(16) DEFAULT '',
  `indicator_placeholder_id` int(11) DEFAULT '0',
  `indicator_icon` int(4) NOT NULL DEFAULT '0',
  `indicator_text` text NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `type` int(11) NOT NULL,
  `sort_order` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `indicator_placeholder_id` (`indicator_placeholder_id`),
  KEY `object_id` (`object_id`),
  KEY `cmd_event` (`cmd_event`),
  KEY `par1_event` (`par1_event`),
  KEY `par2_event` (`par2_event`),
  KEY `par3_event` (`par3_event`),
  KEY `par4_event` (`par4_event`),
  KEY `par5_event` (`par5_event`),
  KEY `unit_event` (`unit_event`),
  KEY `user_id` (`user_id`)
) ENGINE=MyISAM  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `nodo_tbl_objects_data`
--

CREATE TABLE IF NOT EXISTS `nodo_tbl_objects_data` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `object_id` smallint(5) unsigned NOT NULL,
  `data` float NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `time_id_index` (`object_id`,`timestamp`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `nodo_tbl_scripts`
--

CREATE TABLE IF NOT EXISTS `nodo_tbl_scripts` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `file` tinytext NOT NULL,
  `user_id` int(11) NOT NULL,
  `script` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `nodo_tbl_tokens`
--

CREATE TABLE IF NOT EXISTS `nodo_tbl_tokens` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `token` text NOT NULL,
  `ip` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `nodo_tbl_trusted_nodo_cmd`
--

CREATE TABLE IF NOT EXISTS `nodo_tbl_trusted_nodo_cmd` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `trusted_id` int(11) NOT NULL,
  `description` text,
  `r_cmd` varchar(32) DEFAULT '',
  `r_par1` varchar(16) DEFAULT '',
  `r_par2` varchar(16) DEFAULT '',
  `r_par3` varchar(16) DEFAULT '',
  `r_par4` varchar(16) DEFAULT '',
  `r_par5` varchar(16) DEFAULT '',
  `s_cmd` varchar(32) DEFAULT '',
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `nodo_tbl_trusted_nodo_id`
--

CREATE TABLE IF NOT EXISTS `nodo_tbl_trusted_nodo_id` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `description` tinytext NOT NULL,
  `nodo_id` varchar(8) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Tabelstructuur voor tabel `nodo_tbl_users`
--

CREATE TABLE IF NOT EXISTS `nodo_tbl_users` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `user_login_name` char(50) NOT NULL,
  `user_password` char(32) NOT NULL,
  `first_name` tinytext NOT NULL,
  `last_name` tinytext NOT NULL,
  `user_group` char(20) NOT NULL DEFAULT 'user',
  `send_method` tinyint(1) NOT NULL DEFAULT '2',
  `nodo_ip` tinytext NOT NULL,
  `nodo_port` int(11) NOT NULL DEFAULT '6636',
  `nodo_id` tinytext NOT NULL,
  `nodo_build` tinytext,
  `nodo_password` char(20) NOT NULL,
  `cookie` tinytext NOT NULL,
  `cookie_update` timestamp NULL DEFAULT NULL,
  `cookie_count` bigint(20) NOT NULL DEFAULT '0',
  `busy` tinyint(3) unsigned NOT NULL DEFAULT '0',
  `webapp_theme` varchar(1) NOT NULL DEFAULT 'a',
  `webapp_theme_header` varchar(1) NOT NULL DEFAULT 'a',
  `webapp_title` tinytext NOT NULL,
  `default_page` tinyint(1) NOT NULL DEFAULT '1',
  `active` tinyint(1) NOT NULL,
  `confirm_code` char(32) NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

