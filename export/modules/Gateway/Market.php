<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */
include_once(__DIR__.'/../BGA/FrameworkInterfaces/Deck.php');

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

    public function setup(): MarketGateway {
        return $this;
    }
}

?>
