<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation unit tests : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/../../vendor/autoload.php');
use PHPUnit\Framework\TestCase;

include_once(__DIR__.'/../../export/modules/Infrastructure/ScoringCard.php');

include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Deck.php');

class ScoringCardSetupTest extends TestCase{
    protected ScoringCardSetup $sut;

    public function test_scoring_is_created() {
        // Arrange
        $this->mock_cards = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
        $this->sut = new ScoringCardSetup();
        $this->sut->setDeck($this->mock_cards);
        $animal_type = 5;
        $index = 1;
        $expected_definition = array( 'type' => $animal_type, 'type_arg' => $index , 'nbr' => 1);
        $this->mock_cards->expects($this->exactly(1))->method('createCards')->with([$expected_definition]);
        $this->mock_cards->expects($this->exactly(1))->method('shuffle')->with(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::STANDARD_DECK);
        //$this->mock_cards->expects($this->exactly(1))->method('pickCardsForLocation')->with();

        // Act
        $this->sut->add($animal_type, $index);
        $this->sut->flush();
        // Assert
    }
}
?>
