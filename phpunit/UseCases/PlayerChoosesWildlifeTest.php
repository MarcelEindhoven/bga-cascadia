<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation unit tests : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/../../vendor/autoload.php');
use PHPUnit\Framework\TestCase;

include_once(__DIR__.'/../../export/modules/UseCases/PlayerChoosesWildlife.php');

include_once(__DIR__.'/../../export/modules/Infrastructure/Market.php');

include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Deck.php');
include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Notifications.php');

class PlayerChoosesWildlifeTest extends TestCase{
    protected ?PlayerChoosesWildlife $sut = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\GameState $mock_gamestate = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck $mock_cards = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\Notifications $mock_notifications = null;
    protected ?MarketUpdate $mock_market = null;
    protected array $wildlife_specification = ['id'=>5];

    protected function setUp(): void {
        $this->mock_gamestate = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\GameState::class);
        $this->sut = PlayerChoosesWildlife::create($this->mock_gamestate);

        $this->sut->set_chosen_wildlife($this->wildlife_specification['id']);

        $this->mock_notifications = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Notifications::class);
        $this->sut->set_notifications($this->mock_notifications);

        $this->mock_market = $this->createMock(MarketUpdate::class);
        $this->sut->set_market($this->mock_market);
    }

    public function test_execute_triggers_select_wildlife() {
        // Arrange
        $this->mock_market->expects($this->exactly(1))->method('select_wildlife')->with($this->wildlife_specification['id']);
        // Act
        $this->act_default();
        // Assert
    }

    public function test_execute_triggers_notifyAllPlayers() {
        // Arrange
        $expected_wildlife = ['id' => 5, 'unique_id' => 5];
        $this->mock_market->expects($this->exactly(1))->method('get_wildlife_from_id')->willReturn($expected_wildlife);
        $this->mock_notifications->expects($this->exactly(1))->method('notifyAllPlayers')->with('wildlife_chosen', 'wildlife_chosen', ['wildlife' => $expected_wildlife]);
        // Act
        $this->act_default();
        // Assert
    }

    protected function act_default() {
        $this->sut->execute();
    }
}

?>
