define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.usecase_setup', null, {
        /**
         * Use case:
         * u = usecase_setup(dependencies);
         * u.setup(gamedatas);
         * 
         * Dependencies:
         * t = habitat_tile_factory.create(tile_specification)
         * h = habitat_factory.create(player_id)
         * w = wildlife_factory.create(wildlife_specification)
         * h.place(t)
         * h.populate(w)
         * market.place(t)
         * market.populate(w)
         */
        constructor(dependencies) {
            this.clone(dependencies);
            this.habitats = {};
            this.chosen = null;
        },
        clone(properties){
            for (var property in properties) {
                this[property] = properties[property];
            }
        },
        setup(gamedatas) {
            this.setup_habitats(gamedatas.habitats);
            this.populate_habitats(gamedatas.wildlife);
            this.setup_market_tiles(gamedatas.market.tile);
            this.setup_market_wildlife(gamedatas.market.wildlife);
            this.setup_chosen(gamedatas.chosen);
        },
        // Chosen wildlife
        setup_chosen(wildlife_specification) {
            if (wildlife_specification) {
                this.chosen = this.wildlife_factory.create(wildlife_specification);
                this.chosen.move('chosen');
            }
        },
        get_chosen() {
            return this.chosen;
        },

        // Habitats
        setup_habitats(tile_specifications) {
            for (player_id in tile_specifications)
                this.setup_single_habitat(player_id, tile_specifications[player_id]);
        },
        setup_single_habitat(player_id, tile_specification) {
            this.habitats[player_id] = this.habitat_factory.create(player_id);
            this.fill_with_tiles(this.habitats[player_id], tile_specification);
        },
        populate_habitats(wildlife_specifications) {
            for (player_id in wildlife_specifications)
                this.fill_with_wildlife(this.habitats[player_id], wildlife_specifications[player_id]);
        },
        get_habitats(){console.log (this.habitats);return this.habitats;},

        // Market
        setup_market_wildlife(wildlife_specifications) {
            this.fill_with_wildlife(this.market, wildlife_specifications);
        },
        setup_market_tiles(tile_specifications) {
            this.fill_with_tiles(this.market, tile_specifications);
        },

        // Common
        fill_with_wildlife(wildlife_container, wildlife_specifications) {
            for (var index in wildlife_specifications)
                wildlife_container.populate(this.wildlife_factory.create(wildlife_specifications[index]));
        },
        fill_with_tiles(tile_container, tile_specifications) {
            for (var index in tile_specifications)
                tile_container.place(this.habitat_tile_factory.create(tile_specifications[index]));
        },
    });
});
