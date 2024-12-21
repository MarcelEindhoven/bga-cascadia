<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

 include_once(__DIR__.'/../BGA/Action.php');

class PlayerPlacesWildlife extends \NieuwenhovenGames\BGA\Action {
    static public function create($gamestate): PlayerPlacesWildlife {
        $object = new PlayerPlacesWildlife($gamestate);
        return $object;
    }

    public function set_wildlife_handler($wildlife_handler) : PlayerPlacesWildlife {
        $this->wildlife_handler = $wildlife_handler;
        return $this;
    }

    public function set_chosen_tile($selected_tile_id) : PlayerPlacesWildlife {
        $this->selected_tile_id = $selected_tile_id;
        return $this;
    }

    public function set_player_id($player_id) : PlayerPlacesWildlife {
        $this->player_id = $player_id;
        return $this;
    }

    public function execute(): PlayerPlacesWildlife {
        $wildlife_specification = $this->wildlife_handler->get_chosen();

        $this->wildlife_handler->move_to_habitat_tile($wildlife_specification, $this->player_id, $this->selected_tile_id);

        $wildlife = $this->wildlife_handler->get_from_habitat($wildlife_specification['id']);
        $this->notifications->notifyAllPlayers('wildlife_placed', 'wildlife_placed', ['wildlife' => $wildlife]);

        return $this;
    }
}
?>
