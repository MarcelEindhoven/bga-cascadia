<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/../BGA/Action.php');

class AIChoosesTileAndPositionAndWildlife extends \NieuwenhovenGames\BGA\Action {
    static public function create($gamestate): AIChoosesTileAndPositionAndWildlife {
        $object = new AIChoosesTileAndPositionAndWildlife($gamestate);
        return $object;
    }

    public function execute(): AIChoosesTileAndPositionAndWildlife {
        $this->choose_market_index();

        return $this;
    }

    public function get_chosen_wildlife_id() {
        return $this->get_current_data->get()['market']['wildlife'][$this->market_index]['id'];
    }

    protected function choose_market_index() {
        $this->market_index = rand(0, 3);
    }
}
?>
