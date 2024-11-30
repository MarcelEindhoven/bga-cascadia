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

    /**
     * territory supports move($deck, $moved_element)
     */
    public function set_territory($territory) : PlayerPlacesWildlife {
        $this->territory = $territory;
        return $this;
    }

    /**
     * deck supports moveCard
     */
    public function set_tile_deck($deck) : PlayerPlacesWildlife {
        $this->tile_deck = $deck;
        return $this;
    }

    /**
     * tile_specification contains keys id
     */
    public function set_chosen_tile($tile_specification) : PlayerPlacesWildlife {
        $this->tile_specification = $tile_specification;
        return $this;
    }

    /**
     * deck supports moveCard
     */
    public function set_wildlife_deck($deck) : PlayerPlacesWildlife {
        $this->wildlife_deck = $deck;
        return $this;
    }

    public function execute(): PlayerPlacesWildlife {
        $tile = $this->territory->get_tile($this->tile_deck, $this->tile_specification);

        $chosen_wildlife_cards = $this->wildlife_deck->getCardsInLocation('chosen');
        $wildlife_specification = array_pop($chosen_wildlife_cards);

        $wildlife_specification['horizontal'] = $tile['horizontal'];
        $wildlife_specification['vertical'] = $tile['vertical'];
        $wildlife_specification['rotation'] = 0;

        $this->territory->move($this->wildlife_deck, $wildlife_specification);

        $wildlife = $this->territory->get_wildlife($this->wildlife_deck, $wildlife_specification);
        $this->notifications->notifyAllPlayers('wildlife_placed', 'wildlife_placed', ['wildlife' => $wildlife]);

        return $this;
    }
}
?>
