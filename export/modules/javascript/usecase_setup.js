define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.usecase_setup', null, {
        /**
         * Dependencies:
         * t = habitat_tile_factory.create()
         * t.create(tile_specification)
         * habitat_factory.create(player_id)
         */
        constructor(dependencies) {
            this.clone(dependencies);
            this.habitats = {};
        },
        clone(properties){
            for (var property in properties) {
                this[property] = properties[property];
            }
        },
        setup(gamedatas) {
            this.setup_habitats(gamedatas.habitat);
        },
        setup_habitats(specification) {
            for (player_id in specification)
                this.setup_single_habitat(player_id, specification);
        },
        setup_single_habitat(player_id, specification) {
            this.habitats[player_id] = this.habitat_factory.create(player_id);
            this.fill_single_habitat(this.habitats[player_id], specification[player_id]);
        },
        fill_single_habitat(habitat, player_tile_specifications) {
            for (var index in player_tile_specifications)
                habitat.place(this.habitat_tile_factory.create(player_tile_specifications[index]));
        },
        get_habitats(){console.log (this.habitats);return this.habitats;},
    });
});
