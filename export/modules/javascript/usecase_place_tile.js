define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.usecase_place_tile', null, {
        constructor(id) {
            this.candidate_positions = [];
        },
        setFramework(framework){this.framework = framework},
        set_candidate_positions(candidate_positions){this.candidate_positions = Object.assign({}, candidate_positions)},
        set_tile_handler(tile_handler){this.tile_handler = tile_handler;},
        set_token_subscriptions(token_subscriptions){this.token_subscriptions = token_subscriptions;},
        set_habitat(habitat){this.habitat = habitat;},

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
        callback_market_tile_selected(ths, tile) {
            ths.market_tile_selected(tile);
        },
        market_tile_selected(tile) {
            unique_id = tile.unique_id;
            for (index in this.candidate_positions) {
                candidate_position = this.candidate_positions[index];

                var proposed_tile = Object.assign({}, tile);
                proposed_tile.horizontal = candidate_position.horizontal, 
                proposed_tile.vertical = candidate_position.vertical,
                proposed_tile.unique_id = unique_id + candidate_position.horizontal + candidate_position.vertical

                this.tile_handler.create(proposed_tile);

                this.habitat.place(proposed_tile);

                this.tile_handler.mark_as_selectable(proposed_tile);
            }
        },
        subscribe_tile_placed(object, method) {this.callback_object = object; this.callback_method = method;},
        candidate_tile_selected(tile) {
            this.callback_object[this.callback_method](tile);
        },
    });
});
