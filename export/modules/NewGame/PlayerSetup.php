<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

 class PlayerSetup {
    protected int $number_AI = 0;
    static public function create($number_AI): PlayerSetup {
        $object = new PlayerSetup();
        $object->setNumberAI($number_AI);
        return $object;
    }

    public function setNumberAI($number_AI): PlayerSetup {
        $this->number_AI = $number_AI;
        return $this;
    }

    public function setup(&$players): PlayerSetup {
        $keys = array_keys($players);
        // Assign player slots to AI by overwriting the player name
        for ($AI_index = 0; $AI_index < $this->number_AI; $AI_index++) {
            // Interleave human players with AI players
            $this->skipFirstKeyIfPossible($keys, $this->number_AI - $AI_index);
            $this->assignPlayerAsAI($players[$keys[array_key_first($keys)]], $AI_index + 1);
            unset($keys[array_key_first($keys)]);
        }
        return $this;
    }
    protected function skipFirstKeyIfPossible(& $keys, $remaining_AI) {
        if ($remaining_AI < count($keys)) {
            // First in the remaining list is a human player
            unset($keys[array_key_first($keys)]);
        }
    }
    protected function assignPlayerAsAI(& $player, $AI_sequence_number): PlayerSetup {
        $player['player_name'] = 'AI_' . ($AI_sequence_number);

        return $this;
    }
}
?>
