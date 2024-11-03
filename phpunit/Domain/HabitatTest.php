<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation unit tests : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/../../vendor/autoload.php');
use PHPUnit\Framework\TestCase;

include_once(__DIR__.'/../../export/modules/Domain/Habitat.php');

class HabitatTest extends TestCase{
    protected Habitat $sut;

    /**
     * @dataProvider adjacentPositionsProvider
     */
    public function testAdjacentPositions($retrieved_cards, $expected_cards) {
        // Arrange
        $this->sut = Habitat::create($retrieved_cards);

        // Act
        $cards = $this->sut->getAdjacentPositionsSource()->get();
        // Assert
        $this->assertEqualsCanonicalizing($expected_cards, $cards);
        
    }
    public function adjacentPositionsProvider(): array {
        $tile5050 = ['horizontal' => 50, 'vertical' => 50];
        $tile5051 = ['horizontal' => 50, 'vertical' => 51];
        $tile5049 = ['horizontal' => 50, 'vertical' => 49];
        $tile5150 = ['horizontal' => 51, 'vertical' => 50];
        $tile5151 = ['horizontal' => 51, 'vertical' => 51];
        $tile4950 = ['horizontal' => 49, 'vertical' => 50];
        $tile4951 = ['horizontal' => 49, 'vertical' => 51];

        $tile33 = ['horizontal' => 3, 'vertical' => 3];
        $tile32 = ['horizontal' => 3, 'vertical' => 2];
        $tile34 = ['horizontal' => 3, 'vertical' => 4];
        $tile22 = ['horizontal' => 2, 'vertical' => 2];
        $tile23 = ['horizontal' => 2, 'vertical' => 3];
        $tile42 = ['horizontal' => 4, 'vertical' => 2];
        $tile43 = ['horizontal' => 4, 'vertical' => 3];

        $tile13 = ['horizontal' => 1, 'vertical' => 3];
        $tile12 = ['horizontal' => 1, 'vertical' => 2];
        $tile21 = ['horizontal' => 2, 'vertical' => 1];

        return [
            [[], []],
            [[$tile5050], [$tile5051, $tile5049, $tile5151, $tile5150, $tile4951, $tile4950]],
            [[$tile33], [$tile32, $tile34, $tile22, $tile23, $tile42, $tile43]],
            [[$tile33, $tile22], [$tile32, $tile34, $tile23, $tile42, $tile43, $tile13, $tile12, $tile21]],
        ];
    }
}
?>
