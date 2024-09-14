define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.habitat_tiles', null, {
        constructor() {
        },
        setFramework(framework){this.framework = framework},
        set_token_subscriptions(token_subscriptions){this.token_subscriptions = token_subscriptions},

        create(tile){
            this.framework.createToken('field', tile.unique_id, 'field' + tile.terrain_types[0]);
            if (this.hasMultipleTerrainTypes(tile)) {
                this.framework.createToken('upper_half', this.getSecondTerrainTypeID(tile.unique_id), 'field' + tile.terrain_types[1]);
            }
            for (var wildlife_index in tile.supported_wildlife) {
                this.framework.createToken('field_wildlife', this.getSupportedWildlifeID(tile.unique_id, wildlife_index), 'wildlife' + tile.supported_wildlife[wildlife_index]);
            }
            console.log(tile);
            this.framework.subscribe(tile.unique_id, this.token_subscriptions, 'token_selected');
        },
        destroy(tile){
            this.framework.destroyToken(tile.unique_id);
            if (this.hasMultipleTerrainTypes(tile)) {
                this.framework.destroyToken(this.getSecondTerrainTypeID(tile.unique_id));
            }
            for (var wildlife_index in tile.supported_wildlife) {
                this.framework.destroyToken(this.getSupportedWildlifeID(tile.unique_id, wildlife_index));
            }
        },
        mark_as_selectable: function(tile) {
            this.framework.mark_as_selectable(tile.unique_id);
        },
        move: function(tile, element, x = 0, y = 0) {
            tile_id = tile.unique_id;
            this.framework.move(tile_id, element, x, y);
            if (this.hasMultipleTerrainTypes(tile)) {
                this.framework.move(this.getSecondTerrainTypeID(tile.unique_id), tile_id);
            }
            if (tile.supported_wildlife[2] != undefined) {
                this.framework.move(this.getSupportedWildlifeID(tile.unique_id, 0), tile_id, 0, -10);
                this.framework.move(this.getSupportedWildlifeID(tile.unique_id, 1), tile_id, 10, 8);
                this.framework.move(this.getSupportedWildlifeID(tile.unique_id, 2), tile_id, -10, 8);
            }
            else if (tile.supported_wildlife[1] != undefined){
                this.framework.move(this.getSupportedWildlifeID(tile.unique_id, 0), tile_id, 0, -10);
                this.framework.move(this.getSupportedWildlifeID(tile.unique_id, 1), tile_id, 0, 10);
            }
            else {
                this.framework.move(this.getSupportedWildlifeID(tile.unique_id, 0), tile_id);
            }
        },
        move_and_rotate: function(tile, element, x, y) {
            this.move(tile, element, x, y);
            if (this.hasMultipleTerrainTypes(tile)) {
                this.framework.classify(this.getSecondTerrainTypeID(tile.unique_id), 'rotate' + tile.rotation);
            }
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
