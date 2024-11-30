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
    protected array $tile = ['id' => 5, 'type' => 0, 'type_arg' => 0, 'location_arg' => 0, 'unique_id' =>'habitat_5', 'horizontal' => 0, 'vertical' => 0, 'rotation' => 0];
    protected array $wildlife = ['id' => 5, 'type' => 0, 'type_arg' => 0, 'location_arg' => 0, 'unique_id' =>'habitat_5', 'horizontal' => 0, 'vertical' => 0];

    protected function setUp(): void {
        $this->sut = TerritoryUpdate::create($this->player_id);
        $this->mock_cards = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
    }

    public function test_move_tile_then_location_equals_player_id() {
        // Arrange
        $this->expect_location_argument(0);
        // Act
        $this->act_default($this->tile);
        // Assert
    }

    public function test_move_tile_then_location_argument_includes_horizontal() {
        // Arrange
        $this->tile['horizontal'] = 2;
        $this->expect_location_argument($this->tile['horizontal']);
        // Act
        $this->act_default($this->tile);
        // Assert
    }

    public function test_move_tile_then_location_argument_includes_vertical() {
        // Arrange
        $this->tile['vertical'] = 3;
        $this->expect_location_argument($this->tile['vertical'] * 100);
        // Act
        $this->act_default($this->tile);
        // Assert
    }

    public function test_move_tile_then_location_argument_includes_rotation() {
        // Arrange
        $this->tile['rotation'] = 4;
        $this->expect_location_argument($this->tile['rotation'] * 10000);
        // Act
        $this->act_default($this->tile);
        // Assert
    }

    public function test_move_wildlife_then_location_equals_player_id() {
        // Arrange
        $this->expect_location_argument(0);
        // Act
        $this->act_default($this->wildlife);
        // Assert
    }

    public function test_move_wildlife_then_location_argument_includes_horizontal() {
        // Arrange
        $this->wildlife['horizontal'] = 2;
        $this->expect_location_argument($this->wildlife['horizontal']);
        // Act
        $this->act_default($this->wildlife);
        // Assert
    }

    public function test_move_wildlife_then_location_argument_includes_vertical() {
        // Arrange
        $this->wildlife['vertical'] = 3;
        $this->expect_location_argument($this->wildlife['vertical'] * 100);
        // Act
        $this->act_default($this->wildlife);
        // Assert
    }

    protected function expect_location_argument($value) {
        $this->mock_cards->expects($this->exactly(1))->method('moveCard')->with($this->tile['id'], $this->player_id, $value);
    }

    protected function act_default($element) {
        $this->sut->move($this->mock_cards, $element);
    }

    public function test_get_tile_retrieves_id_from_deck() {
        // Arrange
        $tile_card = $this->tile;
        // Act
        $actual_tile = $this->act_get_tile($tile_card);
        // Assert
        $this->assertEquals($actual_tile['id'], $tile_card['id']);
    }

    public function test_get_tile_uses_type() {
        // Arrange
        $tile_card = $this->tile;
        $tile_card['type'] = 8;
        // Act
        $actual_tile = $this->act_get_tile($tile_card);
        // Assert
        $this->assertEqualsCanonicalizing($actual_tile['terrain_types'], [1, 2]);
    }

    public function test_get_tile_uses_type_arg() {
        // Arrange
        $tile_card = $this->tile;
        $tile_card['type_arg'] = 8;
        // Act
        $actual_tile = $this->act_get_tile($tile_card);
        // Assert
        $this->assertEqualsCanonicalizing($actual_tile['supported_wildlife'], [1, 2]);
    }

    public function test_get_tile_uses_location_arg() {
        // Arrange
        $tile_card = $this->tile;
        $tile_card['location_arg'] = 1 + 2*100 + 3*10000;
        // Act
        $actual_tile = $this->act_get_tile($tile_card);
        // Assert
        $this->assertEqualsCanonicalizing($actual_tile['horizontal'], 1);
        $this->assertEqualsCanonicalizing($actual_tile['vertical'], 2);
        $this->assertEqualsCanonicalizing($actual_tile['rotation'], 3);
    }

    protected function act_get_tile($tile_card) {
        $this->mock_cards->expects($this->exactly(1))->method('getCard')->willReturn($tile_card);
        // Act
        return $this->sut->get_tile($this->mock_cards, $this->tile);
    }

    public function test_get_wildlife_retrieves_id_from_deck() {
        // Arrange
        $wildlife_card = $this->wildlife;
        // Act
        $actual_wildlife = $this->act_get_wildlife($wildlife_card);
        // Assert
        $this->assertEquals($actual_wildlife['id'], $wildlife_card['id']);
    }

    public function test_get_wildlife_ignores_type() {
        // Arrange
        $wildlife_card = $this->wildlife;
        $wildlife_card['type'] = 8;
        // Act
        $actual_wildlife = $this->act_get_wildlife($wildlife_card);
        // Assert
        $this->assertFalse(array_key_exists('terrain_types', $actual_wildlife));
    }

    public function test_get_wildlife_ignores_type_arg() {
        // Arrange
        $wildlife_card = $this->wildlife;
        $wildlife_card['type_arg'] = 8;
        // Act
        $actual_wildlife = $this->act_get_wildlife($wildlife_card);
        // Assert
        $this->assertFalse(array_key_exists('supported_wildlife', $actual_wildlife));
    }

    public function test_get_wildlife_uses_location_arg() {
        // Arrange
        $wildlife_card = $this->wildlife;
        $wildlife_card['location_arg'] = 1 + 2*100 + 0*10000;
        // Act
        $actual_wildlife = $this->act_get_wildlife($wildlife_card);
        // Assert
        $this->assertEqualsCanonicalizing($actual_wildlife['horizontal'], 1);
        $this->assertEqualsCanonicalizing($actual_wildlife['vertical'], 2);
        $this->assertEqualsCanonicalizing($actual_wildlife['rotation'], 0);
    }

    protected function act_get_wildlife($wildlife_card) {
        $this->mock_cards->expects($this->exactly(1))->method('getCard')->willReturn($wildlife_card);
        // Act
        return $this->sut->get_wildlife($this->mock_cards, $this->wildlife);
    }
}

?>
