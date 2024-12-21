define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.usecase_place_wildlife', null, {
        /**
         * u = usecase_place_wildlife(dependencies);
         * u.subscribe_wildlife_placed(object, method);
         */
        constructor(dependencies) {
            this.overrule(this, dependencies);
        },
        subscribe_wildlife_placed(object, method) {
            this.habitat.subscribe_tile_selected_for_wildlife(this.chosen_wildlife, this, 'candidate_tile_selected');
            this.callback_object = object;
            this.callback_method = method;
        },

        overrule(object, properties) {
            for (var property in properties) {
                object[property] = properties[property];
            }
        },

        /**
         * Use case Candidate tile selected, this ends the place wildlife use case
         */
        candidate_tile_selected(tile) {
            this.end_use_case();
            this.callback_object[this.callback_method](tile);
        },
        do_not_place_wildlife() {
            this.end_use_case();
        },
        end_use_case() {
            this.habitat.unsubscribe_tile_selected_for_wildlife(this.chosen_wildlife, this, 'candidate_tile_selected', this.chosen_wildlife);
        },
    });
});
