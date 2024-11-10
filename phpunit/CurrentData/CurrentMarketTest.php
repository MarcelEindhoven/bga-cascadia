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

include_once(__DIR__.'/../../export/modules/Infrastructure/HabitatSetup.php');

include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Deck.php');

class CurrentMarketTest extends TestCase{
    protected CurrentMarket $sut;

    /**
     * @dataProvider marketHabitatProvider
     */
    public function test_habitat_is_retrieved_and_unpacked($retrieved_cards, $expected_cards) {
        // Arrange
        $this->sut = new CurrentMarket();
        $this->mock_cards = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
        $this->mock_cards_wildlife = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
        $this->sut->setDecks(['tile' => $this->mock_cards, 'wildlife' => $this->mock_cards_wildlife]);

        $this->mock_cards->expects($this->exactly(1))->method('getCardsInLocation')->with('market')->willReturn($retrieved_cards);

        // Act
        $cards = $this->sut->get();
        // Assert
        $this->assertEquals($expected_cards, $cards);
    }

    public function marketHabitatProvider(): array {
        list($card1, $expected1) = $this->createCardAndExpectedHabitat([], [], 1);
        list($card2, $expected2) = $this->createCardAndExpectedHabitat([1], [1], 3);
        list($card3, $expected3) = $this->createCardAndExpectedHabitat([1, 4, 5], [1, 5], 2);
        return [
            [[], ['habitat' => [], 'wildlife' => []]],
            [[$card1], ['habitat' => [$expected1], 'wildlife' => []]],
            [[$card2], ['habitat' => [$expected2], 'wildlife' => []]],
            [[$card1, $card3], ['habitat' => [$expected1, $expected3], 'wildlife' => []]],
            // Sort according to location argument
            [[$card3, $card2, $card1], ['habitat' => [$expected1, $expected3, $expected2], 'wildlife' => []]],
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

    /**
     * @dataProvider marketWildlifeProvider
     */
    public function test_wildlife_is_retrieved_and_unpacked($retrieved_cards, $expected_cards) {
        // Arrange
        $this->sut = new CurrentMarket();
        $this->mock_cards = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
        $this->mock_cards_wildlife = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
        $this->sut->setDecks(['tile' => $this->mock_cards, 'wildlife' => $this->mock_cards_wildlife]);

        $this->mock_cards_wildlife->expects($this->exactly(1))->method('getCardsInLocation')->with('market')->willReturn($retrieved_cards);

        // Act
        $cards = $this->sut->get();
        // Assert
        $this->assertEquals($expected_cards, $cards);
    }

    public function marketWildlifeProvider(): array {
        list($card1, $expected1) = $this->createCardAndExpectedWildlife(1, 0);
        list($card2, $expected2) = $this->createCardAndExpectedWildlife(4, 3);
        return [
            [[], ['habitat' => [], 'wildlife' => []]],
            [[$card1], ['habitat' => [], 'wildlife' => [$expected1]]],
            [[$card2], ['habitat' => [], 'wildlife' => [$expected2]]],
        ];
    }

    protected function createCardAndExpectedWildlife($type, $market_index) {
        return [
            ['id' => 5, 'type' => $type, 'location_arg' => $market_index, ],
            ['id' => 5, 'type' => $type, 'location_arg' => $market_index, 'unique_id' => 'wildlife' . 5, ],
        ];
    }
}
?>
