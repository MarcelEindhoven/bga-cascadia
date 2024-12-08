<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/../BGA/Action.php');

include_once(__DIR__.'/../BGA/FrameworkInterfaces/Deck.php');

class PlayerDoesNotPlaceWildlife extends \NieuwenhovenGames\BGA\Action {
    static public function create($gamestate): PlayerDoesNotPlaceWildlife {
        $object = new PlayerDoesNotPlaceWildlife($gamestate);
        return $object;
    }

    /**
     * deck supports moveCard
     */
    public function set_wildlife_deck($deck) : PlayerDoesNotPlaceWildlife {
        $this->wildlife_deck = $deck;
        return $this;
    }

    public function execute(): PlayerDoesNotPlaceWildlife {
        $this->wildlife_deck->moveAllCardsInLocation('chosen', \NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::STANDARD_DECK);

        $this->notifications->notifyAllPlayers('wildlife_not_placed', 'wildlife_not_placed', []);

        return $this;
    }
}
?>
