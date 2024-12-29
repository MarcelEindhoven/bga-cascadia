<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation unit tests : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/../../vendor/autoload.php');
use PHPUnit\Framework\TestCase;

include_once(__DIR__.'/../../export/modules/UseCases/AIChoosesTileAndPositionAndWildlife.php');

include_once(__DIR__.'/../../export/modules/UseCases/GetAllDatas.php');

include_once(__DIR__.'/../../export/modules/Infrastructure/Market.php');

include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Deck.php');
include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Notifications.php');

class TestAIChoosesTileAndPositionAndWildlife extends AIChoosesTileAndPositionAndWildlife {
    protected function choose_market_index() {
        $this->market_index = $this->test_market_index;
    }
    protected function choose_adjacent_positions_index() {
        $this->adjacent_positions_index = $this->test_adjacent_positions_index;
    }
}
class AIChoosesTileAndPositionAndWildlifeTest extends TestCase{
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\GameState $mock_gamestate = null;
    protected ?AIChoosesTileAndPositionAndWildlife $sut = null;
    protected ?GetAllDatas $mock_get_current_data = null;
    protected array $wildlife_specification = ['id'=>5];
    protected array $default_wildlife = ['id' => 5, 'unique_id' => 'test'];
    protected array $other_wildlife = ['id' => 6, 'unique_id' => 'other'];
    protected array $default_tile = ['id' => 5, 'unique_id' => 'test'];
    protected array $other_tile = ['id' => 6, 'unique_id' => 'other'];
    protected array $market = [];
    protected array $adjacent_positions = [0 => ['horizontal' => 52, 'vertical' => 50]
                                        , 1 => ['horizontal' => 53, 'vertical' => 51]];
    protected int $player_id = 77;
    protected array $all_data = [];

    protected function setUp(): void {
        $this->mock_gamestate = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\GameState::class);
        $this->sut = new TestAIChoosesTileAndPositionAndWildlife($this->mock_gamestate);

        $this->mock_get_current_data = $this->createMock(GetAllDatas::class);
        $this->sut->set_get_current_data($this->mock_get_current_data);

        $this->market = ['wildlife' => [0 => $this->default_wildlife, 1 => $this->other_wildlife]
                        , 'tile' => [0 => $this->default_tile, 1 => $this->other_tile]];
        $this->all_data = ['market' => $this->market, 'adjacent_positions' => $this->adjacent_positions];

        $this->sut->test_market_index = 1;
        $this->sut->test_adjacent_positions_index = 1;
    }

    public function test_get_chosen_wildlife_id_default() {
        // Arrange
        $this->sut->test_market_index = 0;
        $this->mock_get_current_data->expects($this->exactly(1))->method('get')->willReturn(['market' => $this->market]);
        // Act
        $this->act_default();
        // Assert
        $this->assertEquals($this->default_wildlife['id'], $this->sut->get_chosen_wildlife_id());
    }

    public function test_get_chosen_wildlife_id_other() {
        // Arrange
        $this->sut->test_market_index = 1;
        $this->mock_get_current_data->expects($this->exactly(1))->method('get')->willReturn(['market' => $this->market]);
        // Act
        $this->act_default();
        // Assert
        $this->assertEquals($this->other_wildlife['id'], $this->sut->get_chosen_wildlife_id());
    }

    protected function act_default() {
        $this->sut->execute();
    }

    public function test_get_placed_tile_default() {
        // Arrange
        $this->sut->test_market_index = 0;
        $this->mock_get_current_data->expects($this->exactly(1))->method('get')->willReturn($this->all_data);
        // Act
        $this->act_default();
        // Assert
        $this->assertEquals($this->default_tile['id'], $this->sut->get_placed_tile()['id']);
    }

    public function test_get_placed_tile_position() {
        // Arrange
        $this->sut->test_market_index = 1;
        $this->sut->test_adjacent_positions_index = 1;
        $this->mock_get_current_data->expects($this->exactly(1))->method('get')->willReturn($this->all_data);
        // Act
        $this->act_default();
        // Assert
        $placed_tile = $this->sut->get_placed_tile();
        $this->assertEquals($this->other_tile['id'], $placed_tile['id']);
        $this->assertEquals($this->adjacent_positions[$this->sut->test_adjacent_positions_index]['horizontal'], $placed_tile['horizontal']);
        $this->assertEquals($this->adjacent_positions[$this->sut->test_adjacent_positions_index]['vertical'], $placed_tile['vertical']);
        $this->assertEquals(0, $placed_tile['rotation']);
    }
}

?>
