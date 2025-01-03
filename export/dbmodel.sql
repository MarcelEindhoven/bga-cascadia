
-- ------
-- BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
-- Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
-- 
-- This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
-- See http://en.boardgamearena.com/#!doc/Studio for more information.
-- -----

-- dbmodel.sql

-- This is the file where you are describing the database schema of your game
-- Basically, you just have to export from PhpMyAdmin your table structure and copy/paste
-- this export here.
-- Note that the database itself and the standard tables ("global", "stats", "gamelog" and "player") are
-- already created and must not be created here

-- Note: The database schema is created from this file when the game starts. If you modify this file,
--       you have to restart a game to see your changes in database.

-- Example 1: create a standard "card" table to be used with the "Deck" tools (see example game "hearts"):

-- CREATE TABLE IF NOT EXISTS `card` (
--   `card_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
--   `card_type` varchar(16) NOT NULL,
--   `card_type_arg` int(11) NOT NULL,
--   `card_location` varchar(16) NOT NULL,
--   `card_location_arg` int(11) NOT NULL,
--   PRIMARY KEY (`card_id`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;


-- Example 2: add a custom field to the standard "player" table
-- ALTER TABLE `player` ADD `player_my_custom_field` INT UNSIGNED NOT NULL DEFAULT '0';

ALTER TABLE `player` ADD `player_coins` INT UNSIGNED NOT NULL DEFAULT '0';

-- Each tile in the game is stored in the database.
-- Tiles that are removed from the game at game creation are not in the database.
-- The starter habitat tile is modelled as 3 tiles.
-- Tiles can be in the bag, in the market or on a player board.
-- The content of the tiles is fixed and not part of the database.
-- The card type specifies the terrains that the tile contains.
-- card_type % 6 specifies the first terrain types that this tile contains.
-- card_type/6 specifies the second terrain type that this tile contains.
-- 0 = no terrain, 1 = rivers, 2 = wetlands, 3 = forests, 4 = prairies, 5 = mountains
-- The card type argument specifies the wildlife that is supported.
-- card_type_arg % 6 specifies the first wildlife that is supported, see wildlife table.
-- card_type_arg/6%6 specifies the second wildlife that is supported.
-- card_type_arg/6*6 specifies the third wildlife that is supported.
-- card_location = "deck", "market" or player ID
-- card location argument = market index or horizontal location + (vertical location*100) + (rotation*10,000)
CREATE TABLE IF NOT EXISTS `tile` (
  `card_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `card_type` varchar(16) NOT NULL,
  `card_type_arg` int(11) NOT NULL,
  `card_location` varchar(16) NOT NULL,
  `card_location_arg` int(11) NOT NULL,
  PRIMARY KEY (`card_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- card_type specifies the animal type
-- card_type_arg specifies the index of the card
CREATE TABLE IF NOT EXISTS `scoring_card` (
  `card_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `card_type` varchar(16) NOT NULL,
  `card_type_arg` int(11) NOT NULL,
  `card_location` varchar(16) NOT NULL,
  `card_location_arg` int(11) NOT NULL,
  PRIMARY KEY (`card_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

-- type: 0 = no wildlife, 1 = bear, 2 = elk, 3 = salmon, 4 = hawk, 5 = fox
-- location: "deck", "market" or "chosen" or player ID
-- location argument: market index or tile ID
CREATE TABLE IF NOT EXISTS `wildlife` (
  `card_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `card_type` varchar(16) NOT NULL,
  `card_type_arg` int(11) NOT NULL,
  `card_location` varchar(16) NOT NULL,
  `card_location_arg` int(11) NOT NULL,
  PRIMARY KEY (`card_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;
