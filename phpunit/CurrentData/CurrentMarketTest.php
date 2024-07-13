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

include_once(__DIR__.'/../../export/modules/Gateway/Habitat.php');

include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Deck.php');

class CurrentMarketTest extends TestCase{
    protected CurrentMarket $sut;
    protected string $deck_name = 'habitat';

    /**
     * @dataProvider habitatProvider
     */
    public function test_habitat_is_retrieved_and_unpacked($retrieved_cards, $expected_cards) {
        // Arrange
        $this->sut = new CurrentMarket();
        $this->mock_cards = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
        $this->sut->setDecks([$this->deck_name => $this->mock_cards]);

        $this->mock_cards->expects($this->exactly(1))->method('getCardsInLocation')->with('market')->willReturn($retrieved_cards);

        // Act
        $cards = $this->sut->get();
        // Assert
        $this->assertEquals($expected_cards, $cards);
    }

    public function habitatProvider(): array {
        list($card1, $expected1) = $this->createCardAndExpectedHabitat([], []);
        list($card2, $expected2) = $this->createCardAndExpectedHabitat([1], [1]);
        list($card3, $expected3) = $this->createCardAndExpectedHabitat([1, 4, 5], [1, 5]);
        return [
            [[], [$this->deck_name => []]],
            [[$card1], [$this->deck_name => [$expected1]]],
            [[$card2], [$this->deck_name => [$expected2]]],
            [[$card2, $card3], [$this->deck_name => [$expected2, $expected3]]],
        ];
    }

    protected function createCardAndExpectedHabitat($terrain_types, $supported_wildlife) {
        $type = HabitatSetup::calculateType($terrain_types);
        $type_arg = HabitatSetup::calculateType($supported_wildlife);
        return [
            ['type' => $type, 'type_arg' => $type_arg, ],
            ['type' => $type, 'type_arg' => $type_arg, 'terrain_types' => $terrain_types, 'supported_wildlife' => $supported_wildlife, ],
        ];
    }
}
?>
