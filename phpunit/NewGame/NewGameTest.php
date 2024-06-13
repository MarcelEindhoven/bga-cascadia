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
include_once(__DIR__.'/../../export/modules/Gateway/Wildlife.php');
include_once(__DIR__.'/../../export/modules/Gateway/Habitat.php');

class NewGameTest extends TestCase{
    protected array $players1 = [77 => ['player_id' => 77, 'player_name' => 'test ']];
    protected array $players2 = [77 => ['player_id' => 77, 'player_name' => 'test '], 7 => ['player_id' => 7, 'player_name' => 'test ']];

    public function setup(): void {
        $this->sut = new NewGame();

        $this->mock_wildlife_factory = $this->createMock(WildlifeFactory::class);
        $this->sut->setWildlifeFactory($this->mock_wildlife_factory);

        $this->mock_habitat_factory = $this->createMock(HabitatFactory::class);
        $this->sut->setHabitatFactory($this->mock_habitat_factory);

    }

    // Test creation of wildlife tokens
    // 100 Wildlife Tokens (20 Bear, 20 Elk, 20 Salmon, 20 Hawk, 20 Fox)
    // Place all Wildlife Tokens in the Cloth Bag and shuffle/shake them well.
    public function test_wildlife_is_created() {
        // Arrange
        $this->mock_wildlife_factory->expects($this->exactly(100))->method('add');
        $this->mock_wildlife_factory->expects($this->exactly(1))->method('flush');
        // Act
        $this->sut->setupWildlife();
        // Assert

    }
    public function test_no_starter_habitat_is_created_and_assigned() {
        // Arrange
        $this->sut->setPlayers([]);
        $this->mock_habitat_factory->expects($this->exactly(0))->method('addStarterTile');
        $this->mock_habitat_factory->expects($this->exactly(0))->method('flush');
        // Act
        $this->sut->setupStarterHabitat();
        // Assert
        
    }
    public function test_starter_habitat_is_created_and_assigned() {
        // Arrange
        $this->sut->setPlayers($this->players2);
        $this->mock_habitat_factory->expects($this->exactly(2))->method('addStarterTile');
        $this->mock_habitat_factory->expects($this->exactly(0))->method('flush');
        // Act
        $this->sut->setupStarterHabitat();
        // Assert
    }
    public function test_habitat_tiles_selected() {
        // Arrange
        $this->sut->setPlayers($this->players2);
        $this->mock_habitat_factory->expects($this->exactly(43))->method('add');
        $this->mock_habitat_factory->expects($this->exactly(0))->method('flush');
        // Act
        $this->sut->setupHabitatTileSelection();
        // Assert
    }
}
?>
