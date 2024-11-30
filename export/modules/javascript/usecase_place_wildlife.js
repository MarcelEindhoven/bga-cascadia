define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.usecase_place_wildlife', null, {
        /**
         * First, subscribe to the market wildlifes (This allows the player to select a market wildlife), which must be undone at the end
         * When the player selects a market wildlife, create one candidate wildlife for each candidate position (Candidate positions have been calculated by the server)
         * Each candidate wildlife is placed in the active player habitat on its candidate position and must be removed when the candidate wildlife is destroyed
         * Subscribe to each candidate wildlife selection, which must be unsubscribed when the candidate wildlife is destroyed
         * When the player selects a candidate wildlife, the use case ends and the (single) subscriber to this use case is notified
         * When again the player selects a market wildlife, first destroy the existing candidate wildlifes
         */

        /**
         * Use case User must select a market wildlife:
         * u = usecase_place_wildlife(dependencies);
         * u.set_candidate_positions(candidate_positions);
         * u.subscribe_wildlife_placed(object, method);
         */
        constructor(dependencies) {
            this.overrule(this, dependencies);
            this.candidate_tiles = [];
        },
        subscribe_wildlife_placed(object, method) {
            this.callback_object = object;
            this.callback_method = method;
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
            this.callback_object[this.callback_method](tile);
        },
    });
});
