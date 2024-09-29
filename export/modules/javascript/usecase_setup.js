define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.usecase_setup', null, {
        /**
         * Dependencies:
         * t = habitat_tile_factory.create(tile_specification)
         * h = habitat_factory.create(player_id)
         * h.place(t)
         * market.place(t)
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
            this.setup_market_tiles(gamedatas.market.habitat);
        },
        // Habitats
        setup_habitats(specification) {
            for (player_id in specification)
                this.setup_single_habitat(player_id, specification);
        },
        setup_single_habitat(player_id, specification) {
            this.habitats[player_id] = this.habitat_factory.create(player_id);
            this.fill_with_tiles(this.habitats[player_id], specification[player_id]);
        },
        get_habitats(){console.log (this.habitats);return this.habitats;},
        // Market
        setup_market_tiles(tile_specifications) {
            this.fill_with_tiles(this.market, tile_specifications);
        },
        // Common
        fill_with_tiles(habitat, tile_specifications) {
            for (var index in tile_specifications)
                habitat.place(this.habitat_tile_factory.create(tile_specifications[index]));
        },
    });
});
