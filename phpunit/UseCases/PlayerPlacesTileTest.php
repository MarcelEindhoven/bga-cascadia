<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation unit tests : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/../../vendor/autoload.php');
use PHPUnit\Framework\TestCase;

include_once(__DIR__.'/../../export/modules/UseCases/PlayerPlacesTile.php');

include_once(__DIR__.'/../../export/modules/Infrastructure/Habitat.php');

include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Deck.php');

class PlayerPlacesTileTest extends TestCase{
    protected string $player_id = "77";
    protected array $tile = ['id' => 5, 'unique_id' =>'habitat_5', 'horizontal' => 0, 'vertical' => 0, 'rotation' => 0];

    protected function setUp(): void {
        $this->sut = CurrentTerritory::create($this->player_id);
        $this->mock_cards = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
    }

    public function test_move_tile_then_location_equals_player_id() {
        // Arrange
        $this->mock_cards->expects($this->exactly(1))->method('moveCard')->with($this->tile['id'], $this->player_id, 0);
        // Act
        $this->act_default();
        // Assert
    }

    public function test_move_tile_then_location_argument_includes_horizontal() {
        // Arrange
        $this->tile['horizontal'] = 2;
        $this->mock_cards->expects($this->exactly(1))->method('moveCard')->with($this->tile['id'], $this->player_id, $this->tile['horizontal']);
        // Act
        $this->act_default();
        // Assert
    }

    public function test_move_tile_then_location_argument_includes_vertical() {
        // Arrange
        $this->tile['vertical'] = 3;
        $this->mock_cards->expects($this->exactly(1))->method('moveCard')->with($this->tile['id'], $this->player_id, $this->tile['vertical'] * 100);
        // Act
        $this->act_default();
        // Assert
    }

    public function test_move_tile_then_location_argument_includes_rotation() {
        // Arrange
        $this->tile['rotation'] = 4;
        $this->mock_cards->expects($this->exactly(1))->method('moveCard')->with($this->tile['id'], $this->player_id, $this->tile['rotation'] * 1000);
        // Act
        $this->act_default();
        // Assert
    }

    protected function act_default() {
        $this->sut->move($this->mock_cards, $this->tile);
    }
}

?>
