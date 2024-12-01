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

    public function execute() : NextPlayer {
        $this->replenishMarket();
        return $this;
    }

    protected function replenishMarket() : NextPlayer {
        foreach ($this->market->get() as $category => $market_row)
        $this->replenish($category, $this->getLocationsFromMarketRow($market_row));

        return $this;
    }
    protected function getLocationsFromMarketRow($market_row) {
        $locations = [];
        foreach ($market_row as $card) {
            $locations[] = $card['location_arg'];
        }
        return $locations;
    }
    protected function replenish($category, $market_locations) {
        $missing_locations = array_diff([0, 1, 2, 3], $market_locations);
        foreach ($missing_locations as $missing_location) {
            $this->market->refill($category, $missing_location);
        }
    }

    protected function getEvent($category) {
        if ($category == Constants::ITEM_NAME) {
            return NextPlayer::EVENT_NEW_ITEM;
        } else {
            return PlayerPlacesInitialPlant::EVENT_NEW_STOCK_CONTENT;
        }
    }

    public function getTransitionName() : string {
        return 'player_playing';
    }
}
?>

