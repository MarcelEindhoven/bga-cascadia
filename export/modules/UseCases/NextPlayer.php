<?php
namespace NieuwenhovenGames\Cascadia;
/**
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 * This code has been produced on the BGA studio platform for use on https://boardgamearena.com.
 * See http://en.doc.boardgamearena.com/Studio for more information.
 */

include_once(__DIR__.'/../BGA/Action.php');

class NextPlayer extends \NieuwenhovenGames\BGA\Action {
    protected array $ais = [];

    public static function create($gamestate) : NextPlayer {
        return new NextPlayer($gamestate);
    }

    /**
     * 
     */
    public function set_market($market) : NextPlayer {
        $this->market = $market;
        return $this;
    }

    public function set_tile_deck($deck) : NextPlayer {
        $this->deck = $deck;
        return $this;
    }

    public function execute() : NextPlayer {
        $this->notifications->notifyAllPlayers('execute', 'execute', []);
        $this->replenishMarket();
        return $this;
    }

    protected function replenishMarket() : NextPlayer {
        foreach ($this->market->get() as $category => $market_row)
            $this->replenish($category, $market_row);

        return $this;
    }
    protected function replenish($category, $market_row) {
        $missing_locations = array_diff([0, 1, 2, 3], $this->getLocationsFromMarketRow($market_row));
        foreach ($missing_locations as $missing_location) {
            $this->market->refill($category, $missing_location);
            $this->notifications->notifyAllPlayers('market_refill_' . $category, 'refill', $this->market->get_specific_item($category, $missing_location));
        }
    }
    protected function getLocationsFromMarketRow($market_row) {
        $locations = [];
        foreach ($market_row as $card) {
            $locations[] = $card['location_arg'];
        }
        return $locations;
    }

    public function getTransitionName() : string {
        if (0 == $this->deck->countCardInLocation(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::STANDARD_DECK))
            return 'finished_playing';
        return 'player_playing';
    }
}
?>
