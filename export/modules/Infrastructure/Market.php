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

class MarketInfrastructure {
    protected array $definitions = [];

    static public function create($decks): MarketInfrastructure {
        $object = new MarketInfrastructure();
        $object->setDecks($decks);
        return $object;
    }

    public function setDecks($decks): MarketInfrastructure {
        $this->decks = $decks;
        return $this;
    }

    public function setup($market_size): MarketInfrastructure {
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
        $this->converters['habitat'] = CurrentHabitatMarket::create($decks['tile']);
        $this->converters['wildlife'] = CurrentWildlifeMarket::create($decks['wildlife']);
        return $this;
    }

    public function get(): array {
        $items_per_row = [];
        foreach ($this->converters as $name => $converter) {
            $items_per_row[$name] = $this->getItemsSortedOnRowIndex($converter);
        }
        return $items_per_row;
    }
    protected function getItemsSortedOnRowIndex($converter): array {
        $cards = $converter->get();
        array_multisort(array_column($cards, 'location_arg'), SORT_ASC, $cards);
        return $cards;
    }
}
?>
