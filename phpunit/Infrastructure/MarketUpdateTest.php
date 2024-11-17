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
    protected ?\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck $mock_cards = null;

    protected string $selected_wildlife_id = "77";
    protected array $tile = ['id' => 5, 'unique_id' =>'habitat_5', 'horizontal' => 0, 'vertical' => 0, 'rotation' => 0];

    protected function setUp(): void {
        $this->mock_cards = $this->createMock(\NieuwenhovenGames\BGA\FrameworkInterfaces\Deck::class);
        $this->sut = MarketUpdate::create(['wildlife' => $this->mock_cards]);
    }

    public function test_select_wildlife_then_location_equals_selected() {
        // Arrange
        $this->mock_cards->expects($this->exactly(1))->method('moveCard')->with($this->selected_wildlife_id, 'selected');
        // Act
        $this->act_default();
        // Assert
    }

    protected function act_default() {
        $this->sut->select_wildlife($this->selected_wildlife_id);
    }
}

?>
