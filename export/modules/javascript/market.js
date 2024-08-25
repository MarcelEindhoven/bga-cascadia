define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.market', null, {
        constructor() {
            this.tiles = [];
        },
        setFramework(framework){this.framework = framework},
        setTileHandler(tile_handler){this.tile_handler = tile_handler;},

        place(tile) {
            this.tiles[tile.id] = tile;
        },
        refresh() {
            for (index in this.tiles) {
                tile = this.tiles[index];
                this.tile_handler.move(tile, 'habitat_' + tile.location_arg);
            }
        },
    });
});
