<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation unit tests : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/../../vendor/autoload.php');
use PHPUnit\Framework\TestCase;

include_once(__DIR__.'/../../export/modules/UseCases/PlayerPlacesWildlife.php');

include_once(__DIR__.'/../../export/modules/Infrastructure/Wildlife.php');

include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Deck.php');
include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Notifications.php');

class PlayerPlacesWildlifeTest extends TestCase{
    protected ?PlayerPlacesWildlife $sut = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\GameState $mock_gamestate = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck $mock_wildlifes = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\Notifications $mock_notifications = null;
    protected ?UpdateWildlife $mock_wildlife_handler = null;
    protected array $tile_specification = ['id' => '5'];
    protected array $wildlife_card =['id' => '6'];
    protected int $player_id = 77;

    protected function setUp(): void {
        $this->mock_gamestate = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\GameState::class);
        $this->sut = PlayerPlacesWildlife::create($this->mock_gamestate);

        $this->sut->set_chosen_tile($this->tile_specification['id']);

        $this->sut->set_player_id($this->player_id);

        $this->mock_notifications = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Notifications::class);
        $this->sut->set_notifications($this->mock_notifications);

        $this->mock_wildlife_handler = $this->createMock(UpdateWildlife::class);
        $this->sut->set_wildlife_handler($this->mock_wildlife_handler);
    }

    public function test_execute_triggers_get_tile_move() {
        // Arrange
        $this->arrange_default();

        $this->mock_wildlife_handler->expects($this->exactly(1))->method('move_to_habitat_tile')->with($this->wildlife_card, $this->player_id, $this->tile_specification['id']);
        // Act
        $this->act_default();
        // Assert
    }

    public function test_execute_triggers_notifyAllPlayers_with_wildlife() {
        // Arrange
        $this->arrange_default();

        $wildlife = ['id' => $this->wildlife_card['id'], 'tile_unique_id' => 'tile2'];
        $this->mock_wildlife_handler->expects($this->exactly(1))->method('get_from_habitat')->willReturn($wildlife);

        $expected_message = 'wildlife_placed';
        $this->mock_notifications->expects($this->exactly(1))->method('notifyAllPlayers')->with('wildlife_placed', $expected_message, ['wildlife' => $wildlife]);
        // Act
        $this->act_default();
        // Assert
    }

    public function test_execute_get_from_habitat_for_notifyAllPlayers_with_wildlife_id() {
        // Arrange
        $this->arrange_default();

        $this->mock_wildlife_handler->expects($this->exactly(1))->method('get_from_habitat')->with($this->wildlife_card['id']);
 
        // Act
        $this->act_default();
        // Assert
    }

    protected function arrange_default() {
        $this->mock_wildlife_handler->expects($this->exactly(1))->method('get_chosen')->willReturn($this->wildlife_card);
    }

    protected function act_default() {
        $this->sut->execute();
    }
}

?>
