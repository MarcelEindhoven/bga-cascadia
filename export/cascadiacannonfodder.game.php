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
  * cascadiacannonfodder.game.php
  *
  * This is the main file for your game logic.
  *
  * In this PHP file, you are going to defines the rules of the game.
  *
  */


require_once( APP_GAMEMODULE_PATH.'module/table/table.game.php' );

include_once(__DIR__.'/modules/BGA/FrameworkInterfaces/Database.php');
include_once(__DIR__.'/modules/BGA/FrameworkInterfaces/Debugging.php');

include_once(__DIR__.'/modules/NewGame/NewGame.php');
include_once(__DIR__.'/modules/NewGame/PlayerSetup.php');

include_once(__DIR__.'/modules/UseCases/Actions.php');
include_once(__DIR__.'/modules/UseCases/GetAllDatas.php');

class CascadiaCannonFodder extends Table implements NieuwenhovenGames\BGA\FrameworkInterfaces\Database, NieuwenhovenGames\BGA\FrameworkInterfaces\Debugging
{
    protected array $decks = [];

    function __construct( )
	{
        // Your global variables labels:
        //  Here, you can assign labels to global variables you are using for this game.
        //  You can use any number of global variables with IDs between 10 and 99.
        //  If your game has options (variants), you also have to associate here a label to
        //  the corresponding ID in gameoptions.inc.php.
        // Note: afterwards, you can get/set the global variables with getGameStateValue/setGameStateInitialValue/setGameStateValue
        parent::__construct();
        
        $this->initGameStateLabels( array( 
            //    "my_first_global_variable" => 10,
            //    "my_second_global_variable" => 11,
                "number_ai_players" => 100,
                "game_variant" => 101,
        ) );

        $this->decks['tile'] = self::getNew('module.common.deck');
        $this->decks['tile']->init('tile');

        $this->decks['scoring_card'] = self::getNew('module.common.deck');
        $this->decks['scoring_card']->init('scoring_card');

        $this->decks['wildlife'] = self::getNew('module.common.deck');
        $this->decks['wildlife']->init('wildlife');
	}

    // NieuwenhovenGames\BGA\Database
    public function query(string $query) : void  {
        self::DbQuery($query);
    }
	
    public function getObject(string $query) : array {
        self::trace("getObject {$query}");
        return self::getObjectFromDB($query);
    }

    public function getObjectList(string $query) : array {
        return self::getObjectListFromDB($query);
    }

    public function getCollection(string $query) : array {
        return self::getCollectionFromDb($query);
    }


    protected function getGameName( )
    {
		// Used for translations and stuff. Please do not modify.
        return "cascadiacannonfodder";
    }	

    /*
        setupNewGame:
        
        This method is called only once, when a new game is launched.
        In this method, you must setup the game according to the game rules, so that
        the game is ready to be played.
    */
    protected function setupNewGame( $players, $options = array() )
    {    
        \NieuwenhovenGames\Cascadia\PlayerSetup::create($this->getGameStateValue('number_ai_players'))->setup($players);

        // Set the colors of the players with HTML color code
        // The default below is red/green/blue/orange/brown
        // The number of colors defined here must correspond to the maximum number of players allowed for the gams
        $gameinfos = $this->getGameinfos();
        $default_colors = $gameinfos['player_colors'];
 
        // Create players
        // Note: if you added some extra field on "player" table in the database (dbmodel.sql), you can initialize it there.
        $sql = "INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES ";
        $values = array();
        foreach( $players as $player_id => $player )
        {
            $color = array_shift( $default_colors );
            $values[] = "('".$player_id."','$color','".$player['player_canal']."','".addslashes( $player['player_name'] )."','".addslashes( $player['player_avatar'] )."')";
        }
        $sql .= implode( ',', $values );
        $this->DbQuery( $sql );
        $this->reattributeColorsBasedOnPreferences( $players, $gameinfos['player_colors'] );
        $this->reloadPlayersBasicInfos();
        
        /************ Start the game initialization *****/

        // Init global values with their initial values
        //$this->setGameStateInitialValue( 'my_first_global_variable', 0 );
        
        // Init game statistics
        // (note: statistics used in this file must be defined in your stats.inc.php file)
        //$this->initStat( 'table', 'table_teststat1', 0 );    // Init a table statistics
        //$this->initStat( 'player', 'player_teststat1', 0 );  // Init a player statistics (for all players)

        // TODO: setup the initial game situation here
        \NieuwenhovenGames\Cascadia\NewGame::create($this->decks)->setPlayers($players)->setup();
       

        // Activate first player (which is in general a good idea :) )
        $this->activeNextPlayer();

        /************ End of the game initialization *****/
    }

