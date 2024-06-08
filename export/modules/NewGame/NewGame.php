<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

namespace NieuwenhovenGames\Cascadia;
class NewGame {
    public function setup() {
        for ($type = 1; $type <= 5; $type ++) {
            for ($number = 0; $number <20; $number ++) {
                $this->wildlife_factory->add($type);
            }
        }
        $this->wildlife_factory->flush();
    }
    public function setWildlifeFactory($wildlife_factory) {
        $this->wildlife_factory = $wildlife_factory;
    }
}
?>
