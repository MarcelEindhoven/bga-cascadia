define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.habitat_tile', null, {
        dependencies: {framework: null, token_subscriptions: null},
        constructor(dependencies) {
            this.clone(dependencies);
        },
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
        getSecondTerrainTypeID: function () {
            return 'upper_half'+ this.unique_id;
        },
        getSupportedWildlifeID: function (index) {
            return 'field_wildlife'+ index + this.unique_id;
        },
        hasMultipleTerrainTypes() {
            return typeof this.terrain_types[1] != 'undefined';
        },
    });
});
