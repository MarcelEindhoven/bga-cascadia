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
    protected array $chosen_wildlife = ['type' => 3];

    /**
     * @dataProvider adjacentPositionsProvider
     */
    public function testAdjacentPositions($tiles, $expected_positions) {
        // Arrange
        $this->sut = Habitat::create($tiles, []);

        // Act
        $cards = $this->sut->get_adjacent_positions();
        // Assert
        $this->assertEqualsCanonicalizing($expected_positions, $cards);
        
    }
    public function adjacentPositionsProvider(): array {
        $tile33 = ['horizontal' => 3, 'vertical' => 3];
        $tile54 = ['horizontal' => 5, 'vertical' => 4];
        $tile34 = ['horizontal' => 3, 'vertical' => 4];
        $tile22 = ['horizontal' => 2, 'vertical' => 2];
        $tile23 = ['horizontal' => 2, 'vertical' => 3];
        $tile24 = ['horizontal' => 2, 'vertical' => 4];
        $tile43 = ['horizontal' => 4, 'vertical' => 3];
        $tile14 = ['horizontal' => 1, 'vertical' => 4];

        $tile13 = ['horizontal' => 1, 'vertical' => 3];
        $tile44 = ['horizontal' => 4, 'vertical' => 4];
        $tile03 = ['horizontal' => 0, 'vertical' => 3];

        return [
            [[], []],
            [[$tile23], [$tile03, $tile43, $tile13, $tile33, $tile14, $tile34]],
            [[$tile34], [$tile14, $tile54, $tile23, $tile24, $tile43, $tile44]],
            [[$tile23, $tile34], [$tile03, $tile43, $tile13, $tile33, $tile14, $tile54, $tile24, $tile44]],
        ];
    }

    /**
     * @dataProvider provider_get_candidate_tiles_for_chosen_wildlife
     */
    public function test_get_candidate_tiles_for_chosen_wildlife($tiles, $wildlifes, $expected_tiles) {
        // Arrange
        $this->sut = Habitat::create($tiles, $wildlifes);

        // Act
        $cards = $this->sut->get_candidate_tiles_for_chosen_wildlife($this->chosen_wildlife);
        // Assert
        $this->assertEqualsCanonicalizing($expected_tiles, $cards);
        
    }
    public function provider_get_candidate_tiles_for_chosen_wildlife(): array {
        $tile33 = ['horizontal' => 3, 'vertical' => 3];
        $tile54 = ['horizontal' => 5, 'vertical' => 4];
        $tile34 = ['horizontal' => 3, 'vertical' => 4];
        $tile22 = ['horizontal' => 2, 'vertical' => 2];
        $tile23 = ['horizontal' => 2, 'vertical' => 3];
        $tile24 = ['horizontal' => 2, 'vertical' => 4];
        $tile43 = ['horizontal' => 4, 'vertical' => 3];
        $tile14 = ['horizontal' => 1, 'vertical' => 4];

        $tile13 = ['horizontal' => 1, 'vertical' => 3];
        $tile44 = ['horizontal' => 4, 'vertical' => 4];
        $tile03 = ['horizontal' => 0, 'vertical' => 3];

        return [
            [[], [], []],
        ];
    }

}
?>
