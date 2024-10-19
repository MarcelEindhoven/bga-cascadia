define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.market', null, {
        /**
         * Use case setup
         * m = market(dependencies);
         * m.place(tile) for each market tile
         * m.populate(wildlife) for each market wildlife
         * 
         * Use case select market tile to place in habitat
         * m.subscribe_tile_selected
         * m.unsubscribe_tile_selected
         * 
         * Dependencies
         * tile/wildlife.move to set the position on the board using the market HTML IDs
         * tile/wildlife.location_arg to specify the market column
         * this.token_subscriptions.subscribe/unsubscribe to enable the player to select that token and trigger the callback
         */
        constructor() {
            this.tiles = [];
            this.wildlifes = [];
        },
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
            }
        },
        unsubscribe_tile_selected(object, method) {
            for (index in this.tiles) {
                tile = this.tiles[index];
                this.token_subscriptions.unsubscribe(tile, object, method);
            }
        },
    });
});
