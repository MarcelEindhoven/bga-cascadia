<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */
include_once(__DIR__.'/../BGA/FrameworkInterfaces/Deck.php');

/**
 * Initialise type and reset type_arg
 */
class WildlifeSetup extends CurrentWildlife {
    protected array $definitions = [];

    static public function create($deck): WildlifeSetup {
        $object = new WildlifeSetup();
        $object->setDeck($deck);
        return $object;
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

/**
 * Convert location_arg into tile_unique_id
 * One tile array per player
 */
class CurrentWildlifeTerritory extends CurrentWildlife {
    protected array $players;

    static public function create($deck): CurrentWildlifeTerritory {
        $object = new CurrentWildlifeTerritory();
        $object->setDeck($deck);
        return $object;
    }

    public function setPlayers($players): CurrentWildlifeTerritory {
        $this->players = $players;
        return $this;
    }

    public function get(): array {
        $wildlife_per_player = [];
        foreach ($this->players as $player_id => $player) {
            $wildlife_per_player[$player_id] = CurrentWildlifeTerritory::unpack_tiles(CurrentWildlife::unpackTypes($this->deck->getCardsInLocation($player_id)));
        }
        return $wildlife_per_player;
    }

    static protected function unpack_tiles($cards): array {
        $unpacked_cards = [];
        foreach ($cards as $card) {
            $unpacked_cards[] = CurrentWildlifeTerritory::unpack_tile($card);
        }
        return $unpacked_cards;
    }

    static public function unpack_tile($card): array {
        $card['tile_unique_id'] = 'tile' . $card['location_arg'];
        return $card;
    }
}

/**
 * No conversion needed for location argument
 */
class CurrentWildlifeMarket extends CurrentWildlife {
    static public function create($deck): CurrentWildlifeMarket {
        $object = new CurrentWildlifeMarket();
        $object->setDeck($deck);
        return $object;
    }

    public function get(): array {
        return CurrentWildlife::unpackTypes($this->deck->getCardsInLocation('market'));
    }
}

/**
 * 
 */
class UpdateWildlife extends CurrentWildlife {
    static public function create($deck): UpdateWildlife {
        $object = new UpdateWildlife();
        $object->setDeck($deck);
        return $object;
    }

    public function move_to_habitat_tile($moved_element, $player_id, $selected_tile_id) {
        $this->deck->moveCard($moved_element['id'], $player_id, $selected_tile_id);
    }

    public function get_chosen() {
        $chosen_wildlife_cards = $this->deck->getCardsInLocation('chosen');
        $wildlife = array_pop($chosen_wildlife_cards);
        return CurrentWildlife::unpackType($wildlife);
    }

    public function get_from_habitat($id) {
        return CurrentWildlifeTerritory::unpack_tile(CurrentWildlife::unpackType($this->deck->getCard($id)));
    }
}

/**
 * Convert id into unique_id
 */
class CurrentWildlife {
    public function setDeck($deck): CurrentWildlife {
        $this->deck = $deck;
        return $this;
    }

    static public function unpackTypes($cards): array {
        $unpacked_cards = [];
        foreach ($cards as $card) {
            $unpacked_cards[] = CurrentWildlife::unpackType($card);
        }
        return $unpacked_cards;
    }

    static public function unpackType($card): array {
        $card['unique_id'] = 'wildlife' . $card['id'];
        return $card;
    }
}
?>
