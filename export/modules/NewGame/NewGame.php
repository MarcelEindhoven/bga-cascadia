<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/../Infrastructure/Habitat.php');
include_once(__DIR__.'/../Infrastructure/Market.php');
include_once(__DIR__.'/../Infrastructure/ScoringCard.php');
include_once(__DIR__.'/../Infrastructure/Wildlife.php');
 
 class NewGame {
    const STARTER_HABITAT_TILES = [
        [[[1], [3]], [[3, 4], [1, 2, 3]], [[2, 5], [4, 5]]],
        [[[2], [4]], [[3, 1], [2, 3, 4]], [[5, 4], [1, 5]]],
        [[[3], [2]], [[1, 5], [1, 2, 4]], [[4, 2], [3, 5]]],
        [[[4], [5]], [[1, 2], [3, 4, 5]], [[5, 3], [1, 2]]],
        [[[5], [1]], [[2, 3], [2, 4, 5]], [[4, 1], [1, 3]]]
    ];
    const HABITAT_TILES = [
        [[1], [1]],
        [[1], [1]],
        [[1], [3]],
        [[1], [4]],
        [[1], [4]],
        [[2], [3]],
        [[2], [3]],
        [[2], [4]],
        [[2], [5]],
        [[2], [5]],
        [[3], [1]],
        [[3], [1]],
        [[3], [2]],
        [[3], [5]],
        [[3], [5]],
        [[4], [2]],
        [[4], [2]],
        [[4], [3]],
        [[4], [3]],
        [[4], [5]],
        [[5], [1]],
        [[5], [2]],
        [[5], [2]],
        [[5], [4]],
        [[5], [4]],
        [[1, 2], [1, 3]],
        [[1, 2], [1, 4]],
        [[1, 2], [3, 4]],
        [[1, 2], [3, 5]],
        [[1, 2], [4, 5]],
        [[1, 3], [1, 2]],
        [[1, 3], [1, 3]],
        [[1, 3], [1, 5]],
        [[1, 3], [2, 4]],
        [[1, 3], [3, 5]],
        [[1, 4], [1, 5]],
        [[1, 4], [2, 3]],
        [[1, 4], [2, 4]],
        [[1, 4], [4, 5]],
        [[1, 5], [1, 2]],
        [[1, 5], [1, 3]],
        [[1, 5], [1, 4]],
        [[1, 5], [2, 4]],
        [[1, 5], [3, 4]],
        [[2, 3], [1, 3]],
        [[2, 3], [1, 5]],
        [[2, 3], [2, 3]],
        [[2, 3], [2, 4]],
        [[2, 3], [4, 5]],
        [[2, 4], [2, 3]],
        [[2, 4], [2, 5]],
        [[2, 4], [3, 4]],
        [[2, 4], [4, 5]],
        [[2, 5], [1, 3]],
        [[2, 5], [2, 4]],
        [[2, 5], [2, 5]],
        [[2, 5], [3, 4]],
        [[3, 4], [1, 2]],
        [[3, 4], [1, 5]],
        [[3, 4], [2, 3]],
        [[3, 4], [2, 5]],
        [[3, 4], [3, 5]],
        [[3, 5], [1, 4]],
        [[3, 5], [1, 5]],
        [[3, 5], [2, 4]],
        [[3, 5], [2, 5]],
        [[4, 5], [1, 3]],
        [[4, 5], [2, 3]],
        [[4, 5], [2, 4]],
        [[4, 5], [4, 5]],
        [[1, 2], [1, 3, 4]],
        [[1, 3], [2, 4, 5]],
        [[1, 4], [1, 3, 5]],
        [[1, 4], [1, 4, 5]],
        [[1, 5], [1, 3, 4]],
        [[2, 3], [2, 3, 4]],
        [[2, 4], [2, 3, 5]],
        [[2, 4], [3, 4, 5]],
        [[3, 4], [2, 3, 5]],
        [[3, 5], [1, 2, 4]],
        [[3, 5], [1, 2, 5]],
        [[4, 5], [1, 2, 5]],
        [[4, 5], [1, 3, 5]],
    ];
    static public function create($decks): NewGame {
        $object = new NewGame();
        $habitat_setup = HabitatSetup::create($decks['tile']);
        $object->setHabitatSetup($habitat_setup);

        $scoring_card_setup = ScoringCardSetup::create($decks['scoring_card']);
        $object->setScoringCardSetup($scoring_card_setup);

        $wildlife_setup = WildlifeSetup::create($decks['wildlife']);
        $object->setWildlifeSetup($wildlife_setup);

        unset($decks['scoring_card']);
        $market = MarketInfrastructure::create($decks);
        $object->setMarketInfrastructure($market);

        return $object;
    }

    public function setPlayers($players): NewGame {
        $this->players = $players;
        return $this;
    }

    public function setHabitatSetup($habitat_setup): NewGame {
        $this->habitat_setup = $habitat_setup;
        return $this;
    }

    public function setScoringCardSetup($scoring_card_setup): NewGame {
        $this->scoring_card_setup = $scoring_card_setup;
        return $this;
    }

    public function setWildlifeSetup($wildlife_setup): NewGame {
        $this->wildlife_setup = $wildlife_setup;
        return $this;
    }

    public function setMarketInfrastructure($market): NewGame {
        $this->market = $market;
        return $this;
    }

    public function setup(): NewGame {
        $this->setupWildlife();
        $this->setupScoringCard();
        $this->setupHabitat();
        $this->setupMarket();

        return $this;
    }

    public function setupMarket() {
        $this->market->setup(4);
    }

    public function setupHabitat() {
        $this->setupStarterHabitat();
        $this->setupHabitatTileSelection();
        $this->habitat_setup->flush();
    }

    public function setupStarterHabitat() {
        // Randomly distribute one Starter Habitat Tile to each player, placing it face-up in front of them. Place the others back into the box, they will not be used this game.
        $tiles = NewGame::STARTER_HABITAT_TILES;
        shuffle($tiles);
        foreach ($this->players as $player_id => $player) {
            $tile = array_pop($tiles);
            $this->habitat_setup->addStarterTile($player_id, $tile);
        }
    }

    public function setupHabitatTileSelection() {
        // Randomly select 20 per player, plus 3 tiles. Shuffle these tiles and stack them face down (any number of stacks) within easy reach of all players.
        // Place any excluded Habitat Tiles back into the box, they will not be used this game
        $tiles = NewGame::HABITAT_TILES;
        shuffle($tiles);
        $number_selected = 3 + count($this->players)*20;
        for ($i = 0; $i <$number_selected; $i++) {
            $tile = array_pop($tiles);
            $this->habitat_setup->add($tile);
        }
    }

    public function setupScoringCard() {
        for ($type = 1; $type <= 5; $type ++) {
            $this->scoring_card_setup->add($type, rand(0, 3));
        }
        $this->scoring_card_setup->flush();
    }

    public function setupWildlife() {
        for ($type = 1; $type <= 5; $type ++) {
            for ($number = 0; $number <20; $number ++) {
                $this->wildlife_setup->add($type);
            }
        }
        $this->wildlife_setup->flush();
    }
}
?>
