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
        $this->placeTile($starter_tile[2], $player_id, 51, 51, 0);
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

class CurrentHabitatTerritory {
    protected array $players;

    static public function create($deck): CurrentHabitatTerritory {
        $object = new CurrentHabitatTerritory();
        $object->setDeck($deck);
        return $object;
    }
    public function setDeck($deck): CurrentHabitatTerritory {
        $this->deck = $deck;
        return $this;
    }

    public function setPlayers($players): CurrentHabitatTerritory {
        $this->players = $players;
        return $this;
    }

    public function get(): array {
        $habitat_per_player = [];
        foreach ($this->players as $player_id => $player) {
            $habitat_per_player[$player_id] = CurrentHabitat::unpackTypes(CurrentTerritory::unpackPositions($this->deck->getCardsInLocation($player_id)));
        }
        return $habitat_per_player;
    }
}

class CurrentTerritory {
    const X = 'horizontal';
    const Y = 'vertical';
    static public function unpackPositions($cards): array {
        $unpacked_cards = [];
        foreach ($cards as & $card) {
            $unpacked_cards[] = CurrentTerritory::unpackPosition($card);
        }
        return $unpacked_cards;
    }
    static public function unpackPosition($card): array {
        $card['rotation'] = intdiv($card['location_arg'], 10000);

        $remainder = $card['location_arg'] - ($card['rotation'] * 10000);
        $card[CurrentTerritory::Y] = intdiv($remainder, 100);

        $remainder = $remainder - ($card[CurrentTerritory::Y] * 100);
        $card[CurrentTerritory::X] = $remainder;

        return $card;
    }
}

class CurrentHabitatMarket {
    static public function create($deck): CurrentHabitatMarket {
        $object = new CurrentHabitatMarket();
        $object->setDeck($deck);
        return $object;
    }
    public function setDeck($deck): CurrentHabitatMarket {
        $this->deck = $deck;
        return $this;
    }

    public function get(): array {
        return CurrentHabitat::unpackTypes(($this->deck->getCardsInLocation('market')));
    }
}

class CurrentHabitat {
    static public function unpackTypes($cards): array {
        $unpacked_cards = [];
        foreach ($cards as $card) {
            $unpacked_cards[] = CurrentHabitat::unpackType($card);
        }
        return $unpacked_cards;
    }

    static protected function unpackType($card): array {
        $card['supported_wildlife'] = CurrentHabitat::calculateTypes($card['type_arg']);
        $card['terrain_types'] = CurrentHabitat::calculateTypes($card['type']);
        $card['unique_id'] = 'tile' . $card['id'];
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
