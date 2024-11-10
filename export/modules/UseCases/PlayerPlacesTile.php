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

    public function set_territory($territory) : PlayerPlacesTile {
        $this->territory = $territory;
        return $this;
    }

    public function set_storage($storage) : PlayerPlacesTile {
        $this->storage = $storage;
        return $this;
    }

    public function set_tile($tile) : PlayerPlacesTile {
        $this->tile = $tile;
        return $this;
    }

    public function execute(): PlayerPlacesTile {
        $this->territory->move($this->storage, $this->tile);

        return $this;
    }
}
?>
