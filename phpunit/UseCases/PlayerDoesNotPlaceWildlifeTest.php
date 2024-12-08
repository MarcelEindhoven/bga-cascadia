<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation unit tests : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/../../vendor/autoload.php');
use PHPUnit\Framework\TestCase;

include_once(__DIR__.'/../../export/modules/UseCases/PlayerDoesNotPlaceWildlife.php');

include_once(__DIR__.'/../../export/modules/Infrastructure/Habitat.php');

include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Deck.php');
include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Notifications.php');

class PlayerDoesNotPlaceWildlifeTest extends TestCase{
    protected ?PlayerDoesNotPlaceWildlife $sut = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\GameState $mock_gamestate = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck $mock_wildlifes = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\Notifications $mock_notifications = null;
    protected array $wildlife_card =['id' => 'wildlife'];

    protected function setUp(): void {
        $this->mock_gamestate = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\GameState::class);
        $this->sut = PlayerDoesNotPlaceWildlife::create($this->mock_gamestate);

        $this->mock_wildlifes = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
        $this->sut->set_wildlife_deck($this->mock_wildlifes);

        $this->mock_notifications = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Notifications::class);
        $this->sut->set_notifications($this->mock_notifications);
    }

    public function test_execute_triggers_get_tile_move() {
        // Arrange
        $this->mock_wildlifes->expects($this->exactly(1))->method('moveAllCardsInLocation')->with('chosen', \NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::STANDARD_DECK);
        // Act
        $this->act_default();
        // Assert
    }

    protected function act_default() {
        $this->sut->execute();
    }
}

?>
