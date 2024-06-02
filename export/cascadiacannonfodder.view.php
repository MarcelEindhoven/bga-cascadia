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
 * cascadiacannonfodder.view.php
 *
 * This is your "view" file.
 *
 * The method "build_page" below is called each time the game interface is displayed to a player, ie:
 * _ when the game starts
 * _ when a player refreshes the game page (F5)
 *
 * "build_page" method allows you to dynamically modify the HTML generated for the game interface. In
 * particular, you can set here the values of variables elements defined in cascadiacannonfodder_cascadiacannonfodder.tpl (elements
 * like {MY_VARIABLE_ELEMENT}), and insert HTML block elements (also defined in your HTML template file)
 *
 * Note: if the HTML of your game interface is always the same, you don't have to place anything here.
 *
 */
  
require_once( APP_BASE_PATH."view/common/game.view.php" );
  
class view_cascadiacannonfodder_cascadiacannonfodder extends game_view
{
    protected function getGameName()
    {
        // Used for translations and stuff. Please do not modify.
        return "cascadiacannonfodder";
    }
    
    function getPlayersInOrder() {
        $result = array();
    
        $players = $this->game->loadPlayersBasicInfos();
        $next_player = $this->game->getNextPlayerTable();
        global $g_user;
        $player_id = $g_user->get_id();
    
        // Check for spectator
        if (!key_exists($player_id, $players)) {
            $player_id = $next_player[0];
        }
    
        // Build array starting with current player
        for ($i=0; $i<count($players); $i++) {
            $result[] = $players[$player_id];
            $player_id = $next_player[$player_id];
        }
    
        return $result;
    }
    
  	function build_page( $viewArgs )
  	{		
  	    // Get players & players number
        $players = $this->getPlayersInOrder();
        $players_nbr = count( $players );

        /*********** Place your code below:  ************/
        $this->page->begin_block( "cascadiacannonfodder_cascadiacannonfodder", "player_board" );
        foreach( $players as $player ) {
            $this->page->insert_block( "player_board", array( 
                "PLAYER_ID" => $player['player_id'],
                 ) );
        }

        /*
        
        // Examples: set the value of some element defined in your tpl file like this: {MY_VARIABLE_ELEMENT}

        // Display a specific number / string
        $this->tpl['MY_VARIABLE_ELEMENT'] = $number_to_display;

        // Display a string to be translated in all languages: 
        $this->tpl['MY_VARIABLE_ELEMENT'] = $this->_("A string to be translated");

        // Display some HTML content of your own:
        $this->tpl['MY_VARIABLE_ELEMENT'] = $this->raw( $some_html_code );
        
        */
        
        /*
        
        // Example: display a specific HTML block for each player in this game.
        // (note: the block is defined in your .tpl file like this:
        //      <!-- BEGIN myblock --> 
        //          ... my HTML code ...
        //      <!-- END myblock --> 
        

        $this->page->begin_block( "cascadiacannonfodder_cascadiacannonfodder", "myblock" );
        foreach( $players as $player )
        {
            $this->page->insert_block( "myblock", array( 
                                                    "PLAYER_NAME" => $player['player_name'],
                                                    "SOME_VARIABLE" => $some_value
                                                    ...
                                                     ) );
        }
        
        */



        /*********** Do not change anything below this line  ************/
  	}
}
