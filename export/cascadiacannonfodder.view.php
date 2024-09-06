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
 * _ when a player drawes the game page (F5)
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

    /*
    Randomly distribute one Starter Habitat Tile to each player, placing it face-up in front of them.
    */
    function build_player_boards() {
        $this->page->begin_block( "cascadiacannonfodder_cascadiacannonfodder", "player_board" );

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
            $this->build_player_board($players[$player_id]);
            $player_id = $next_player[$player_id];
        }
    }
    function build_player_board($player) {
        $this->page->insert_block( "player_board", array(
            "PLAYER_ID" => $player['player_id'],
            "PLAYER_NAME" => $player['player_name'],
            ) );
    }

    /*
    Reveal 4 Habitat Tiles from the face-down stacks and place them face-up in the center of the play area within easy reach of all players.
    Draw 4 Wildlife Tokens from the Cloth Bag and pair them, in order, with each of the 4 Habitat Tiles to form 4 combinations of 1 tile and 1 token.
    */
    function build_market() {
        $this->page->begin_block( "cascadiacannonfodder_cascadiacannonfodder", "market_element" );
        $this->page->begin_block( "cascadiacannonfodder_cascadiacannonfodder", "market_row" );

        $this->build_market_row('habitat');
        $this->build_market_row('wildlife');
    }
    function build_market_row($item_name) {
        $this->page->reset_subblocks( 'market_element' ); 

        for( $i=0; $i<=3; $i++ ) {
            $this->page->insert_block( "market_element", array( 
                    'ROW' => $item_name,
                    'PLACE' => $i
                )
            );
        }

        $this->page->insert_block( 'market_row', []);
    }

  	function build_page( $viewArgs )
  	{		
        $this->build_market();

        $this->build_player_boards();

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
