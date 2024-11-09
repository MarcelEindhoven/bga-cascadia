<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

 include_once(__DIR__.'/../BGA/Action.php');

class PlayerPlacesTile extends \NieuwenhovenGames\BGA\Action {
    /**
     * Usage: candidate_positions = PlayerPlacesTile($tiles)->getAdjacentPositionsSource()->get();
     */
    static public function create($gamestate): PlayerPlacesTile {
        $object = new PlayerPlacesTile($gamestate);
        return $object;
    }
}
?>
