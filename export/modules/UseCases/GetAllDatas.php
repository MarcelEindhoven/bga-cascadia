<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

class GetAllDatas {
    protected array $sources = [];
    static public function create($sources): GetAllDatas {
        $object = new GetAllDatas();
        $object->setSources($sources);
        return $object;
    }

    public function setSources($sources): GetAllDatas {
        $this->sources = $sources;
        return $this;
    }

    public function get(): array {
        $results = [];
        foreach ($this->sources as $name => $source) {
            $results[$name] = $source->get();
        }
        return $results;
    }
}
/**
 * Usage:
 * $object = new DataSourcesFactory();
 * setDecks
 * setPlayers
 * getSources
 */
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

        $sources['wildlife'] = CurrentWildlife::create($this->decks['wildlife']);
        $sources['wildlife']->setPlayers($this->players);
        $sources['habitat'] = CurrentHabitat::create($this->decks['habitat']);
        $sources['habitat']->setPlayers($this->players);

        $sources['market'] = CurrentMarket::create($this->decks);

        return $sources;
    }
}
?>
