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
}
class AIChoosesTileAndPositionAndWildlifeTest extends TestCase{
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\GameState $mock_gamestate = null;
    protected ?AIChoosesTileAndPositionAndWildlife $sut = null;
    protected ?GetAllDatas $mock_get_current_data = null;
    protected array $wildlife_specification = ['id'=>5];
    protected array $default_wildlife = ['id' => 5, 'unique_id' => 'test'];
    protected array $other_wildlife = ['id' => 6, 'unique_id' => 'other'];
    protected array $market = [];
    protected int $player_id = 77;

    protected function setUp(): void {
        $this->mock_gamestate = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\GameState::class);
        $this->sut = new TestAIChoosesTileAndPositionAndWildlife($this->mock_gamestate);

        $this->mock_get_current_data = $this->createMock(GetAllDatas::class);
        $this->sut->set_get_current_data($this->mock_get_current_data);

        $this->market = ['wildlife' => [0 => $this->default_wildlife, 1 => $this->other_wildlife]];
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
}

?>
