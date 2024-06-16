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
    // Test creation of wildlife tokens
    public function test_wildlife_is_created() {
        // Arrange
        $this->mock_cards = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
        $this->sut = new MarketGateway();
        $this->sut->setDecks([$this->mock_cards]);
        $animal_type = 5;
        $index = 1;
        $expected_definition = array( 'type' => $animal_type, 'type_arg' => $index , 'nbr' => 1);
        //$this->mock_cards->expects($this->exactly(1))->method('createCards')->with([$expected_definition]);

        // Act
        $this->sut->setup();
        // Assert

    }
}
?>
