<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */
include_once(__DIR__.'/../BGA/FrameworkInterfaces/Deck.php');

class ScoringCardSetup {
    protected array $definitions = [];

    static public function create($deck): ScoringCardSetup {
        $object = new ScoringCardSetup();
        $object->setDeck($deck);
        return $object;
    }

    public function setDeck($deck): ScoringCardSetup {
        $this->deck = $deck;
        return $this;
    }
    public function add($animal_type, $index) {
        $this->definitions[] = array( 'type' => $animal_type, 'type_arg' => $index, 'nbr' => 1);
    }
    public function flush() {
        $this->deck->createCards($this->definitions);
        $this->deck->shuffle(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::STANDARD_DECK);
        $this->definitions = [];
    }
    public function deal() {}
}

class CurrentScoringCards {
    static public function create($deck): CurrentScoringCards {
        $object = new ScoringCardSetup();
        $object->setDeck($deck);
        return $object;
    }

    public function setDeck($deck): CurrentScoringCards {
        $this->deck = $deck;
        return $this;
    }

    public function get(): array {
        $cards = $this->deck->getCardsInLocation(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::STANDARD_DECK);
        array_multisort(array_column($cards, 'type'), SORT_ASC, $cards);
        return $cards;
    }
}
?>
