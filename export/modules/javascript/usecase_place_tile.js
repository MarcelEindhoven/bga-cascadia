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

        market_tile_selected(tile) {
            unique_id = tile.unique_id;
            for (index in this.candidate_positions) {
                candidate_position = this.candidate_positions[index];

                var candidate_tile = Object.assign({}, tile);
                candidate_tile.horizontal = candidate_position.horizontal, 
                candidate_tile.vertical = candidate_position.vertical,
                candidate_tile.unique_id = unique_id + candidate_position.horizontal + candidate_position.vertical

                this.tile_handler.create(candidate_tile);

                this.habitat.place(candidate_tile);

                this.tile_handler.mark_as_selectable(candidate_tile);

                this.token_subscriptions.subscribe(candidate_tile, this, 'candidate_tile_selected');
            }
        },
        subscribe_tile_placed(object, method) {this.callback_object = object; this.callback_method = method;},
        candidate_tile_selected(tile) {
            this.callback_object[this.callback_method](tile);
        },
    });
});
