define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.usecase_select_wildlife', null, {
        /**
         * First, subscribe to the market tiles (This allows the player to select a market tile), which must be undone at the end
         * When the player selects a market tile, create one candidate tile for each candidate position (Candidate positions have been calculated by the server)
         * Each candidate tile is placed in the active player habitat on its candidate position and must be removed when the candidate tile is destroyed
         * Subscribe to each candidate tile selection, which must be unsubscribed when the candidate tile is destroyed
         * When the player selects a candidate tile, the use case ends and the (single) subscriber to this use case is notified
         * When again the player selects a market tile, first destroy the existing candidate tiles
         */

        constructor(dependencies) {
            this.overrule(this, dependencies);
            this.market.subscribe_tile_selected(this, 'market_tile_selected');
        },

        overrule(object, properties) {
            for (var property in properties) {
                object[property] = properties[property];
            }
        },
        terminate() {
            this.market.unsubscribe_tile_selected(this, 'market_tile_selected');
        },
        market_tile_selected(tile) {
            this.selected_wildlife = this.market.get_wildlife_from_combination_with(tile);
        },
        get_selected_wildlife() {return this.selected_wildlife;},
    });
});
