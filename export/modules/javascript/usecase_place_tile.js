define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.usecase_place_tile', null, {
        /**
         * First, subscribe to the market tiles (This allows the player to select a market tile), which must be undone at the end
         * When the player selects a market tile, create one candidate tile for each candidate position (Candidate positions have been calculated by the server)
         * Each candidate tile is placed in the active player habitat on its candidate position and must be removed when the candidate tile is destroyed
         * Subscribe to each candidate tile selection, which must be unsubscribed when the candidate tile is destroyed
         * When the player selects a candidate tile, the use case ends and the (single) subscriber to this use case is notified
         * When again the player selects a market tile, first destroy the existing candidate tiles
         */

        /**
         * Use case User must select a market tile:
         * u = usecase_place_tile(dependencies);
         * u.set_candidate_positions(candidate_positions);
         * u.subscribe_tile_placed(object, method);
         */
        constructor(dependencies) {
            this.overrule(this, dependencies);
            this.candidate_positions = [];
            this.candidate_tiles = [];
        },
        set_candidate_positions(candidate_positions) {this.candidate_positions = this.get_clone(candidate_positions);},
        subscribe_tile_placed(object, method) {
            if (! this.callback_object)
                this.market.subscribe_tile_selected(this, 'market_tile_selected');
            // Note that so far single subscription is supported, despite the previous if statement
            this.callback_object = object;
            this.callback_method = method;
        },

        /**
         * Use case Market tile selected (possibly again):
         */
        market_tile_selected(market_tile) {
            this.destroy_candidate_tiles();
            this.create_candidate_tiles_from(market_tile);
        },
        create_candidate_tiles_from(market_tile){
            for (index in this.candidate_positions)
                this.create_candidate_tile_from(this.get_candidate_specification(market_tile, this.candidate_positions[index]));
        },
        get_candidate_specification(market_tile, candidate_position) {
            var specification = this.get_clone(market_tile);

            this.overrule(specification, candidate_position);

            specification.unique_id = this.create_unique_id_from(market_tile, candidate_position);

            return specification;
        },
        get_clone(object) {
            return Object.assign({}, object);
        },
        create_unique_id_from(tile, position) {
            return tile.unique_id + position.horizontal + position.vertical;;
        },
        create_candidate_tile_from(candidate_specification) {
            var candidate_tile = this.habitat_tile_factory.create(candidate_specification);
            this.candidate_tiles.push(candidate_tile);

            this.habitat.place(candidate_tile);

            this.token_subscriptions.subscribe(candidate_tile, this, 'candidate_tile_selected');
        },

        overrule(object, properties) {
            for (var property in properties) {
                object[property] = properties[property];
            }
        },

        /**
         * Use case Candidate tile selected, this ends the place tile use case
         */
        candidate_tile_selected(tile) {
            this.market.unsubscribe_tile_selected(this, 'market_tile_selected');

            this.destroy_candidate_tiles();

            this.callback_object[this.callback_method](tile);
        },

        /**
         * Sub Use case destroy candidate tiles, which is the opposite of create candidate tiles
         */
        destroy_candidate_tiles() {
            for (index in this.candidate_tiles)
                this.destroy_candidate_tile(this.candidate_tiles[index]);
            this.candidate_tiles = [];
        },
        destroy_candidate_tile(tile) {
            this.habitat.remove(tile);
            this.token_subscriptions.unsubscribe(tile, this, 'candidate_tile_selected');
            tile.destroy();
        },
    });
});
