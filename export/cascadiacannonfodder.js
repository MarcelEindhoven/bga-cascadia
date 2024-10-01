/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * cascadiacannonfodder.js
 *
 * CascadiaCannonFodder user interface script
 * 
 * In this file, you are describing the logic of your user interface, in Javascript language.
 *
 */

define([
    "dojo","dojo/_base/declare",
    g_gamethemeurl + 'modules/BGA/javascript/framework.js',
    g_gamethemeurl + 'modules/javascript/habitat_tile.js',
    g_gamethemeurl + 'modules/javascript/habitat.js',
    g_gamethemeurl + 'modules/javascript/market.js',
    g_gamethemeurl + 'modules/javascript/token_subscriptions.js',
    g_gamethemeurl + 'modules/javascript/usecase_setup.js',
    g_gamethemeurl + 'modules/javascript/usecase_place_tile.js',
    "ebg/core/gamegui",
    "ebg/counter"
],
function (dojo, declare, framework, habitat_tile_class, habitat_class, market, token_subscriptions, usecase_setup, usecase_place_tile) {
    return declare("bgagame.cascadiacannonfodder", ebg.core.gamegui, {
        constructor: function(){
            console.log('cascadiacannonfodder constructor');
            console.log(dojo.version.toString());
              
            // Here, you can init the global variables of your user interface
            // Example:
            // this.myGlobalValue = 0;
            this.framework = new framework();
            this.framework.setGameGUI(this);
            this.framework.setDojo(dojo);            

            this.token_subscriptions = new token_subscriptions();
            this.token_subscriptions.setFramework(this.framework);

            this.habitat_tile_factory = {class:habitat_tile_class, dependencies: {framework: this.framework}, create: function(tile_specification) {return new this.class(this.dependencies, tile_specification);}};
            this.habitat_factory = {class:habitat_class, dependencies: {framework: this.framework}, create: function(player_id) {return new this.class(this.dependencies, player_id);}};

            this.market = new market();
            this.market.setFramework(this.framework);
            this.market.set_token_subscriptions(this.token_subscriptions);
        },
        
        /*
            setup:
            
            This method must set up the game user interface according to current game situation specified
            in parameters.
            
            The method is called each time the game interface is displayed to a player, ie:
            _ when the game starts
            _ when a player drawes the game page (F5)
            
            "gamedatas" argument contains all datas retrieved by your "getAllDatas" PHP method.
        */
        
        setup: function( gamedatas )
        {
            console.log("Starting game setup", gamedatas);
            
            // Setting up player boards
            for( var player_id in gamedatas.players )
            {
                var player = gamedatas.players[player_id];
                         
                // TODO: Setting up players boards if needed
            }
            
            // TODO: Set up your game interface here, according to "gamedatas"
            // Setup game notifications to handle (see "setupNotifications" method below)
            this.setupNotifications();
            //this.marketSetup(gamedatas.market);

            //this.prototyping(gamedatas);
    
            this.usecase_setup = new usecase_setup({framework: this.framework, market: this.market, habitat_tile_factory: this.habitat_tile_factory, habitat_factory: this.habitat_factory});
            this.usecase_setup.setup(gamedatas);

            this.framework.control_may_be_returned_to_user();

            console.log( "Ending game setup" );
        },
        prototyping: function(gamedatas) {


            this.place_tile = new usecase_place_tile();
            this.place_tile.set_candidate_positions([{horizontal: 50, vertical: 53}]);
            this.place_tile.set_tile_handler(this.habitat_tiles);
            this.place_tile.set_token_subscriptions(this.token_subscriptions);
            this.place_tile.set_habitat(this.habitat[this.player_id]);
            this.place_tile.setFramework(this.framework);
            this.place_tile.subscribe_tile_placed(this, 'tile_placed');
            this.market.subscribe_tile_selected(this.place_tile, 'market_tile_selected');
            this.market.subscribe_tile_selected(this.framework, 'control_may_be_returned_to_user');
            },
        marketSetup: function(market) {
            this.marketSetupWildlife(market.wildlife);
            this.marketSetupHabitat(market.habitat);
            this.framework.subscribe_paint(this.market);
        },
        marketSetupWildlife: function(wildlife) {
            for (var index in wildlife) {
                w = wildlife[index];
                this.framework.createToken('wildlife', 'wildlife' + w.id, 'wildlife' + w.type);
                this.framework.move('wildlife' + w.id, 'wildlife_' + w.location_arg);
            }
        },
        habitat_selected: function(tile) {
            console.log('habitat_selected');
            console.log(tile);
        },
        habitat_selected1: function(tile) {
            console.log('habitat_selected1');
            console.log(tile);
        },
        tile_placed: function(tile) {
            console.log('tile_placed');
            console.log(tile);
        },

        ///////////////////////////////////////////////////
        //// Game & client states
        
        // onEnteringState: this method is called each time we are entering into a new game state.
        //                  You can use this method to perform some user interface changes at this moment.
        //
        onEnteringState: function( stateName, args )
        {
            console.log( 'Entering state: '+stateName );
            
            switch( stateName )
            {
            
            /* Example:
            
            case 'myGameState':
            
                // Show some HTML block at this game state
                dojo.style( 'my_html_block_id', 'display', 'block' );
                
                break;
           */
           
           
            case 'dummmy':
                break;
            }
        },

        // onLeavingState: this method is called each time we are leaving a game state.
        //                 You can use this method to perform some user interface changes at this moment.
        //
        onLeavingState: function( stateName )
        {
            console.log( 'Leaving state: '+stateName );
            
            switch( stateName )
            {
            
            /* Example:
            
            case 'myGameState':
            
                // Hide the HTML block we are displaying only during this game state
                dojo.style( 'my_html_block_id', 'display', 'none' );
                
                break;
           */
           
           
            case 'dummmy':
                break;
            }               
        }, 

        // onUpdateActionButtons: in this method you can manage "action buttons" that are displayed in the
        //                        action status bar (ie: the HTML links in the status bar).
        //        
        onUpdateActionButtons: function( stateName, args )
        {
            console.log( 'onUpdateActionButtons: '+stateName );
                      
            if( this.isCurrentPlayerActive() )
            {            
                switch( stateName )
                {
/*               
                 Example:
 
                 case 'myGameState':
                    
                    // Add 3 action buttons in the action status bar:
                    
                    this.addActionButton( 'button_1_id', _('Button 1 label'), 'onMyMethodToCall1' ); 
                    this.addActionButton( 'button_2_id', _('Button 2 label'), 'onMyMethodToCall2' ); 
                    this.addActionButton( 'button_3_id', _('Button 3 label'), 'onMyMethodToCall3' ); 
                    break;
*/
                }
            }
        },        

        ///////////////////////////////////////////////////
        //// Utility methods
        
        /*
        
            Here, you can defines some utility methods that you can use everywhere in your javascript
            script.
        
        */


        ///////////////////////////////////////////////////
        //// Player's action
        
        /*
        
            Here, you are defining methods to handle player's action (ex: results of mouse click on 
            game objects).
            
            Most of the time, these methods:
            _ check the action is possible at this game state.
            _ make a call to the game server
        
        */
        
        /* Example:
        
        onMyMethodToCall1: function( evt )
        {
            console.log( 'onMyMethodToCall1' );
            
            // Preventing default browser reaction
            dojo.stopEvent( evt );

            // Check that this action is possible (see "possibleactions" in states.inc.php)
            if( ! this.checkAction( 'myAction' ) )
            {   return; }

            this.ajaxcall( "/cascadiacannonfodder/cascadiacannonfodder/myAction.html", { 
                                                                    lock: true, 
                                                                    myArgument1: arg1, 
                                                                    myArgument2: arg2,
                                                                    ...
                                                                 }, 
                         this, function( result ) {
                            
                            // What to do after the server call if it succeeded
                            // (most of the time: nothing)
                            
                         }, function( is_error) {

                            // What to do after the server call in anyway (success or failure)
                            // (most of the time: nothing)

                         } );        
        },        
        
        */

        
        ///////////////////////////////////////////////////
        //// Reaction to cometD notifications

        /*
            setupNotifications:
            
            In this method, you associate each of your game notifications with your local method to handle it.
            
            Note: game notification names correspond to "notifyAllPlayers" and "notifyPlayer" calls in
                  your cascadiacannonfodder.game.php file.
        
        */
        setupNotifications: function()
        {
            console.log( 'notifications subscriptions setup' );
            
            // TODO: here, associate your game notifications with local methods
            
            // Example 1: standard notification handling
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            
            // Example 2: standard notification handling + tell the user interface to wait
            //            during 3 seconds after calling the method in order to let the players
            //            see what is happening in the game.
            // dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );
            // this.notifqueue.setSynchronous( 'cardPlayed', 3000 );
            // 
        },  
        
        // TODO: from this point and below, you can write your game notifications handling methods
        
        /*
        Example:
        
        notif_cardPlayed: function( notif )
        {
            console.log( 'notif_cardPlayed' );
            console.log( notif );
            
            // Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call
            
            // TODO: play the card in the user interface.
        },    
        
        */
   });             
});
