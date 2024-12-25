<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

 include_once(__DIR__.'/../BGA/Action.php');

class PlayerChoosesWildlife extends \NieuwenhovenGames\BGA\Action {
    static public function create($gamestate): PlayerChoosesWildlife {
        $object = new PlayerChoosesWildlife($gamestate);
        return $object;
    }

    /**
     * 
     */
    public function set_market($market) : PlayerChoosesWildlife {
        $this->market = $market;
        return $this;
    }

    public function set_latest_data($latest_data) : PlayerChoosesWildlife {
        $this->latest_data = $latest_data;
        return $this;
    }

    public function set_player_id($player_id) : PlayerChoosesWildlife {
        $this->player_id = $player_id;
        return $this;
    }

    /**
     * 
     */
    public function set_chosen_wildlife($wildlife_id) : PlayerChoosesWildlife {
        $this->wildlife_id = $wildlife_id;
        return $this;
    }

    public function execute(): PlayerChoosesWildlife {
        $this->market->select_wildlife($this->wildlife_id);
        // Notify players
        $wildlife = $this->market->get_wildlife_from_id($this->wildlife_id);
        $this->notifications->notifyAllPlayers('wildlife_chosen', 'wildlife_chosen', ['wildlife' => $wildlife]);

        $candidate_tiles_for_chosen_wildlife = $this->latest_data->get()['candidate_tiles_for_chosen_wildlife'];
        $this->notifications->notifyPlayer($this->player_id, 'candidate_tiles_for_chosen_wildlife', 'candidate_tiles_for_chosen_wildlife', ['candidate_tiles_for_chosen_wildlife' => $candidate_tiles_for_chosen_wildlife]);

        return $this;
    }
}
?>
