<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation unit tests : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/../../vendor/autoload.php');
use PHPUnit\Framework\TestCase;

include_once(__DIR__.'/../../export/modules/Infrastructure/Wildlife.php');

include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Deck.php');

class UpdateWildlifeTest extends TestCase{
    protected ?UpdateWildlife $sut = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck $mock_cards = null;

    protected string $player_id = "77";
    protected array $tile = ['id' => 5, 'type' => 0, 'type_arg' => 0, 'location_arg' => 0, 'unique_id' =>'tile_5', 'horizontal' => 0, 'vertical' => 0, 'rotation' => 0];
    protected array $wildlife = ['id' => 6, 'type' => 0, 'type_arg' => 0, 'location' => 1, 'location_arg' => 2];

    protected function setUp(): void {
        $this->mock_cards = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
        $this->sut = UpdateWildlife::create($this->mock_cards);
    }

    public function test_move_wildlife_then_location_equals_player_id_and_location_argument_equals_tile_id() {
        // Arrange
        $selected_tile_id = $this->tile['id'];
        $this->mock_cards->expects($this->exactly(1))->method('moveCard')->with($this->wildlife['id'], $this->player_id, $selected_tile_id);
        // Act
        $this->sut->move_to_habitat_tile($this->wildlife, $this->player_id, $selected_tile_id);
        // Assert
    }

    public function test_get_unique_id() {
        // Arrange
        $this->mock_cards->expects($this->exactly(1))->method('getCard')->with($this->wildlife['id'])->willReturn($this->wildlife);
        // Act
        $wildlife = $this->sut->get_from_habitat($this->wildlife['id']);
        // Assert
        $this->assertEquals('wildlife' . $this->wildlife['id'], $wildlife['unique_id']);
    }

    public function test_get_tile_unique_id() {
        // Arrange
        $this->mock_cards->expects($this->exactly(1))->method('getCard')->willReturn($this->wildlife);
        // Act
        $wildlife = $this->sut->get_from_habitat($this->wildlife['id']);
        // Assert
        $this->assertEquals('tile' . $this->wildlife['location_arg'], $wildlife['tile_unique_id']);
    }
}

?>
