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

class NewGameTest extends TestCase{
    // Test creation of wildlife tokens
    // 100 Wildlife Tokens (20 Bear, 20 Elk, 20 Salmon, 20 Hawk, 20 Fox)
    // Place all Wildlife Tokens in the Cloth Bag and shuffle/shake them well.
    public function test_wildlife_is_created() {
        // Arrange
        $this->mock_wildlife_factory = $this->createMock(WildlifeFactory::class);
        $this->sut = new NewGame();
        $this->sut->setWildlifeFactory($this->mock_wildlife_factory);
        $this->mock_wildlife_factory->expects($this->exactly(100))->method('create');
        // Act
        $this->sut->setup();
        // Assert

    }
}
?>
