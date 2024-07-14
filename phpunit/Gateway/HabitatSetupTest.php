<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation unit tests : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/../../vendor/autoload.php');
use PHPUnit\Framework\TestCase;

include_once(__DIR__.'/../../export/modules/Infrastructure/Habitat.php');

include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Deck.php');

class HabitatSetupTest extends TestCase{
    protected function setUp(): void {
        $this->mock_cards = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
        $this->sut = new HabitatSetup();
        $this->sut->setDeck($this->mock_cards);
    }

    /**
     * @dataProvider habitatProvider
     */
    public function test_habitat_wildlife_is_created($tile, $expected_definition) {
        // Arrange
        $this->mock_cards->expects($this->exactly(1))->method('createCards')->with([$expected_definition]);

        $this->mock_cards->expects($this->exactly(1))->method('shuffle')->with(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::STANDARD_DECK);    
        // Act
        $this->sut->add($tile);
        $this->sut->flush();
        // Assert
    }

    public function habitatProvider(): array {
        return [
            [[[1], [1]], array( 'type' => 1, 'type_arg' => 1 , 'nbr' => 1)],
            [[[4, 5], [2, 4]], array( 'type' => 4 + 5 * 6, 'type_arg' => 2 + 4 * 6 , 'nbr' => 1)],
            [[[1, 2], [1, 3, 4]], array( 'type' => 1 + 2 * 6, 'type_arg' => 1 + 3 * 6 + 4 * 6 * 6, 'nbr' => 1)],
        ];
    }

    public function test_starter_tile() {
        // Arrange
        $tile = [[[5], [1]], [[2, 3], [2, 4, 5]], [[4, 1], [1, 3]]];
        $player = 77;
        $expected_definition0 = array( 'type' => 5, 'type_arg' => 1, 'location' => $player, 'location_arg' => 50 + 50 * 100, 'rotation' => 0, 'nbr' => 1);
        $expected_definition1 = array( 'type' => 2 + 3 * 6, 'type_arg' => 2 + 4 * 6 + 5 * 6 * 6, 'location' => $player, 'location_arg' => 49 + 51 * 100, 'rotation' => 5, 'nbr' => 1);
        $expected_definition2 = array( 'type' => 4 + 1 * 6, 'type_arg' => 1 + 3 * 6, 'location' => $player, 'location_arg' => 51 + 51 * 100, 'rotation' => 1, 'nbr' => 1);

        $this->mock_cards->expects($this->exactly(3))->method('createCards');

        // Act
        $this->sut->addStarterTile($player, $tile);
        // Assert
    }
}
?>
