<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/../BGA/Action.php');

class AIChoosesTileAndPositionAndWildlife extends \NieuwenhovenGames\BGA\Action {
    protected int $market_index = -1;
    protected int $adjacent_positions_index = -1;
    protected array $current_data = [];

    static public function create($gamestate): AIChoosesTileAndPositionAndWildlife {
        $object = new AIChoosesTileAndPositionAndWildlife($gamestate);
        return $object;
    }

    public function execute(): AIChoosesTileAndPositionAndWildlife {
        $this->current_data = $this->get_current_data->get();

        $this->choose_market_index();
        $this->choose_adjacent_positions_index();

        return $this;
    }

    public function get_chosen_wildlife_id() {
        return $this->current_data['market']['wildlife'][$this->market_index]['id'];
    }

    public function get_placed_tile() {
        $tile = $this->current_data['market']['tile'][$this->market_index];
        $adjacent_positions = $this->current_data['adjacent_positions'];
        $adjacent_positions_keys = array_keys($adjacent_positions);
        $position = $adjacent_positions[$adjacent_positions_keys[$this->adjacent_positions_index]];
        $tile['horizontal'] = $position['horizontal'];
        $tile['vertical'] = $position['vertical'];
        $tile['rotation'] = 0;
        return $tile;
    }

    protected function choose_market_index() {
        $this->market_index = rand(0, 3);
    }

    protected function choose_adjacent_positions_index() {
        $this->adjacent_positions_index = rand(0, count($this->current_data['adjacent_positions']) - 1);
    }
}
?>
