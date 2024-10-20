define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.usecase_place_tile', null, {
        /**
         * First, subscribe to the market tiles (This allows the player to select a market tile), which must be undone at the end
         * When the player selects a market tile, create one candidate tile for each candidate position (Candidate positions have been calculated by the server)
         * Each candidate tile is placed in the active player habitat on its candidate position and must be removed when the candidate tile is destroyed
         * Subscribe to each candidate tile selection, which must be unsubscribed when the candidate tile is destroyed
         * When the player selects a candidate tile, the use case ends and the (single) subscriber to this use case is notified
         * When again the player selects a market tile, first destroy the existing candidate tiles
         * 
         * Use case User may select a tile:
         * u = usecase_place_tile(dependencies);
         * u.set_candidate_positions(candidate_positions);
         * u.subscribe_tile_placed(object, method);
         * market.subscribe_tile_selected(this, market_tile_selected); for first subscription
         * 
         * Use case Market tile selected:
         * u.market_tile_selected(tile);
         * Create, place and subscribe candidate tiles for each candidate position
         * habitat_tile_factory.create(tile_specification);
         * habitat.place(candidate_tile);
         * token_subscriptions.subscribe(candidate_tile, this, 'candidate_tile_selected');
         * 
         * Use case Candidate tile selected, this ends the use case:
         * u.candidate_tile_selected(tile);
         * object[method] (selected tile);
         * Invoke sub use case Destroy candidate tiles
         * market.unsubscribe_tile_selected
         * 
         * Sub Use case destroy candidate tiles
         * token_subscriptions.unsubscribe(candidate_tile)
         * habitat.remove(candidate_tile);
         * habitat_tile.destroy();
         * 
         * Use case Market tile selected again:
         * u.market_tile_selected(tile);
         * Invoke sub use case Destroy candidate tiles
         * Invoke sub use case Market tile selected
         */
        constructor(dependencies) {
            this.clone(dependencies);
            this.candidate_positions = [];
            this.candidate_tiles = [];
        },
        clone(properties){
            for (var property in properties) {
                this[property] = properties[property];
            }
        },
        set_candidate_positions(candidate_positions){this.candidate_positions = Object.assign({}, candidate_positions)},

        market_tile_selected(tile) {
            this.destroy_candidate_tiles();

            unique_id = tile.unique_id;
            for (index in this.candidate_positions) {
                candidate_position = this.candidate_positions[index];

                var candidate_specification = Object.assign({}, tile);
                candidate_specification.horizontal = candidate_position.horizontal, 
                candidate_specification.vertical = candidate_position.vertical,
                candidate_specification.unique_id = unique_id + candidate_position.horizontal + candidate_position.vertical

                var candidate_tile = this.habitat_tile_factory.create(candidate_specification);
                this.candidate_tiles.push(candidate_tile);

                this.habitat.place(candidate_tile);

                this.token_subscriptions.subscribe(candidate_tile, this, 'candidate_tile_selected');
            }
        },
        subscribe_tile_placed(object, method) {
            if (! this.callback_object)
                market.subscribe_tile_selected(this, 'market_tile_selected');
            // Note that so far single subscription is supported, despite the previous if statement
            this.callback_object = object;
            this.callback_method = method;
        },
        candidate_tile_selected(tile) {
            market.unsubscribe_tile_selected(this, 'market_tile_selected');
            this.destroy_candidate_tiles();
            this.callback_object[this.callback_method](tile);
        },
        destroy_candidate_tiles() {
            for (index in this.candidate_tiles) {
                candidate_tile = this.candidate_tiles[index];
                this.habitat.remove(candidate_tile);
                this.token_subscriptions.unsubscribe(candidate_tile, this, 'candidate_tile_selected');
                candidate_tile.destroy();
            }
            this.candidate_tiles = [];
        },
    });
});
