<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/PlayerPlacesTile.php');

include_once(__DIR__.'/../Infrastructure/Habitat.php');
include_once(__DIR__.'/../Infrastructure/Market.php');

class Actions {
    static public function create(): Actions {
        $object = new Actions();
        return $object;
    }

    public function set_gamestate($gamestate) : Actions {
        $this->gamestate = $gamestate;
        return $this;
    }

    public function set_decks($decks) : Actions {
        $this->decks = $decks;
        return $this;
    }

    public function set_notifications($notifications) : Actions {
        $this->notifications = $notifications;
        return $this;
    }

    /**
     * Current player ID is not known during game setup
     */
    public function set_player_id($player_id) : Actions {
        $this->player_id = $player_id;
        return $this;
    }

    public function place_tile($tile) {
        $territory = TerritoryUpdate::create($this->player_id);
        PlayerPlacesTile::create($this->gamestate)->set_notifications($this->notifications)->set_territory($territory)->set_tile_deck($this->decks['tile'])->set_moved_tile($tile)->execute()->nextState();
    }

    public function select_wildlife($selected_wildlife_id) {
        MarketUpdate::create($this->decks)->select_wildlife($selected_wildlife_id);
    }
}
?>
