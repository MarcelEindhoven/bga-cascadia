<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */
include_once(__DIR__.'/../BGA/FrameworkInterfaces/Deck.php');

class WildlifeFactory {
    protected array $definitions = [];

    static public function create($deck): WildlifeFactory {
        $object = new WildlifeFactory();
        $object->setDeck($deck);
        return $object;
    }

    public function setDeck($deck): WildlifeFactory {
        $this->deck = $deck;
        return $this;
    }
    public function add($animal_type) {
        $this->definitions[] = array( 'type' => $animal_type, 'type_arg' => 0, 'nbr' => 1);
    }
    public function flush() {
        $this->deck->createCards($this->definitions);
        $this->deck->shuffle(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::STANDARD_DECK);
        $this->definitions = [];
    }
}

class Wildlife {
}
?>
