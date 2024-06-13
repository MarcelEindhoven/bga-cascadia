<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */
include_once(__DIR__.'/../BGA/FrameworkInterfaces/Deck.php');

class HabitatFactory {
    protected array $definitions = [];

    static public function create($deck): HabitatFactory {
        $object = new HabitatFactory();
        $object->setDeck($deck);
        return $object;
    }

    public function setDeck($deck): HabitatFactory {
        $this->deck = $deck;
        return $this;
    }
    public function add($tile) {
    }
    public function addStarterTile($player_id, $starter_tile) {}

    public function flush() {
        $this->deck->createCards($this->definitions);
        $this->deck->shuffle(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::STANDARD_DECK);
        $this->definitions = [];
    }
}

class Habitat {
}
?>
