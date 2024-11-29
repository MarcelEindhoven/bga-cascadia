<?php
/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 * 
 * states.inc.php
 *
 * CascadiaCannonFodder game states description
 *
 */

/*
   Game state machine is a tool used to facilitate game developpement by doing common stuff that can be set up
   in a very easy way from this configuration file.

   Please check the BGA Studio presentation about game state to understand this, and associated documentation.

   Summary:

   States types:
   _ activeplayer: in this type of state, we expect some action from the active player.
   _ multipleactiveplayer: in this type of state, we expect some action from multiple players (the active players)
   _ game: this is an intermediary state where we don't expect any actions from players. Your game logic must decide what is the next game state.
   _ manager: special type for initial and final state

   Arguments of game states:
   _ name: the name of the GameState, in order you can recognize it on your own code.
   _ description: the description of the current game state is always displayed in the action status bar on
                  the top of the game. Most of the time this is useless for game state with "game" type.
   _ descriptionmyturn: the description of the current game state when it's your turn.
   _ type: defines the type of game states (activeplayer / multipleactiveplayer / game / manager)
   _ action: name of the method to call when this game state become the current game state. Usually, the
             action method is prefixed by "st" (ex: "stMyGameStateName").
   _ possibleactions: array that specify possible player actions on this step. It allows you to use "checkAction"
                      method on both client side (Javacript: this.checkAction) and server side (PHP: $this->checkAction).
   _ transitions: the transitions are the possible paths to go from a game state to another. You must name
                  transitions in order to use transition names in "nextState" PHP method, and use IDs to
                  specify the next game state for each transition.
   _ args: name of the method to call to retrieve arguments for this gamestate. Arguments are sent to the
           client side to be used on "onEnteringState" or to set arguments in the gamestate description.
   _ updateGameProgression: when specified, the game progression is updated (=> call to your getGameProgression
                            method).
*/

//    !! It is not a good idea to modify this file when a game is running !!

 
$machinestates = array(

    // The initial state. Please do not modify.
    1 => array(
        "name" => "gameSetup",
        "description" => "",
        "type" => "manager",
        "action" => "stGameSetup",
        "transitions" => array( "" => 10 )
    ),
    
    // Note: ID=2 => your first state

    10 => array(
    		"name" => "playerPlacesTile",
    		"description" => clienttranslate('${actplayer} must place a tile'),
    		"descriptionmyturn" => clienttranslate('${you} must place a tile'),
    		"type" => "activeplayer",
    		"transitions" => array( "" => 12)
    ),
    12 => array(
        "name" => "playerPlacesWildlife",
        "description" => clienttranslate('${actplayer} must place wildlife'),
        "descriptionmyturn" => clienttranslate('${you} must place wildlife'),
        "type" => "activeplayer",
        "transitions" => array( "" => 10)
),
15 => array(
        "name" => "nextPlayer",
        "description" => clienttranslate('Next player'),
        "descriptionmyturn" => clienttranslate('Next player'),
        "type" => "game",
//        "action" => "stNextPlayer",
        "possibleactions" => array("player_playing", "ai_playing", "finished_playing"),
        "transitions" => array("player_playing" => 10, "ai_playing" => 16, "finished_playing" => 20)
    ),
    16 => array(
        "name" => "aiPlayer",
        "description" => clienttranslate('Robot turn'),
        "descriptionmyturn" => clienttranslate('${you} must play'),
        "type" => "game",
//        "action" => "stAiPlayer",
        "transitions" => array("" => 15)
    ),
    20 => array(
        "name" => "allPlayersInspectScore",
        "description" => clienttranslate('everyone can inspect the score'),
        "descriptionmyturn" => clienttranslate('everyone can inspect the score'),
        "type" => "multipleactiveplayer",
//        "action" => "stAllPlayersInspectScore",
        "transitions" => array( "" => 99),
    ),
    
/*
    Examples:
    
    2 => array(
        "name" => "nextPlayer",
        "description" => '',
        "type" => "game",
        "action" => "stNextPlayer",
        "updateGameProgression" => true,   
        "transitions" => array( "endGame" => 99, "nextPlayer" => 10 )
    ),
    
    10 => array(
        "name" => "playerTurn",
        "description" => clienttranslate('${actplayer} must place a tile'),
        "descriptionmyturn" => clienttranslate('${you} must place a tile'),
        "type" => "activeplayer",
        "possibleactions" => array( "playCard", "pass" ),
        "transitions" => array( "playCard" => 2, "pass" => 2 )
    ), 

*/    
   
    // Final state.
    // Please do not modify (and do not overload action/args methods).
    99 => array(
        "name" => "gameEnd",
        "description" => clienttranslate("End of game"),
        "type" => "manager",
        "action" => "stGameEnd",
        "args" => "argGameEnd"
    )

);



