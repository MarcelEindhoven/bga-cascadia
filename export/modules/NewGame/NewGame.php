<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

 include_once(__DIR__.'/../Gateway/Wildlife.php');
 
 class NewGame {
    static public function create($decks): NewGame {
        $object = new NewGame();
        $wildlife_factory = WildlifeFactory::create($decks['wildlife']);
        $object->setWildlifeFactory($wildlife_factory);
        return $object;
    }

    public function setWildlifeFactory($wildlife_factory) {
        $this->wildlife_factory = $wildlife_factory;
    }

    public function setup() {
        for ($type = 1; $type <= 5; $type ++) {
            for ($number = 0; $number <20; $number ++) {
                $this->wildlife_factory->add($type);
            }
        }
        $this->wildlife_factory->flush();
    }
}
?>
