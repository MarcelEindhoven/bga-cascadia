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

include_once(__DIR__.'/../../export/modules/Infrastructure/Habitat.php');

include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Deck.php');
include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Notifications.php');

class PlayerPlacesWildlifeTest extends TestCase{
    protected ?PlayerPlacesWildlife $sut = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\GameState $mock_gamestate = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck $mock_tiles = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck $mock_wildlifes = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\Notifications $mock_notifications = null;
    protected ?TerritoryUpdate $mock_territory = null;
    protected array $tile_specification =['id' => 'tile'];
    protected array $wildlife_card =['id' => 'wildlife'];

    protected function setUp(): void {
        $this->mock_gamestate = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\GameState::class);
        $this->sut = PlayerPlacesWildlife::create($this->mock_gamestate);

        $this->sut->set_chosen_tile($this->tile_specification);

        $this->mock_tiles = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
        $this->sut->set_tile_deck($this->mock_tiles);

        $this->mock_wildlifes = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
        $this->sut->set_wildlife_deck($this->mock_wildlifes);

        $this->mock_notifications = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Notifications::class);
        $this->sut->set_notifications($this->mock_notifications);

        $this->mock_territory = $this->createMock(TerritoryUpdate::class);
        $this->sut->set_territory($this->mock_territory);
    }

    public function test_execute_triggers_get_tile_move() {
        // Arrange
        $this->arrange_default();

        $expected_wildlife_specification = ['id' => $this->wildlife_card['id'], 'horizontal' => 2, 'vertical' => 3, 'rotation' => 0 ];
        $this->mock_territory->expects($this->exactly(1))->method('move')->with($this->mock_wildlifes, $expected_wildlife_specification);
        // Act
        $this->act_default();
        // Assert
    }

    public function test_execute_triggers_notifyAllPlayers_with_tile() {
        // Arrange
        $this->arrange_default();

        $wildlife = ['id' => $this->wildlife_card['id'], 'horizontal' => 2, 'vertical' => 3, 'rotation' => 4 ];
        $this->mock_territory->expects($this->exactly(1))->method('get_wildlife')->willReturn($wildlife);

        $expected_message = 'wildlife_placed';
        $this->mock_notifications->expects($this->exactly(1))->method('notifyAllPlayers')->with('wildlife_placed', $expected_message, ['wildlife' => $wildlife]);
        // Act
        $this->act_default();
        // Assert
    }

    protected function arrange_default() {
        $tile = ['id' => $this->tile_specification['id'], 'horizontal' => 2, 'vertical' => 3, 'rotation' => 4 ];
        $this->mock_territory->expects($this->exactly(1))->method('get_tile')->with($this->mock_tiles, $this->tile_specification)->willReturn($tile);

        $this->mock_wildlifes->expects($this->exactly(1))->method('getCardsInLocation')->with('chosen')->willReturn([$this->wildlife_card]);
    }

    protected function act_default() {
        $this->sut->execute();
    }
}

?>
