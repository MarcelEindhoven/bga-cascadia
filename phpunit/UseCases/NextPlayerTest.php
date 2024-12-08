<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation unit tests : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/../../vendor/autoload.php');
use PHPUnit\Framework\TestCase;

include_once(__DIR__.'/../../export/modules/UseCases/NextPlayer.php');

include_once(__DIR__.'/../../export/modules/Infrastructure/Market.php');

include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Deck.php');
include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Notifications.php');

class NextPlayerTest extends TestCase{
    protected ?NextPlayer $sut = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\GameState $mock_gamestate = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck $mock_cards = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\Notifications $mock_notifications = null;
    protected ?MarketUpdate $mock_market = null;
    protected array $full_market = ['tile' => [['location_arg' => 0], ['location_arg' => 1], ['location_arg' => 2], ['location_arg' => 3]],
                                    'wildlife' => [['location_arg' => 0], ['location_arg' => 1], ['location_arg' => 2], ['location_arg' => 3]]];

    protected function setUp(): void {
        $this->mock_gamestate = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\GameState::class);
        $this->sut = NextPlayer::create($this->mock_gamestate);

        $this->mock_notifications = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Notifications::class);
        $this->sut->set_notifications($this->mock_notifications);

        $this->mock_market = $this->createMock(MarketUpdate::class);
        $this->sut->set_market($this->mock_market);
    }

    public function test_filled_market_requires_no_refill() {
        // Arrange
        $full_market = ['wildlife' => [['location_arg' => 0], ['location_arg' => 1], ['location_arg' => 2], ['location_arg' => 3]]];
        $this->mock_market->expects($this->exactly(1))->method('get')->willReturn($full_market);
        $this->arrange_expect_refills(0);
        // Act
        $this->act_default();
        // Assert
    }

    public function test_almost_full_market_requires_single_refill() {
        // Arrange
        $category = 'wildlife';
        $almost_full_market = [$category => [['location_arg' => 0], ['location_arg' => 1], ['location_arg' => 3]]];
        $this->mock_market->expects($this->exactly(1))->method('get')->willReturn($almost_full_market);
        $this->mock_market->expects($this->exactly(1))->method('refill')->with($category, 2);
        $this->arrange_expect_refills(1);
        // Act
        $this->act_default();
        // Assert
    }

    public function test_empty_market_requires_8refill() {
        // Arrange
        $empty_market = ['tile' => [], 'wildlife' => [], ];
        $this->mock_market->expects($this->exactly(1))->method('get')->willReturn($empty_market);
        
        $this->arrange_expect_refills(8);
        // Act
        $this->act_default();
        // Assert
    }

    protected function act_default() {
        $this->sut->execute();
    }
    protected function arrange_expect_refills($amount_refills) {
        $this->mock_market->expects($this->exactly($amount_refills))->method('refill');
        $this->mock_market->method('get_specific_item')->willReturn(['location_arg' => 0]);
    }
}

?>
