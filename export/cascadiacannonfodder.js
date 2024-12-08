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
    g_gamethemeurl + 'modules/javascript/wildlife.js',
    g_gamethemeurl + 'modules/javascript/habitat.js',
    g_gamethemeurl + 'modules/javascript/market.js',
    g_gamethemeurl + 'modules/javascript/token_subscriptions.js',
    g_gamethemeurl + 'modules/javascript/usecase_setup.js',
    g_gamethemeurl + 'modules/javascript/usecase_place_tile.js',
    g_gamethemeurl + 'modules/javascript/usecase_place_wildlife.js',
    g_gamethemeurl + 'modules/javascript/usecase_select_wildlife.js',
    "ebg/core/gamegui",
    "ebg/counter"
],
function (dojo, declare, framework, habitat_tile_class, wildlife_class, habitat_class, market, token_subscriptions, usecase_setup, usecase_place_tile, usecase_place_wildlife, usecase_select_wildlife) {
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

            this.wildlife_factory = {class:wildlife_class, dependencies: {framework: this.framework}, create: function(wildlife_specification) {return new this.class(this.dependencies, wildlife_specification);}};
            this.habitat_tile_factory = {class:habitat_tile_class, dependencies: {framework: this.framework}, token_subscriptions: this.token_subscriptions, 
                create: function(tile_specification) {tile = new this.class(this.dependencies, tile_specification); tile.subscribe_selected(this.token_subscriptions, 'token_selected'); return tile;}};
            this.habitat_factory = {class:habitat_class, dependencies: {framework: this.framework, token_subscriptions: this.token_subscriptions,}, create: function(player_id) {return new this.class(this.dependencies, player_id);}};
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
    
            this.prototyping(gamedatas);

            this.market = new market();
            this.market.set_token_subscriptions(this.token_subscriptions);
    
            this.usecase_setup = new usecase_setup({framework: this.framework, market: this.market, habitat_tile_factory: this.habitat_tile_factory, wildlife_factory: this.wildlife_factory, habitat_factory: this.habitat_factory});
            this.usecase_setup.setup(gamedatas);
            this.habitat = this.usecase_setup.get_habitats();
            this.chosen_wildlife =  this.usecase_setup.get_chosen();

            this.framework.control_may_be_returned_to_user();

            console.log( "Ending game setup" );
        },
        prototyping: function(gamedatas) {
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
                case 'playerPlacesTile':
                    if (this.isCurrentPlayerActive())
                        this.place_tile();
                    break;
                case 'playerPlacesWildlife':
                    if (this.isCurrentPlayerActive())
                        this.place_wildlife();
                    break;
            }
        },
        place_wildlife() {
            console.log('place_wildlife');
            this.usecase_place_wildlife = new usecase_place_wildlife({habitat: this.habitat[this.player_id], chosen_wildlife: this.chosen_wildlife});
            this.usecase_place_wildlife.subscribe_wildlife_placed(this, 'wildlife_placed');
        },
        wildlife_placed: function(tile) {
            console.log('wildlife_placed');
            console.log(tile);
            delete this.usecase_place_wildlife;

            this.call('place_wildlife', {selected_tile_id: tile.id});
        },
        place_tile() {
            this.usecase_place_tile = new usecase_place_tile({market: this.market, habitat: this.habitat[this.player_id], token_subscriptions: this.token_subscriptions, habitat_tile_factory: this.habitat_tile_factory});
            this.usecase_place_tile.set_candidate_positions(this.gamedatas.adjacent_positions);
            this.usecase_place_tile.subscribe_tile_placed(this, 'tile_position_chosen');

            this.usecase_select_wildlife = new usecase_select_wildlife({market: this.market});
            // this.usecase_select_wildlife.initialise(); Already done in constructor

            // Must be last, after the use case subscriptions to the market
            this.market.subscribe_tile_selected(this.framework, 'control_may_be_returned_to_user');
        },
        tile_position_chosen: function(tile) {
            console.log('tile_position_chosen');
            console.log(tile);

            this.market.unsubscribe_tile_selected(this.framework, 'control_may_be_returned_to_user');
            delete this.usecase_place_tile;

            tile.rotation = 0;
            this.call('place_tile', {placed_tile_horizontal: tile.horizontal, placed_tile_vertical: tile.vertical, placed_tile_rotation: tile.rotation, placed_tile_id: tile.id, selected_wildlife_id: this.usecase_select_wildlife.get_selected_wildlife().id});

            this.usecase_select_wildlife.terminate();
            delete this.usecase_select_wildlife;
        },
        call: function(action, args, handler) {
            console.log(action);
            if (!args) {
                args = {};
            }
            args.lock = true;

            this.ajaxcall("/" + this.game_name + "/" + this.game_name + "/" + action + ".html", args, this, (result) => { }, handler);
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
                    case 'playerPlacesWildlife':
                        this.addActionButton( 'button_1_id', _('Do not place wildlife'), 'do_not_place_wildlife' ); 
                        break;
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
        do_not_place_wildlife: function () {
            this.call('do_not_place_wildlife');
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

            dojo.subscribe( 'tile_placed', this, "notify_tile_placed" );
            this.notifqueue.setSynchronous( 'tile_placed', 5 );

            dojo.subscribe( 'wildlife_placed', this, "notify_wildlife_placed" );
            this.notifqueue.setSynchronous( 'wildlife_placed', 5 );

            dojo.subscribe( 'wildlife_chosen', this, "notify_wildlife_chosen" );
            this.notifqueue.setSynchronous( 'wildlife_chosen', 5 );

            dojo.subscribe( 'debug', this, "notify_debug" );
            this.notifqueue.setSynchronous( 'debug', 5 );

            dojo.subscribe( 'market_refill_tile', this, "notify_market_refill_tile" );
            this.notifqueue.setSynchronous( 'market_refill_tile', 5 );

            dojo.subscribe( 'market_refill_wildlife', this, "notify_market_refill_wildlife" );
            this.notifqueue.setSynchronous( 'market_refill_wildlife', 5 );

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
        notify_market_refill_wildlife: function(notif) {
            console.log('notify_market_refill_wildlife');
            console.log(notif.args);
            wildlife_specification = notif.args;
            console.log(wildlife_specification);
            this.market.populate(this.wildlife_factory.create(wildlife_specification));
            this.framework.control_may_be_returned_to_user();
        },
        notify_market_refill_tile: function(notif) {
            console.log('notify_market_refill_tile');
            console.log(notif.args);
            tile_specification = notif.args;
            console.log(tile_specification);
            this.market.place(this.habitat_tile_factory.create(tile_specification));
            this.framework.control_may_be_returned_to_user();
        },
        notify_debug: function(notif) {
            console.log('notify_debug');
            console.log(notif.args);
        },
        notify_wildlife_chosen: function(notif) {
            console.log('notify_wildlife_chosen');
            wildlife_specification = notif.args.wildlife;
            console.log(wildlife_specification);
            wildlife = this.market.remove_wildlife(wildlife_specification);
            this.update_object_with(wildlife, wildlife_specification);
            this.chosen_wildlife = wildlife;
            console.log(this.chosen_wildlife);
            this.framework.control_may_be_returned_to_user();
        },
        notify_wildlife_placed: function(notif) {
            console.log('notify_wildlife_placed');
            console.log(notif.args);
            wildlife_specification = notif.args.wildlife;
            this.update_object_with(this.chosen_wildlife, wildlife_specification);
            this.habitat[wildlife_specification.location].populate(this.chosen_wildlife);
            delete this.chosen_wildlife;
            this.framework.control_may_be_returned_to_user();
        },
        notify_tile_placed: function(notif) {
            console.log('notify_tile_placed');
            console.log(notif.args);
            tile_specification = notif.args.tile;
            console.log(tile_specification);
            tile = this.market.remove_tile(tile_specification);
            this.update_object_with(tile, tile_specification);
            this.habitat[tile.location].place(tile);
            this.framework.control_may_be_returned_to_user();
        },
        update_object_with: function(object, properties) {
            for (var property in properties) {
                object[property] = properties[property];
            }

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
