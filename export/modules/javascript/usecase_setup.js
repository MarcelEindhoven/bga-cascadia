define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.usecase_setup', null, {
        /**
         * habitat_tile_factory.create()
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
            for (player_id in specification) {
                habitat = this.habitat_factory.create(player_id);
                tiles = specification[player_id];
                for (var index in tiles) {
                    t = this.habitat_tile_factory.create();
                    t.create(tiles[index]);
                    habitat.place(t);
                    
                }

                this.habitats[player_id] = habitat;
            }
        },
        get_habitats(){console.log (this.habitats);return this.habitats;},
    });
});
