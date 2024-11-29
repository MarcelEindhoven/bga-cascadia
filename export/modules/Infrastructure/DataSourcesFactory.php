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

    public function get_data(): array {
        $data['scoring_card'] = CurrentScoringCards::create($this->decks['scoring_card'])->get();

        $data['wildlife'] = CurrentWildlifeTerritory::create($this->decks['wildlife'])->setPlayers($this->players)->get();
        $data['habitats'] = CurrentHabitatTerritory::create($this->decks['tile'])->setPlayers($this->players)->get();

        $data['market'] = CurrentMarket::create($this->decks)->get();

        foreach ($this->decks['wildlife']->getCardsInLocation('chosen') as $chosen_wildlife)
            $data['chosen'] = CurrentWildlife::unpackType($chosen_wildlife);

        return $data;
    }
}
?>
