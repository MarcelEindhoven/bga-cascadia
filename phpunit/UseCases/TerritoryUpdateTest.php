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

class TerritoryUpdateTest extends TestCase{
    protected ?TerritoryUpdate $sut = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck $mock_cards = null;

    protected string $player_id = "77";
    protected array $tile = ['id' => 5, 'unique_id' =>'habitat_5', 'horizontal' => 0, 'vertical' => 0, 'rotation' => 0];

    protected function setUp(): void {
        $this->sut = TerritoryUpdate::create($this->player_id);
        $this->mock_cards = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
    }

    public function test_move_tile_then_location_equals_player_id() {
        // Arrange
        $this->expect_location_argument(0);
        // Act
        $this->act_default();
        // Assert
    }

    public function test_move_tile_then_location_argument_includes_horizontal() {
        // Arrange
        $this->tile['horizontal'] = 2;
        $this->expect_location_argument($this->tile['horizontal']);
        // Act
        $this->act_default();
        // Assert
    }

    public function test_move_tile_then_location_argument_includes_vertical() {
        // Arrange
        $this->tile['vertical'] = 3;
        $this->expect_location_argument($this->tile['vertical'] * 100);
        // Act
        $this->act_default();
        // Assert
    }

    public function test_move_tile_then_location_argument_includes_rotation() {
        // Arrange
        $this->tile['rotation'] = 4;
        $this->expect_location_argument($this->tile['rotation'] * 10000);
        // Act
        $this->act_default();
        // Assert
    }

    protected function expect_location_argument($value) {
        $this->mock_cards->expects($this->exactly(1))->method('moveCard')->with($this->tile['id'], $this->player_id, $value);
    }

    protected function act_default() {
        $this->sut->move($this->mock_cards, $this->tile);
    }
}

?>
