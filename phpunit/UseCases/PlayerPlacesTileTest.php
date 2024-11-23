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
include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Notifications.php');

class PlayerPlacesTileTest extends TestCase{
    protected ?PlayerPlacesTile $sut = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\GameState $mock_gamestate = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck $mock_cards = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\Notifications $mock_notifications = null;
    protected ?TerritoryUpdate $mock_territory = null;
    protected array $tile_specification =[];

    protected function setUp(): void {
        $this->mock_gamestate = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\GameState::class);
        $this->sut = PlayerPlacesTile::create($this->mock_gamestate);

        $this->sut->set_moved_tile($this->tile_specification);

        $this->mock_cards = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
        $this->sut->set_tile_deck($this->mock_cards);

        $this->mock_notifications = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Notifications::class);
        $this->sut->set_notifications($this->mock_notifications);

        $this->mock_territory = $this->createMock(TerritoryUpdate::class);
        $this->sut->set_territory($this->mock_territory);
    }

    public function test_execute_triggers_move() {
        // Arrange
        $this->mock_territory->expects($this->exactly(1))->method('move')->with($this->mock_cards, $this->tile_specification);
        // Act
        $this->act_default();
        // Assert
    }

    public function test_execute_triggers_notifyAllPlayers_with_tile() {
        // Arrange
        $tile = ['id' => 'test'];
        $this->mock_territory->expects($this->exactly(1))->method('get_tile')->with($this->mock_cards, $this->tile_specification)->willReturn($tile);
        $expected_message = 'tile_placed';
        $this->mock_notifications->expects($this->exactly(1))->method('notifyAllPlayers')->with('tile_placed', $expected_message, ['tile' => $tile]);
        // Act
        $this->act_default();
        // Assert
    }

    protected function act_default() {
        $this->sut->execute();
    }
}

?>
