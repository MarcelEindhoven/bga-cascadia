<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */
include_once(__DIR__.'/../BGA/FrameworkInterfaces/Deck.php');
include_once(__DIR__.'/Habitat.php');
include_once(__DIR__.'/Wildlife.php');

class MarketGateway {
    protected array $definitions = [];

    static public function create($decks): MarketGateway {
        $object = new MarketGateway();
        $object->setDecks($decks);
        return $object;
    }

    public function setDecks($decks): MarketGateway {
        $this->decks = $decks;
        return $this;
    }

    public function setup($market_size): MarketGateway {
        foreach ($this->decks as $name => $deck) {
            for ($i = 0; $i <$market_size; $i++) {
                $deck->pickCardForLocation(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::STANDARD_DECK, 'market', $i);
            }
        }
        return $this;
    }
}
class CurrentMarket {
    protected array $converters = [];

    static public function create($decks): CurrentMarket {
        $object = new CurrentMarket();
        $object->setDecks($decks);
        return $object;
    }

    public function setDecks($decks): CurrentMarket {
        $this->converters['habitat'] = CurrentHabitat::create($decks['habitat']);
        $this->converters['wildlife'] = CurrentWildlife::create($decks['wildlife']);
        return $this;
    }

    public function get(): array {
        $items_per_row = [];
        foreach ($this->converters as $name => $converter) {
            $items_per_row[$name] = $converter->getMarket();
        }
        return $items_per_row;
    }
    protected function unpackHabitatCards($cards): array {
        $unpacked_cards = [];
        foreach ($cards as $card) {
            $unpacked_cards[] = $this->unpackHabitat($card);
        }
        return $unpacked_cards;
    }
    protected function unpackHabitat($card): array {
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
