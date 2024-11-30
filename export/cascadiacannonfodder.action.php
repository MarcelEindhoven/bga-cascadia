<?php
/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 * This code has been produced on the BGA studio platform for use on https://boardgamearena.com.
 * See http://en.doc.boardgamearena.com/Studio for more information.
 * -----
 * 
 * cascadiacannonfodder.action.php
 *
 * CascadiaCannonFodder main action entry point
 *
 *
 * In this file, you are describing all the methods that can be called from your
 * user interface logic (javascript).
 *       
 * If you define a method "myAction" here, then you can call it from your javascript code with:
 * this.ajaxcall( "/cascadiacannonfodder/cascadiacannonfodder/myAction.html", ...)
 *
 */
  
  
  class action_cascadiacannonfodder extends APP_GameAction
  { 
    // Constructor: please do not modify
   	public function __default()
  	{
  	    if( $this->isArg( 'notifwindow') )
  	    {
            $this->view = "common_notifwindow";
  	        $this->viewArgs['table'] = $this->getArg( "table", AT_posint, true );
  	    }
  	    else
  	    {
            $this->view = "cascadiacannonfodder_cascadiacannonfodder";
            $this->trace( "Complete reinitialization of board game" );
      }
  	} 
  	

    public function place_tile() {
      $this->setAjaxMode();     
      self::trace(__FUNCTION__);

      // Retrieve arguments
      // Note: these arguments correspond to what has been sent through the javascript "ajaxcall" method
      $placed_tile = [
        'horizontal' => $this->getArg( "placed_tile_horizontal", AT_posint, true ),
        'vertical' => $this->getArg( "placed_tile_vertical", AT_posint, true ),
        'rotation' => $this->getArg( "placed_tile_rotation", AT_posint, true ),
        'id' => $this->getArg( "placed_tile_id", AT_alphanum, true ), 
      ];
      $selected_wildlife_id = $this->getArg( "selected_wildlife_id", AT_alphanum, true );

      // Then, call the appropriate method in your game logic, like "playCard" or "myAction"
      $this->game->place_tile($placed_tile, $selected_wildlife_id);

      $this->ajaxResponse( );
    }

    public function place_wildlife() {
      $this->setAjaxMode();     
      self::trace(__FUNCTION__);

      // Retrieve arguments
      // Note: these arguments correspond to what has been sent through the javascript "ajaxcall" method
      $selected_tile = [
        'id' => $this->getArg( "selected_tile_id", AT_alphanum, true ), 
      ];

      // Then, call the appropriate method in your game logic, like "playCard" or "myAction"
      $this->game->place_wildlife($selected_tile);

      $this->ajaxResponse( );
    }

    /*
    
    Example:
  	
    public function myAction()
    {
        $this->setAjaxMode();     

        // Retrieve arguments
        // Note: these arguments correspond to what has been sent through the javascript "ajaxcall" method
        $arg1 = $this->getArg( "myArgument1", AT_posint, true );
        $arg2 = $this->getArg( "myArgument2", AT_posint, true );

        // Then, call the appropriate method in your game logic, like "playCard" or "myAction"
        $this->game->myAction( $arg1, $arg2 );

        $this->ajaxResponse( );
    }
    
    */

  }
  

