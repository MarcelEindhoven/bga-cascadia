<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

class Habitat {
    protected array $tiles = [];
    /**
     * Usage: candidate_positions = Habitat($tiles)->getAdjacentPositionsSource()->get();
     */
    static public function create($tiles): Habitat {
        $object = new Habitat();
        $object->tiles = $tiles;
        return $object;
    }
    public function getAdjacentPositionsSource() {
        return AdjacentPositions::create($this->tiles);
    }
    public function get_adjacent_positions() {
        return AdjacentPositions::create($this->tiles)->get();
    }
}

class AdjacentPositions {
    protected array $positions = [];
    static public function create($tiles): AdjacentPositions {
        $object = new AdjacentPositions();
        $object->set_tiles($tiles);
        return $object;
    }
    public function set_tiles($tiles) {
        foreach ($tiles as $tile) {
            $h = $tile['horizontal'];
            $v = $tile['vertical'];
            $special = ($h %2 == 0) ? 1 : -1;

            $this->add_position(['horizontal' => $h + 2, 'vertical' => $v]);
            $this->add_position(['horizontal' => $h - 2, 'vertical' => $v]);
            $this->add_position(['horizontal' => $h + 1, 'vertical' => $v]);
            $this->add_position(['horizontal' => $h + 1, 'vertical' => $v + $special]);
            $this->add_position(['horizontal' => $h - 1, 'vertical' => $v]);
            $this->add_position(['horizontal' => $h - 1, 'vertical' => $v + $special]);
        }
        foreach ($tiles as $tile) {
            $this->remove_position($tile);
        }
    }
    protected function add_position($position) {
        if (! $this->contains_position($position))
            array_push($this->positions, $position);
    }
    public function contains_position($candidate_position) {
        foreach ($this->positions as $position)
            if ($this->are_positions_equal($candidate_position, $position))
                return true;
        return false;
    }
    protected function remove_position($position) {
        foreach (array_keys($this->positions) as $key)
            if ($this->are_positions_equal($this->positions[$key], $position))
                unset($this->positions[$key]);
    }
    static protected function are_positions_equal($position1, $position2) {
        return ($position1['horizontal'] == $position2['horizontal']) && ($position1['vertical'] == $position2['vertical']);
    }
    public function get(): array {return $this->positions;}
}
?>
