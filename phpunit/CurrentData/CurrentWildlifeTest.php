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

class CurrentWildlifeTest extends TestCase{
    protected CurrentWildlife $sut;
    const DEFAULT_PLAYER_ID = 77;

    /**
     * @dataProvider wildlifeProvider
     */
    public function test_wildlife_is_retrieved($retrieved_cards, $expected_cards) {
        // Arrange
        $players1 = [CurrentWildlifeTest::DEFAULT_PLAYER_ID => ['player_id' => CurrentWildlifeTest::DEFAULT_PLAYER_ID, 'player_name' => 'test ']];
        $this->mock_cards = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
        $this->sut = new CurrentWildlife();
        $this->sut->setDeck($this->mock_cards);
        $this->sut->setPlayers($players1);

        $this->mock_cards->expects($this->exactly(1))->method('getCardsInLocation')->with(CurrentWildlifeTest::DEFAULT_PLAYER_ID)->willReturn($retrieved_cards);

        // Act
        $cards = $this->sut->get();
        // Assert
        $this->assertEquals($expected_cards, $cards);
    }

    public function wildlifeProvider(): array {
        list($card1, $expected1) = $this->createCardAndExpected(1, 0, 0, 0);
        list($card2, $expected2) = $this->createCardAndExpected(2, 0, 0, 3);
        list($card3, $expected3) = $this->createCardAndExpected(3, 0, 50, 5);
        list($card4, $expected4) = $this->createCardAndExpected(4, 77, 33, 0);
        list($card5, $expected5) = $this->createCardAndExpected(5, 77, 33, 1);

        return [
            [[], [CurrentWildlifeTest::DEFAULT_PLAYER_ID => []]],
            [[$card1], [CurrentWildlifeTest::DEFAULT_PLAYER_ID => [$expected1]]],
            [[$card3, $card2], [CurrentWildlifeTest::DEFAULT_PLAYER_ID => [$expected3, $expected2]]],
            [[$card4, $card5], [CurrentWildlifeTest::DEFAULT_PLAYER_ID => [$expected4, $expected5]]],
        ];
    }
    protected function createCardAndExpected($type, $x, $y, $rotation) {
        $location_argument = $rotation * 10000 + $y*100 + $x;
        return [
            ['type' => $type, 'location' => CurrentWildlifeTest::DEFAULT_PLAYER_ID, 'location_arg' => $location_argument],
            ['type' => $type, 'location' => CurrentWildlifeTest::DEFAULT_PLAYER_ID, 'location_arg' => $location_argument, 'x' => $x, 'y' => $y, 'rotation' => $rotation],
        ];
    }
}
?>
