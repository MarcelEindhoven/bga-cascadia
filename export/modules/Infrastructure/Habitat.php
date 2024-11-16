<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */
include_once(__DIR__.'/../BGA/FrameworkInterfaces/Deck.php');

/**
 * Convert tile database into one habitat per player
 */
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
            $habitat_per_player[$player_id] = TileTypes::unpackTypes(CurrentTerritory::unpackPositions($this->deck->getCardsInLocation($player_id)));
        }
        return $habitat_per_player;
    }
}

/**
 * Convert database location argument into rotation and habitat position
 */
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

/**
 * Convert rotation and habitat position into database location argument
 */
class TerritoryUpdate {
    const X = 'horizontal';
    const Y = 'vertical';

    protected string $player_id = "";

    static public function create($player_id) : TerritoryUpdate {$object = new TerritoryUpdate(); $object->player_id = $player_id; return $object;}

    public function move($deck, $moved_element) {
        $deck->moveCard($moved_element['id'], $this->player_id, $moved_element['horizontal'] + $moved_element['vertical'] * 100 + $moved_element['rotation'] * 10000);
    }
}

/**
 * Convert habitat database entries into habitat tiles without rotation or position
 */
class CurrentMarketTiles {
    static public function create($deck): CurrentMarketTiles {
        $object = new CurrentMarketTiles();
        $object->setDeck($deck);
        return $object;
    }
    public function setDeck($deck): CurrentMarketTiles {
        $this->deck = $deck;
        return $this;
    }

    public function get(): array {
        return TileTypes::unpackTypes(($this->deck->getCardsInLocation('market')));
    }
}

/**
 * Convert tile entries with type and type argument into habitat tiles
 */
class TileTypes {
    static public function unpackTypes($cards): array {
        $unpacked_cards = [];
        foreach ($cards as $card) {
            $unpacked_cards[] = TileTypes::unpackType($card);
        }
        return $unpacked_cards;
    }

    static protected function unpackType($card): array {
        $card['supported_wildlife'] = TileTypes::calculateTypes($card['type_arg']);
        $card['terrain_types'] = TileTypes::calculateTypes($card['type']);
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
