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
     * @dataProvider candidatePositionsProvider
     */
    public function testCandidatePositions($retrieved_cards, $expected_cards) {
        // Arrange
        $this->sut = new Habitat($retrieved_cards);

        // Act
        $cards = $this->sut->getCandidatePositionsSource()->get();
        // Assert
        $this->assertEquals($expected_cards, $cards);
        
    }
    public function candidatePositionsProvider(): array {
        return [
            [[], []],
        ];
    }
}
?>
