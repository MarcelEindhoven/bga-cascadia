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
    protected array $decks = [];
    /**
     * 
     */
    static public function create($decks,  $database): GetAllDatas {
        $object = new GetAllDatas();
        $object->set_decks($decks)->set_database($database);
        return $object;
    }

    public function set_database($database) : GetAllDatas {
        $this->database = $database;
        return $this;
    }

    public function set_decks($decks): GetAllDatas {
        $this->decks = $decks;
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

    /**
     * Combine results from database with calculated results from domain
     */
    public function get(): array {
        $results = $this->get_results_from_database();

        $habitat = Habitat::create($results['habitats'][$this->current_player_id], $results['wildlife'][$this->current_player_id]);

        $results['adjacent_positions'] = $habitat->get_adjacent_positions();

        if (array_key_exists('chosen', $results) && ($this->current_player_id == $this->active_player_id))
            $results['candidate_tiles_for_chosen_wildlife'] = $habitat->get_candidate_tiles_for_chosen_wildlife($results['chosen']);

        return $results;
    }

    protected function get_results_from_database(): array {
        return DataSourcesFactory::create($this->decks)->set_database($this->database)->get_data();
    }
}
?>
