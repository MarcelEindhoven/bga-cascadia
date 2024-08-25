define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.usecase_place_tile', null, {
        constructor(id) {
            this.candidate_positions = [];
        },
        setFramework(framework){this.framework = framework},
        set_candidate_positions(candidate_positions){this.candidate_positions = candidate_positions},
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
        market_tile_selected(tile) {
            console.log('market_tile_selected >');
            for (index in this.candidate_positions) {
                candidate_position = this.candidate_positions[index];
                this.tile_handler.create(tile);
            }
        },
        subscribe_tile_placed(object, method) {this.callback_object = object; this.callback_method = method;},
        candidate_tile_selected(tile) {
            this.callback_object[this.callback_method](tile);
        },
    });
});
