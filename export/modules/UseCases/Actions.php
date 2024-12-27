<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/AITurn.php');
include_once(__DIR__.'/NextPlayer.php');
include_once(__DIR__.'/PlayerPlacesTile.php');
include_once(__DIR__.'/PlayerDoesNotPlaceWildlife.php');
include_once(__DIR__.'/PlayerPlacesWildlife.php');
include_once(__DIR__.'/PlayerChoosesWildlife.php');

include_once(__DIR__.'/GetAllDatas.php');

include_once(__DIR__.'/../Infrastructure/Habitat.php');
include_once(__DIR__.'/../Infrastructure/Market.php');
include_once(__DIR__.'/../Infrastructure/Wildlife.php');

class Actions {
    protected array $decks = [];

    static public function create(): Actions {
        $object = new Actions();
        return $object;
    }

    public function set_gamestate($gamestate) : Actions {
        $this->gamestate = $gamestate;
        return $this;
    }

    public function set_decks($decks) : Actions {
        $this->decks = $decks;
        return $this;
    }

    public function set_players($players) : Actions {
        $this->players = $players;
        return $this;
    }

    public function set_notifications($notifications) : Actions {
        $this->notifications = $notifications;
        return $this;
    }

    public function set_database($database) : Actions {
        $this->database = $database;
        return $this;
    }

    /**
     * Current player ID is not known during game setup
     */
    public function set_player_id($player_id) : Actions {
        $this->player_id = $player_id;
        return $this;
    }

    public function do_not_place_wildlife() {
        PlayerDoesNotPlaceWildlife::create($this->gamestate)->set_notifications($this->notifications)->set_wildlife_deck($this->decks['wildlife'])->execute()->nextState();
    }

    public function place_wildlife($selected_tile_id) {
        PlayerPlacesWildlife::create($this->gamestate)->set_notifications($this->notifications)->set_player_id($this->player_id)->set_wildlife_handler(UpdateWildlife::create($this->decks['wildlife']))->set_chosen_tile($selected_tile_id)->execute()->nextState();
    }

    public function choose_wildlife_and_place_tile($chosen_wildlife_id, $tile) {
        $territory = TerritoryUpdate::create($this->player_id);
        PlayerPlacesTile::create($this->gamestate)->set_notifications($this->notifications)->set_territory($territory)->set_tile_deck($this->decks['tile'])->set_moved_tile($tile)->execute();

        // PlayerChoosesWildlife after PlayerPlacesTile because of calculation candidate tiles for chosen wildlife
        $market = MarketUpdate::create($this->decks);
        $latest_data = GetAllDatas::create($this->decks, $this->database)->set_current_player_id($this->player_id)->set_active_player_id($this->player_id);
        PlayerChoosesWildlife::create($this->gamestate)->set_notifications($this->notifications)->set_player_id($this->player_id)->set_market($market)->set_latest_data($latest_data)->set_chosen_wildlife($chosen_wildlife_id)->execute()->nextState();
    }

    public function stNextPlayer($player_id) {
        $this->notifications->notifyAllPlayers('debug', 'decks', ['info' =>$this->decks]);
        $market = MarketUpdate::create($this->decks);
        NextPlayer::create($this->gamestate)->set_notifications($this->notifications)->set_market($market)->execute()->nextState();
    }

    public function stAiPlayer() {
        AITurn::create($this->gamestate)->set_notifications($this->notifications)->set_tile_deck($this->decks['tile'])->execute()->nextState();
    }

    public function stAllPlayersInspectScore() {
    }
}
?>
