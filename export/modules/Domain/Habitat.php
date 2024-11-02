<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

class Habitat {
    /**
     * Usage: all_data = Habitat(sources from data sources factory)->get();
     */
    public function getCandidatePositionsSource() {
        return new CandidatePositions();
    }
}

class CandidatePositions {
    public function get(): array {return [];}
}
?>
