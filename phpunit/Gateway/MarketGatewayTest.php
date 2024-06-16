<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation unit tests : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/../../vendor/autoload.php');
use PHPUnit\Framework\TestCase;

include_once(__DIR__.'/../../export/modules/Gateway/Market.php');

include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Deck.php');

class MarketGatewayTest extends TestCase{
    protected string $deck_name = 'habitat';

    protected function setUp(): void {
        $this->mock_cards = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
        $this->sut = new MarketGateway();
        $this->sut->setDecks([$this->deck_name => $this->mock_cards]);
    }

    public function test_single_market_item() {
        // Arrange
        $this->mock_cards->expects($this->exactly(1))->method('pickCardForLocation')->with(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::STANDARD_DECK, $this->deck_name, 0);

        // Act
        $this->sut->setup(1);
        // Assert
    }

    public function test_double_market_item() {
        // Arrange
        $this->mock_cards->expects($this->exactly(2))->method('pickCardForLocation');

        // Act
        $this->sut->setup(2);
        // Assert
    }
}
?>
