define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.habitat_tile', null, {
        dependencies: {framework: null, token_subscriptions: null},
        constructor(dependencies) {
            this.clone(dependencies);
        },
        tile_example: {id: 2, terrain_types: [1], supported_wildlife: [2], unique_id: 'tile2',},
        create(tile){
            this.clone(tile);
            this.framework.createToken('field', this.unique_id, 'field' + this.terrain_types[0]);
            if (this.hasMultipleTerrainTypes()) {
                this.framework.createToken('upper_half', this.getSecondTerrainTypeID(), 'field' + this.terrain_types[1]);
            }
            for (var wildlife_index in this.supported_wildlife) {
                this.framework.createToken('field_wildlife', this.getSupportedWildlifeID(wildlife_index), 'wildlife' + this.supported_wildlife[wildlife_index]);
            }
            this.framework.subscribe(this.unique_id, this.token_subscriptions, 'token_selected');
            this.framework.add_ui_element(this);
        },
        clone(properties){
            for (var property in properties) {
                this[property] = properties[property];
            }
        },
        destroy(){
            this.framework.destroyToken(this.unique_id);
            if (this.hasMultipleTerrainTypes()) {
                this.framework.destroyToken(this.getSecondTerrainTypeID());
            }
            for (var wildlife_index in this.supported_wildlife) {
                this.framework.destroyToken(this.getSupportedWildlifeID(wildlife_index));
            }
        },
        move: function(element, x = 0, y = 0) {
            this.element = element;
            this.x = x;
            this.y = y;
        },
        paint: function() {
            tile_id = tile.unique_id;
            this.framework.move(tile_id, this.element, this.x, this.y);
            if (this.hasMultipleTerrainTypes()) {
                this.framework.move(this.getSecondTerrainTypeID(), tile_id);
            }
            if (tile.supported_wildlife[2] != undefined) {
                this.framework.move(this.getSupportedWildlifeID(0), tile_id, 0, -10);
                this.framework.move(this.getSupportedWildlifeID(1), tile_id, 10, 8);
                this.framework.move(this.getSupportedWildlifeID(2), tile_id, -10, 8);
            }
            else if (tile.supported_wildlife[1] != undefined){
                this.framework.move(this.getSupportedWildlifeID(0), tile_id, 0, -10);
                this.framework.move(this.getSupportedWildlifeID(1), tile_id, 0, 10);
            }
            else {
                this.framework.move(this.getSupportedWildlifeID(0), tile_id);
            }
        },
        getSecondTerrainTypeID: function () {
            return 'upper_half'+ this.unique_id;
        },
        getSupportedWildlifeID: function (index) {
            return 'field_wildlife'+ index + this.unique_id;
        },
        hasMultipleTerrainTypes() {
            return this.terrain_types[1] != undefined;
        },
    });
});
