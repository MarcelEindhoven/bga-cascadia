define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.usecase_place_tile', null, {
        constructor(id) {
            this.tiles = [];
        },
        setFramework(framework){this.framework = framework},
        setTileHandler(tile_handler){this.tile_handler = tile_handler;},

        start(tiles) {
            this.tiles = tiles;
            for (index in this.tiles) {
                tile = this.tiles[index];
                this.framework.subscribe(tile, this, 'token_selected');
            }
        },
        stop() {
            for (index in this.tiles) {
                tile = this.tiles[index];
                this.framework.unsubscribe(tile, this, 'token_selected');
            }
        },
        subscribe_token_placed(object, method) {this.callback_object = object; this.callback_method = method;},
        token_placed(event) {
            this.callback_object[this.callback_method]();
        },
    });
});
