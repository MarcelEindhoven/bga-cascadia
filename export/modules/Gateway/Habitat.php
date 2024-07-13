<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */
include_once(__DIR__.'/../BGA/FrameworkInterfaces/Deck.php');

class HabitatSetup {
    protected array $definitions = [];

    static public function create($deck): HabitatSetup {
        $object = new HabitatSetup();
        $object->setDeck($deck);
        return $object;
    }

    public function setDeck($deck): HabitatSetup {
        $this->deck = $deck;
        return $this;
    }

    public function add($tile) {
        $this->definitions[] = array( 'type' => $this->calculateType($tile[0]), 'type_arg' => $this->calculateType($tile[1]) , 'nbr' => 1);
    }

    static public function calculateType($elements) {
        $total = 0;
        $factor = 1;
        foreach ($elements as $element) {
            $total = $total + $element * $factor;
            $factor = $factor * 6;
        }
        return $total;
    }

    public function addStarterTile($player_id, $starter_tile) {
        $this->placeTile($starter_tile[0], $player_id, 50, 50, 0);
        $this->placeTile($starter_tile[1], $player_id, 49, 51, 5);
        $this->placeTile($starter_tile[2], $player_id, 51, 51, 1);
    }

    public function placeTile($tile, $player_id, $x, $y, $rotation) {
        $definitions[] = array( 'type' => $this->calculateType($tile[0]), 'type_arg' => $this->calculateType($tile[1]), 'nbr' => 1);
        $this->deck->createCards($definitions, $player_id, $x + $y * 100 + $rotation * 10000);
    }

    public function flush() {
        $this->deck->createCards($this->definitions);
        $this->deck->shuffle(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::STANDARD_DECK);
        $this->definitions = [];
    }
}

class CurrentHabitat {
    static public function create($deck): CurrentHabitat {
        $object = new CurrentHabitat();
        $object->setDeck($deck);
        return $object;
    }
    public function setDeck($deck): CurrentHabitat {
        $this->deck = $deck;
        return $this;
    }

    public function getMarket(): array {
        return $this->unpackTypesCards($this->deck->getCardsInLocation('market'));
    }
    protected function unpackTypesCards($cards): array {
        $unpacked_cards = [];
        foreach ($cards as $card) {
            $unpacked_cards[] = $this->unpackTypes($card);
        }
        return $unpacked_cards;
    }
    protected function unpackTypes($card): array {
        $card['supported_wildlife'] = $this->calculateTypes($card['type_arg']);
        $card['terrain_types'] = $this->calculateTypes($card['type']);
        return $card;
    }
    static public function calculateTypes($type_number): array {
        $types = [];
        while ($type_number >0) {
            $types[] = $type_number % 6;
            $type_number = intdiv($type_number, 6);
        }
        return $types;
    }
}
?>
