<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

class Habitat {
    protected array $tiles = [];
    protected array $wildlifes = [];

    /**
     * Usage: candidate_positions = Habitat($tiles)->getAdjacentPositionsSource()->get();
     */
    static public function create($tiles, $wildlifes): Habitat {
        $object = new Habitat();
        $object->tiles = $tiles;
        $object->wildlifes = $wildlifes;
        return $object;
    }

    public function get_adjacent_positions() {
        return AdjacentPositions::create($this->tiles)->get();
    }

    public function get_candidate_tiles_for_chosen_wildlife($wildlife) {
        $tiles = [];
        foreach ($this->tiles as $tile)
            if ($this->is_supported($wildlife, $tile))
                if (!$this->is_occupied($tile))
                    array_push($tiles, $tile);
        return $tiles;
    }
    protected function is_occupied($tile) {
        $tile_unique_id = $tile['unique_id'];
        foreach ($this->wildlifes as $wildlife)
            if ($wildlife['tile_unique_id'] == $tile_unique_id)
                return true;
        return false;
    }
    protected function is_supported($wildlife, $tile) {
        return in_array($wildlife['type'], $tile['supported_wildlife']);
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
