define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.market', null, {
        /**
         * Dependencies
         * tile/wildlife.move to set the position on the board using the market HTML IDs
         * tile/wildlife.location_arg to specify the market column
         * this.token_subscriptions.subscribe/unsubscribe to enable the player to select that token and trigger the callback
         */

        /**
         * Use case setup
         * m = market();
         * m.set_token_subscriptions()
         * m.place(tile) for each market tile
         * m.populate(wildlife) for each market wildlife
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

        /**
         * Use case select market tile to place in habitat
         * m.subscribe_tile_selected
         * m.unsubscribe_tile_selected
         */
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
        get_wildlife_from_combination_with(tile) {
            for (index in this.wildlifes)
                if (tile.location_arg == this.wildlifes[index].location_arg)
                    return this.wildlifes[index];
        },
        wildlife_is_selected(wildlife) {
            this.wildlifes[wildlife.id].location = 'selected';
        },
        /**
         * Use case move tile from market, for example into territory
         * Precondition: tile is unsubscribed from token subscriptions
         */
        remove_tile(tile_specification) {
            removed_tile = this.tiles[tile_specification.id];
            delete this.tiles[tile_specification.id];
            return removed_tile;
        },
        /**
         * Use case move wildlife from market, for example into territory
         * Precondition: wildlife is unsubscribed from token subscriptions
         */
        remove_wildlife(wildlife_specification) {
            removed_wildlife = this.wildlifes[wildlife_specification.id];
            delete this.wildlifes[wildlife_specification.id];
            return removed_wildlife;
        },
    });
});
