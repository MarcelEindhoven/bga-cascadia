<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation unit tests : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/../../vendor/autoload.php');
use PHPUnit\Framework\TestCase;

include_once(__DIR__.'/../../export/modules/Gateway/ScoringCard.php');

include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Deck.php');

class CurrentScoringCardsTest extends TestCase{
    protected CurrentScoringCards $sut;

    public function test_scoring_is_retrieved_and_sorted() {
        // Arrange
        $card1 = ['type' => 1, 'type_arg' => 0];
        $card2 = ['type' => 2, 'type_arg' => 3];
        $retrieved_cards = [$card2, $card1];
        $expected_cards = [$card1, $card2];

        $this->mock_cards = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
        $this->sut = new CurrentScoringCards();
        $this->sut->setDeck($this->mock_cards);

        $this->mock_cards->expects($this->exactly(1))->method('getCardsInLocation')->with(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::STANDARD_DECK)->willReturn($retrieved_cards);

        // Act
        $cards = $this->sut->get();
        // Assert
        $this->assertEquals($expected_cards, $cards);
    }
}
?>
