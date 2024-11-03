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

    public function setActivePlayerId($active_player_id): GetAllDatas {
        $this->active_player_id = $active_player_id;
        return $this;
    }

    public function get(): array {
        $this->results['adjacent_positions'] = Habitat::create($this->results['habitats'][$this->active_player_id])->get_adjacent_positions();

        return $this->results;
    }
}
?>
