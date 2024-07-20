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
    static public function create($decks): DataSourcesFactory {
        $object = new DataSourcesFactory();
        $object->setDecks($decks);
        return $object;
    }

    public function setDecks($decks): DataSourcesFactory {
        $this->decks = $decks;
        return $this;
    }

    public function setPlayers($players): DataSourcesFactory {
        $this->players = $players;
        return $this;
    }

    public function getSources(): array {
        $sources['scoring_card'] = CurrentScoringCards::create($this->decks['scoring_card']);

        $sources['wildlife'] = CurrentWildlifeTerritory::create($this->decks['wildlife']);
        $sources['wildlife']->setPlayers($this->players);
        $sources['habitat'] = CurrentHabitatTerritory::create($this->decks['habitat']);
        $sources['habitat']->setPlayers($this->players);

        $sources['market'] = CurrentMarket::create($this->decks);

        return $sources;
    }
}
?>