    /*
        getAllDatas: 
        
        Gather all informations about current game situation (visible by the current player).
        
        The method is called each time the game interface is displayed to a player, ie:
        _ when the game starts
        _ when a player drawes the game page (F5)
    */
    protected function getAllDatas()
    {
        return \NieuwenhovenGames\Cascadia\GetAllDatas::create($this->decks, $this)->set_active_player_id($this->getActivePlayerId())->set_current_player_id($this->getCurrentPlayerId())->get();
    }

    /*
        getGameProgression:
        
        Compute and return the current game progression.
        The number returned must be an integer beween 0 (=the game just started) and
        100 (= the game is finished or almost finished).
    
        This method is called each time we are in a game state with the "updateGameProgression" property set to true 
        (see states.inc.php)
    */
    function getGameProgression()
    {
        // TODO: compute and return the game progression

        return 0;
    }


//////////////////////////////////////////////////////////////////////////////
//////////// Utility functions
////////////    

    /*
        In this space, you can put any utility methods useful for your game logic
    */



//////////////////////////////////////////////////////////////////////////////
//////////// Player actions
//////////// 

    /*
        Each time a player is doing some game action, one of the methods below is called.
        (note: each method below must match an input method in cascadiacannonfodder.action.php)
    */

    /*
    
    Example:

    function playCard( $card_id )
    {
        // Check that this is the player's turn and that it is a "possible action" at this game state (see states.inc.php)
        $this->checkAction( 'playCard' ); 
        
        $player_id = $this->getActivePlayerId();
        
        // Add your game logic to play a card there 
        ...
        
        // Notify all players about the card played
        $this->notifyAllPlayers( "cardPlayed", clienttranslate( '${player_name} plays ${card_name}' ), array(
            'player_id' => $player_id,
            'player_name' => $this->getActivePlayerName(),
            'card_name' => $card_name,
            'card_id' => $card_id
        ) );
          
    }
    
    */
    public function place_tile($tile, $chosen_wildlife_id) {
        // self::trace(__FUNCTION__);
        self::trace(__FUNCTION__ . "(tile, {$chosen_wildlife_id})");
        $this->initialise();

        $this->actions->choose_wildlife_and_place_tile($chosen_wildlife_id, $tile);
    }

    public function do_not_place_wildlife() {
        // self::trace(__FUNCTION__);
        self::trace(__FUNCTION__ . "()");
        $this->initialise();

        $this->actions->do_not_place_wildlife();
    }

    public function place_wildlife($selected_tile_id) {
        // self::trace(__FUNCTION__);
        self::trace(__FUNCTION__ . "(selected_tile_id)");
        $this->initialise();

        $this->actions->place_wildlife($selected_tile_id);
    }

    protected function initialise() {
        $this->actions = new \NieuwenhovenGames\Cascadia\Actions();

        $this->actions->set_gamestate($this->gamestate);
        $this->actions->set_decks($this->decks);

        $this->actions->set_notifications($this);
        $this->actions->set_database($this);

        // Note: the following statement crashes in setup stage
        $this->actions->set_player_id(self::getCurrentPlayerId());
    }

    
//////////////////////////////////////////////////////////////////////////////
//////////// Game state arguments
////////////

