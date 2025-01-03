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

/**
 * $decks['tile', 'wildlife']
 */
class CurrentMarket {
    protected array $converters = [];

    static public function create($decks): CurrentMarket {
        $object = new CurrentMarket();
        $object->setDecks($decks);
        return $object;
    }

    public function setDecks($decks): CurrentMarket {
        $this->converters['tile'] = CurrentMarketTiles::create($decks['tile']);
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

    public function get_specific_item($name, $location) {
        return $this->getItemsSortedOnRowIndex($this->converters[$name])[$location];
    }

    protected function getItemsSortedOnRowIndex($converter): array {
        $cards = $converter->get();
        array_multisort(array_column($cards, 'location_arg'), SORT_ASC, $cards);
        return $cards;
    }
}

class MarketUpdate extends CurrentMarket {
    static public function create($decks): MarketUpdate {
        $object = new MarketUpdate();
        $object->setDecks($decks);
        return $object;
    }

    public function setDecks($decks): MarketUpdate {
        $this->decks = ['tile' => $decks['tile'], 'wildlife' => $decks['wildlife']];
        return parent::setDecks($this->decks);
    }

    public function select_wildlife($chosen_wildlife_id) {
        $this->decks['wildlife']->moveCard($chosen_wildlife_id, 'chosen');
    }

    public function get_wildlife_from_id($chosen_wildlife_id) {
        return $this->decks['wildlife']->getCard($chosen_wildlife_id);
    }

    public function refill($category, $position) {
        $this->decks[$category]->pickCardForLocation(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::STANDARD_DECK, 'market', $position);
    }
}
?>
