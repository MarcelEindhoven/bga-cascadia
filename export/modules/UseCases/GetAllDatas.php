<?php
namespace NieuwenhovenGames\Cascadia;
/**
 *------
 * Cascadia implementation : © Marcel van Nieuwenhoven marcel.eindhoven@hotmail.com
 *
 */

class GetAllDatas {
    protected array $sources = [];
    static public function create($sources): GetAllDatas {
        $object = new GetAllDatas();
        $object->setSources($sources);
        return $object;
    }

    public function setSources($sources): GetAllDatas {
        $this->sources = $sources;
        return $this;
    }

    public function get(): array {
        $results = [];
        foreach ($this->sources as $name => $source) {
            $results[$name] = $source->get();
        }
        return $results;
    }
}
?>
