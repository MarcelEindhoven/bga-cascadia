<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/../Domain/Habitat.php');
include_once(__DIR__.'/../Infrastructure/DataSourcesFactory.php');

class GetAllDatas {
    protected array $results = [];
    /**
     * Usage: all_data = GetAllDatas(sources from data sources factory)->get();
     */
    static public function create($decks,  $players): GetAllDatas {
        $object = new GetAllDatas();
        $object->set_data(DataSourcesFactory::create($decks)->setPlayers($players)->get_data());
        return $object;
    }

    public function set_data($results): GetAllDatas {
        $this->results = $results;
        return $this;
    }

    public function set_active_player_id($active_player_id): GetAllDatas {
        $this->active_player_id = $active_player_id;
        return $this;
    }

    public function set_current_player_id($current_player_id): GetAllDatas {
        $this->current_player_id = $current_player_id;
        return $this;
    }

    public function get(): array {
        $habitat = Habitat::create($this->results['habitats'][$this->current_player_id], $this->results['wildlife'][$this->current_player_id]);
        $this->results['adjacent_positions'] = $habitat->get_adjacent_positions();
        if (array_key_exists('chosen', $this->results) && ($this->current_player_id == $this->active_player_id))
            $this->results['candidate_tiles_for_chosen_wildlife'] = $habitat->get_candidate_tiles_for_chosen_wildlife($this->results['chosen']);

        return $this->results;
    }
}
?>
