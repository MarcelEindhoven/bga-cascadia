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
        if ($this->number_AI > 0) {
            $players[array_key_first($players)]['player_name'] = 'AI_1';
            unset($keys[array_key_first($keys)]);
        }
        if ($this->number_AI < count($players)) {
            unset($keys[array_key_first($keys)]);
        }
        $AI_index = 1;
        foreach ($keys as $player_id) {
            if ($AI_index < $this->number_AI) {
                $AI_index ++;
                $players[$player_id]['player_name'] = 'AI_' . $AI_index;
            }
        }
        return $this;
    }
}
?>
