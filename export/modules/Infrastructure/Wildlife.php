<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */
include_once(__DIR__.'/../BGA/FrameworkInterfaces/Deck.php');

class WildlifeSetup {
    protected array $definitions = [];

    static public function create($deck): WildlifeSetup {
        $object = new WildlifeSetup();
        $object->setDeck($deck);
        return $object;
    }

    public function setDeck($deck): WildlifeSetup {
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

class CurrentWildlife {
    static public function create($deck): CurrentWildlife {
        $object = new CurrentWildlife();
        $object->setDeck($deck);
        return $object;
    }

    public function setDeck($deck): CurrentWildlife {
        $this->deck = $deck;
        return $this;
    }

    public function setPlayers($players): CurrentWildlife {
        $this->players = $players;
        return $this;
    }

    public function getMarket(): array {
        return $this->deck->getCardsInLocation('market');
    }

    public function get(): array {
        $wildlife_per_player = [];
        foreach ($this->players as $player_id => $player) {
            $wildlife_per_player[$player_id] = [];
            foreach ($this->deck->getCardsInLocation($player_id) as $card) {
                $card['rotation'] = intdiv($card['location_arg'], 10000);

                $remainder = $card['location_arg'] - ($card['rotation'] * 10000);
                $card['y'] = intdiv($remainder, 100);

                $remainder = $remainder - ($card['y'] * 100);
                $card['x'] = $remainder;

                $wildlife_per_player[$player_id][] = $card;
            }
        }
        return $wildlife_per_player;
    }
}
?>
