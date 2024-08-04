define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.habitat', null, {
        constructor(id) {
            this.id = '' + id;
        },
        setFramework(framework){this.framework = framework},
        setTileHandler(tile_handler){this.tile_handler = tile_handler;},

        place(tile) {
            this.tile_handler.move(tile, this.id, x = 0, y = 0);
        },
    });
});
