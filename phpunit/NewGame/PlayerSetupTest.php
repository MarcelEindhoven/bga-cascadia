<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation unit tests : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

include_once(__DIR__.'/../../vendor/autoload.php');
use PHPUnit\Framework\TestCase;

include_once(__DIR__.'/../../export/modules/NewGame/PlayerSetup.php');

class PlayerSetupTest extends TestCase{
    const PLAYERS1 = [77 => ['player_id' => 77, 'player_name' => 'test ']];
    const PLAYERS2 = [77 => ['player_id' => 77, 'player_name' => 'test '], 7 => ['player_id' => 7, 'player_name' => 'test ']];
    const PLAYERS4 = [77 => ['player_id' => 77, 'player_name' => 'test '], 7 => ['player_id' => 7, 'player_name' => 'test '], 6 => ['player_id' => 6, 'player_name' => 'test '], 5 => ['player_id' => 5, 'player_name' => 'test ']];

    public function setup(): void {
        $this->sut = new PlayerSetup();
    }

    public function test_no_AI() {
        // Arrange
        $players = PlayerSetupTest::PLAYERS1;
        // Act
        $this->sut->setup($players);
        // Assert
        $this->assertEquals(PlayerSetupTest::PLAYERS1, $players);
    }

    public function test_one_AI() {
        // Arrange
        $players = PlayerSetupTest::PLAYERS1;
        $this->sut->setNumberAI(1);
        // Act
        $this->sut->setup($players);
        // Assert
        $this->assertEquals('AI_1', $players[77]['player_name']);
    }

    public function test_all_AI() {
        // Arrange
        $players = PlayerSetupTest::PLAYERS2;
        $this->sut->setNumberAI(2);
        // Act
        $this->sut->setup($players);
        // Assert
        $this->assertEquals('AI_1', $players[77]['player_name']);
        $this->assertEquals('AI_2', $players[7]['player_name']);
    }

    public function test_three_AI() {
        // Arrange
        $players = PlayerSetupTest::PLAYERS4;
        $this->sut->setNumberAI(3);
        // Act
        $this->sut->setup($players);
        // Assert
        $this->assertEquals('AI_1', $players[77]['player_name']);
        $this->assertEquals(PlayerSetupTest::PLAYERS4[7]['player_name'], $players[7]['player_name']);
        $this->assertEqualsCanonicalizing(['AI_2', 'AI_3'], [$players[6]['player_name'], $players[5]['player_name']]);
    }

    public function test_two_AI() {
        // Arrange
        $players = PlayerSetupTest::PLAYERS4;
        $this->sut->setNumberAI(2);
        // Act
        $this->sut->setup($players);
        // Assert
        $this->assertEquals('AI_1', $players[77]['player_name']);
        $this->assertEquals('AI_2', $players[6]['player_name']);
        $this->assertEquals(PlayerSetupTest::PLAYERS4[7]['player_name'], $players[7]['player_name']);
        $this->assertEquals(PlayerSetupTest::PLAYERS4[5]['player_name'], $players[5]['player_name']);
    }
}
?>
