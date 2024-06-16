<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation unit tests : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/../../vendor/autoload.php');
use PHPUnit\Framework\TestCase;

include_once(__DIR__.'/../../export/modules/Gateway/Wildlife.php');

include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Deck.php');

class WildlifeSetupTest extends TestCase{
    // Test creation of wildlife tokens
    public function test_wildlife_is_created() {
        // Arrange
        $this->mock_cards = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
        $this->sut = new WildlifeSetup();
        $this->sut->setDeck($this->mock_cards);
        $animal_type = 5;
        $expected_definition = array( 'type' => $animal_type, 'type_arg' => 0, 'nbr' => 1);
        $this->mock_cards->expects($this->exactly(1))->method('createCards')->with([$expected_definition]);
        $this->mock_cards->expects($this->exactly(1))->method('shuffle')->with(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::STANDARD_DECK);

        // Act
        $this->sut->add($animal_type);
        $this->sut->flush();
        // Assert

    }
}
?>
