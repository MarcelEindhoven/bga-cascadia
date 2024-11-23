<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

 include_once(__DIR__.'/../BGA/Action.php');

class PlayerPlacesTile extends \NieuwenhovenGames\BGA\Action {
    static public function create($gamestate): PlayerPlacesTile {
        $object = new PlayerPlacesTile($gamestate);
        return $object;
    }

    /**
     * territory supports move($deck, $moved_element)
     */
    public function set_territory($territory) : PlayerPlacesTile {
        $this->territory = $territory;
        return $this;
    }

    /**
     * deck supports moveCard
     */
    public function set_tile_deck($deck) : PlayerPlacesTile {
        $this->deck = $deck;
        return $this;
    }

    /**
     * tile_specification contains keys id, horizontal, vertical, rotation
     */
    public function set_moved_tile($tile_specification) : PlayerPlacesTile {
        $this->tile_specification = $tile_specification;
        return $this;
    }

    public function execute(): PlayerPlacesTile {
        $this->territory->move($this->deck, $this->tile_specification);
        // Notify players
        $tile = $this->territory->get_tile($this->deck, $this->tile_specification);
        $this->notifications->notifyAllPlayers('tile_placed', 'tile_placed', ['tile' => $tile]);

        return $this;
    }
}
?>
