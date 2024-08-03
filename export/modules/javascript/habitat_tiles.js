define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.habitat_tiles', null, {
        constructor() {
        },
        setFramework(framework){this.framework = framework},

        create(tile){
            this.framework.createToken('field', this.getTileID(tile.id), 'field' + tile.terrain_types[0]);
            if (this.hasMultipleTerrainTypes(tile)) {
                this.framework.createToken('upper_half', this.getSecondTerrainTypeID(tile.id), 'field' + tile.terrain_types[1]);
            }
            for (var wildlife_index in tile.supported_wildlife) {
                this.framework.createToken('field_wildlife', this.getSupportedWildlifeID(tile.id, wildlife_index), 'wildlife' + tile.supported_wildlife[wildlife_index]);
            }
        },
        move: function(tile, element, x = 0, y = 0) {
            tile_id = this.getTileID(tile.id);
            this.framework.move(tile_id, element, x, y);
            if (this.hasMultipleTerrainTypes(tile)) {
                this.framework.move(this.getSecondTerrainTypeID(tile.id), tile_id);
            }
            for (var wildlife_index in tile.supported_wildlife) {
                this.framework.move(this.getSupportedWildlifeID(tile.id, wildlife_index), tile_id);
            }
        },
        getTileID: function (id) {
            return 'tile'+ id;
        },
        getSecondTerrainTypeID: function (id) {
            return 'upper_half'+ id;
        },
        getSupportedWildlifeID: function (id, index) {
            return 'field_wildlife'+ index + id;
        },
        hasMultipleTerrainTypes(tile) {
            return typeof tile.terrain_types[1] != 'undefined';
        },
    });
});
