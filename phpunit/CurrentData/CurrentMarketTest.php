<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation unit tests : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/../../vendor/autoload.php');
use PHPUnit\Framework\TestCase;

include_once(__DIR__.'/../../export/modules/Infrastructure/Market.php');

include_once(__DIR__.'/../../export/modules/Infrastructure/Habitat.php');

include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Deck.php');

class CurrentMarketTest extends TestCase{
    protected CurrentMarket $sut;
    protected string $deck_name = 'habitat';

    /**
     * @dataProvider marketProvider
     */
    public function test_habitat_is_retrieved_and_unpacked($retrieved_cards, $expected_cards) {
        // Arrange
        $this->sut = new CurrentMarket();
        $this->mock_cards = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
        $this->mock_cards_wildlife = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
        $this->sut->setDecks([$this->deck_name => $this->mock_cards, 'wildlife' => $this->mock_cards_wildlife]);

        $this->mock_cards->expects($this->exactly(1))->method('getCardsInLocation')->with('market')->willReturn($retrieved_cards);
        $this->mock_cards_wildlife->expects($this->exactly(1))->method('getCardsInLocation')->with('market')->willReturn($retrieved_cards);

        // Act
        $cards = $this->sut->get();
        // Assert
        $this->assertEquals($expected_cards, $cards);
    }

    public function marketProvider(): array {
        list($card1, $expected1) = $this->createCardAndExpectedHabitat([], [], 1);
        list($card2, $expected2) = $this->createCardAndExpectedHabitat([1], [1], 3);
        list($card3, $expected3) = $this->createCardAndExpectedHabitat([1, 4, 5], [1, 5], 2);
        return [
            [[], [$this->deck_name => [], 'wildlife' => []]],
            [[$card1], [$this->deck_name => [$expected1], 'wildlife' => [$card1]]],
            [[$card2], [$this->deck_name => [$expected2], 'wildlife' => [$card2]]],
            [[$card1, $card3], [$this->deck_name => [$expected1, $expected3], 'wildlife' => [$card1, $card3]]],
            // Sort according to location argument
            [[$card3, $card2, $card1], [$this->deck_name => [$expected1, $expected3, $expected2], 'wildlife' => [$card1, $card3, $card2]]],
        ];
    }

    protected function createCardAndExpectedHabitat($terrain_types, $supported_wildlife, $market_index) {
        $type = HabitatSetup::calculateType($terrain_types);
        $type_arg = HabitatSetup::calculateType($supported_wildlife);
        return [
            ['id' => 5, 'type' => $type, 'type_arg' => $type_arg, 'location_arg' => $market_index, ],
            ['id' => 5, 'type' => $type, 'type_arg' => $type_arg, 'location_arg' => $market_index, 'terrain_types' => $terrain_types, 'supported_wildlife' => $supported_wildlife, 'unique_id' => 'tile' . 5, ],
        ];
    }
}
?>
