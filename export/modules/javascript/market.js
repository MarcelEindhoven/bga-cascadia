define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.market', null, {
        constructor() {
            this.tiles = [];
            this.wildlifes = [];
        },
        setFramework(framework){this.framework = framework},
        setTileHandler(tile_handler){this.tile_handler = tile_handler;},
        set_token_subscriptions(token_subscriptions){this.token_subscriptions = token_subscriptions;},

        place(tile) {
            this.tiles[tile.id] = tile;
            tile.move('habitat_' + tile.location_arg);
        },
        populate(wildlife) {
            this.wildlifes[wildlife.id] = wildlife;
            wildlife.move('wildlife_' + wildlife.location_arg);
        },
        subscribe_tile_selected(object, method) {
            for (index in this.tiles) {
                tile = this.tiles[index];
                this.token_subscriptions.subscribe(tile, object, method);
                this.tile_handler.mark_as_selectable(tile);
            }
        },
    });
});
