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
     * wildlife_handler supports move($deck, $moved_element)
     */
    public function set_wildlife_handler($wildlife_handler) : PlayerPlacesWildlife {
        $this->wildlife_handler = $wildlife_handler;
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
     * selected_tile_id contains keys id
     */
    public function set_chosen_tile($selected_tile_id) : PlayerPlacesWildlife {
        $this->selected_tile_id = $selected_tile_id;
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
        $tile = $this->wildlife_handler->get_tile($this->tile_deck, $this->selected_tile_id);

        $chosen_wildlife_cards = $this->wildlife_deck->getCardsInLocation('chosen');
        $wildlife_specification = array_pop($chosen_wildlife_cards);

        $wildlife_specification['horizontal'] = $tile['horizontal'];
        $wildlife_specification['vertical'] = $tile['vertical'];
        $wildlife_specification['rotation'] = 0;

        $this->wildlife_handler->move($this->wildlife_deck, $wildlife_specification);

        $wildlife = $this->wildlife_handler->get_wildlife($this->wildlife_deck, $wildlife_specification);
        $this->notifications->notifyAllPlayers('wildlife_placed', 'wildlife_placed', ['wildlife' => $wildlife]);

        return $this;
    }
}
?>
