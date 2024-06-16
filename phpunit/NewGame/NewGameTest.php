<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation unit tests : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/../../vendor/autoload.php');
use PHPUnit\Framework\TestCase;

include_once(__DIR__.'/../../export/modules/NewGame/NewGame.php');

include_once(__DIR__.'/../../export/modules/Gateway/Habitat.php');
include_once(__DIR__.'/../../export/modules/Gateway/Market.php');
include_once(__DIR__.'/../../export/modules/Gateway/ScoringCard.php');
include_once(__DIR__.'/../../export/modules/Gateway/Wildlife.php');

class NewGameTest extends TestCase{
    protected array $players1 = [77 => ['player_id' => 77, 'player_name' => 'test ']];
    protected array $players2 = [77 => ['player_id' => 77, 'player_name' => 'test '], 7 => ['player_id' => 7, 'player_name' => 'test ']];

    public function setup(): void {
        $this->sut = new NewGame();

        $this->mock_market = $this->createMock(MarketGateway::class);
        $this->sut->setMarketGateway($this->mock_market);

        $this->mock_habitat_Setup = $this->createMock(HabitatSetup::class);
        $this->sut->setHabitatSetup($this->mock_habitat_Setup);

        $this->mock_scoring_card_Setup = $this->createMock(ScoringCardSetup::class);
        $this->sut->setScoringCardSetup($this->mock_scoring_card_Setup);

        $this->mock_wildlife_Setup = $this->createMock(WildlifeSetup::class);
        $this->sut->setWildlifeSetup($this->mock_wildlife_Setup);

    }

    /**
     * Reveal 4 Habitat Tiles from the face-down stacks and place them face-up in the center of the play area within easy reach of all players.
     * Draw 4 Wildlife Tokens from the Cloth Bag and pair them, in order, with each of the 4 Habitat Tiles to form 4 combinations of 1 tile and 1 token
     */
    public function test_market_is_filled() {
        // Arrange
        $this->mock_market->expects($this->exactly(1))->method('setup')->with(4);
        // Act
        $this->sut->setupMarket();
        // Assert
    }
    /**
     * Randomly select 1 Wildlife Scoring Card for each of the five wildlife,
     * then place those five cards in the center of the play area within easy view of all players.
     * Put the other Wildlife Scoring Cards back in the box.
     * (For your first game we recommend using the Wildlife Scoring Cards shown - 
     * these are the cards with ‘A’ in the bottom right corner)
     */
    public function test_scoring_card_is_created() {
        // Arrange
        $this->mock_scoring_card_Setup->expects($this->exactly(5))->method('add');
        $this->mock_scoring_card_Setup->expects($this->exactly(1))->method('flush');
        // Act
        $this->sut->setupScoringCard();
        // Assert
    }
    // Test creation of wildlife tokens
    // 100 Wildlife Tokens (20 Bear, 20 Elk, 20 Salmon, 20 Hawk, 20 Fox)
    // Place all Wildlife Tokens in the Cloth Bag and shuffle/shake them well.
    public function test_wildlife_is_created() {
        // Arrange
        $this->mock_wildlife_Setup->expects($this->exactly(100))->method('add');
        $this->mock_wildlife_Setup->expects($this->exactly(1))->method('flush');
        // Act
        $this->sut->setupWildlife();
        // Assert

    }
    public function test_no_starter_habitat_is_created_and_assigned() {
        // Arrange
        $this->sut->setPlayers([]);
        $this->mock_habitat_Setup->expects($this->exactly(0))->method('addStarterTile');
        $this->mock_habitat_Setup->expects($this->exactly(0))->method('flush');
        // Act
        $this->sut->setupStarterHabitat();
        // Assert
        
    }
    public function test_starter_habitat_is_created_and_assigned() {
        // Arrange
        $this->sut->setPlayers($this->players2);
        $this->mock_habitat_Setup->expects($this->exactly(2))->method('addStarterTile');
        $this->mock_habitat_Setup->expects($this->exactly(0))->method('flush');
        // Act
        $this->sut->setupStarterHabitat();
        // Assert
    }
    public function test_habitat_tiles_selected() {
        // Arrange
        $this->sut->setPlayers($this->players2);
        $this->mock_habitat_Setup->expects($this->exactly(43))->method('add');
        $this->mock_habitat_Setup->expects($this->exactly(0))->method('flush');
        // Act
        $this->sut->setupHabitatTileSelection();
        // Assert
    }
}
?>
