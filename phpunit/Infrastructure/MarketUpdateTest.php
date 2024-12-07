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

include_once(__DIR__.'/../../export/modules/BGA/FrameworkInterfaces/Deck.php');

class MarketUpdateTest extends TestCase{
    protected ?MarketUpdate $sut = null;
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck $mock_deck_wildlife = null;

    protected string $chosen_wildlife_id = "77";
    protected array $wildlife = ['id' => 5, 'unique_id' =>'wildlife_5', 'horizontal' => 0, 'vertical' => 0, 'rotation' => 0];

    protected function setUp(): void {
        $this->mock_deck_wildlife = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
        $this->sut = MarketUpdate::create(['wildlife' => $this->mock_deck_wildlife, 'tile' => $this->mock_deck_wildlife]);
    }

    public function test_select_wildlife_then_location_equals_chosen() {
        // Arrange
        $this->mock_deck_wildlife->expects($this->exactly(1))->method('moveCard')->with($this->chosen_wildlife_id, 'chosen');
        // Act
        $this->act_default();
        // Assert
    }

    protected function act_default() {
        $this->sut->select_wildlife($this->chosen_wildlife_id);
    }

    public function test_get_wildlife_from_id_calls_getCard_with_id() {
        // Arrange
        $this->mock_deck_wildlife->expects($this->exactly(1))->method('getCard')->with($this->chosen_wildlife_id);
        // Act
        $this->sut->get_wildlife_from_id($this->chosen_wildlife_id);
        // Assert
    }

    public function test_get_wildlife_from_id_returns_card() {
        // Arrange
        $this->mock_deck_wildlife->expects($this->exactly(1))->method('getCard')->willReturn($this->wildlife);
        // Act
        $returned_wildlife = $this->sut->get_wildlife_from_id($this->chosen_wildlife_id);
        // Assert
        $this->assertEquals($returned_wildlife, $this->wildlife);
    }

    public function test_refill_calls_pickCardForLocation() {
        // Arrange
        $category = 'wildlife';
        $position = 3;
        $this->mock_deck_wildlife->expects($this->exactly(1))->method('pickCardForLocation')->with(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::STANDARD_DECK, 'market', $position);
        // Act
        $this->sut->refill($category, $position);
        // Assert
    }
}

?>
