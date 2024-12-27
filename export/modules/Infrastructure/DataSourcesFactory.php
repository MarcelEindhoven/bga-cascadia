<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/Habitat.php');
include_once(__DIR__.'/Market.php');
include_once(__DIR__.'/ScoringCard.php');
include_once(__DIR__.'/Wildlife.php');
 
class DataSourcesFactory {
    protected array $decks = [];

    static public function create($decks): DataSourcesFactory {
        $object = new DataSourcesFactory();
        $object->set_decks($decks);
        return $object;
    }

    public function set_database($database) : DataSourcesFactory {
        $this->database = $database;
        return $this;
    }

    public function set_decks($decks): DataSourcesFactory {
        $this->decks = $decks;
        return $this;
    }

    public function get_data(): array {
        $sql = "SELECT player_id id, player_name name, player_score score, player_coins coins FROM player ";
        $players = $this->database->getCollectionFromDb( $sql );
        $data['players'] = $players;

        $data['scoring_card'] = CurrentScoringCards::create($this->decks['scoring_card'])->get();

        $data['wildlife'] = CurrentWildlifeTerritory::create($this->decks['wildlife'])->setPlayers($players)->get();
        $data['habitats'] = CurrentHabitatTerritory::create($this->decks['tile'])->setPlayers($players)->get();

        $data['market'] = CurrentMarket::create($this->decks)->get();

        foreach ($this->decks['wildlife']->getCardsInLocation('chosen') as $chosen_wildlife)
            $data['chosen'] = CurrentWildlife::unpackType($chosen_wildlife);

        return $data;
    }
}
?>
