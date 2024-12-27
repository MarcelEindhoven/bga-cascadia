<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

 include_once(__DIR__.'/../BGA/Action.php');

class AITurn extends \NieuwenhovenGames\BGA\Action {
    static public function create($gamestate): AITurn {
        $object = new AITurn($gamestate);
        return $object;
    }

    public function execute(): AITurn {

        return $this;
    }
}
?>
