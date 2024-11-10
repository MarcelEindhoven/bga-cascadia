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
class MarketSetup {
    protected array $definitions = [];

    static public function create($decks): MarketSetup {
        $object = new MarketSetup();
        $object->setDecks($decks);
        return $object;
    }

    public function setDecks($decks): MarketSetup {
        $this->decks = $decks;
        return $this;
    }

    public function setup($market_size): MarketSetup {
        foreach ($this->decks as $name => $deck) {
            for ($i = 0; $i <$market_size; $i++) {
                $deck->pickCardForLocation(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::STANDARD_DECK, 'market', $i);
            }
        }
        return $this;
    }
}
?>