    /*
        Here, you can create methods defined as "game state arguments" (see "args" property in states.inc.php).
        These methods function is to return some additional information that is specific to the current
        game state.
    */

    /*
    
    Example for game state "MyGameState":
    
    function argMyGameState()
    {
        // Get some values from the current game situation in database...
    
        // return values:
        return array(
            'variable1' => $value1,
            'variable2' => $value2,
            ...
        );
    }    
    */

//////////////////////////////////////////////////////////////////////////////
//////////// Game state actions
////////////

    /*
        Here, you can create methods defined as "game state actions" (see "action" property in states.inc.php).
        The action method of state X is called everytime the current game state is set to X.
    */
    
    /*
    
    Example for game state "MyGameState":

    function stMyGameState()
    {
        // Do some stuff ...
        
        // (very often) go to another gamestate
        $this->gamestate->nextState( 'some_gamestate_transition' );
    }    
    */

    public function stNextPlayer() {
        self::trace(__FUNCTION__);

        $this->activeNextPlayer();

        $this->initialise();

        $this->actions->stNextPlayer($this->getActivePlayerId());
    }

    public function stAiPlacesTile() {
        self::trace(__FUNCTION__);
        $this->actions->stAiPlacesTile();
    }

    public function stAiPlacesWildlife() {
        self::trace(__FUNCTION__);
        $this->actions->stAiPlacesWildlife();
    }

    public function stAllPlayersInspectScore() {
        self::trace(__FUNCTION__);
        $this->gamestate->setAllPlayersMultiactive();

        $this->actions->stAllPlayersInspectScore();
    }

//////////////////////////////////////////////////////////////////////////////
//////////// Zombie
////////////

    /*
        zombieTurn:
        
        This method is called each time it is the turn of a player who has quit the game (= "zombie" player).
        You can do whatever you want in order to make sure the turn of this player ends appropriately
        (ex: pass).
        
        Important: your zombie code will be called when the player leaves the game. This action is triggered
        from the main site and propagated to the gameserver from a server, not from a browser.
        As a consequence, there is no current player associated to this action. In your zombieTurn function,
        you must _never_ use getCurrentPlayerId() or getCurrentPlayerName(), otherwise it will fail with a "Not logged" error message. 
    */

    function zombieTurn( $state, $active_player )
    {
    	$statename = $state['name'];
    	
        if ($state['type'] === "activeplayer") {
            switch ($statename) {
                default:
                    $this->gamestate->nextState( "zombiePass" );
                	break;
            }

            return;
        }

        if ($state['type'] === "multipleactiveplayer") {
            // Make sure player is in a non blocking status for role turn
            $this->gamestate->setPlayerNonMultiactive( $active_player, '' );
            
            return;
        }

        throw new feException( "Zombie mode not supported at this game state: ".$statename );
    }
    
///////////////////////////////////////////////////////////////////////////////////:
////////// DB upgrade
//////////

    /*
        upgradeTableDb:
        
        You don't have to care about this until your game has been published on BGA.
        Once your game is on BGA, this method is called everytime the system detects a game running with your old
        Database scheme.
        In this case, if you change your Database scheme, you just have to apply the needed changes in order to
        update the game database and allow the game to continue to run with your new version.
    
    */
    
    function upgradeTableDb( $from_version )
    {
        // $from_version is the current version of this game database, in numerical form.
        // For example, if the game was running with a release of your game named "140430-1345",
        // $from_version is equal to 1404301345
        
        // Example:
//        if( $from_version <= 1404301345 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "ALTER TABLE DBPREFIX_xxxxxxx ....";
//            $this->applyDbUpgradeToAllDB( $sql );
//        }
//        if( $from_version <= 1405061421 )
//        {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "CREATE TABLE DBPREFIX_xxxxxxx ....";
//            $this->applyDbUpgradeToAllDB( $sql );
//        }
//        // Please add your future database scheme changes here
//
//


    }    
}
