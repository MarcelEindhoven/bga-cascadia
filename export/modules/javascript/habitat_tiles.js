define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.habitat_tiles', null, {
        constructor() {
            this.subscriptions = {};
        },
        setFramework(framework){this.framework = framework},

        create(tile){
            this.framework.createToken('field', tile.unique_id, 'field' + tile.terrain_types[0]);
            if (this.hasMultipleTerrainTypes(tile)) {
                this.framework.createToken('upper_half', this.getSecondTerrainTypeID(tile.id), 'field' + tile.terrain_types[1]);
            }
            for (var wildlife_index in tile.supported_wildlife) {
                this.framework.createToken('field_wildlife', this.getSupportedWildlifeID(tile.id, wildlife_index), 'wildlife' + tile.supported_wildlife[wildlife_index]);
            }
            this.framework.subscribe(tile.unique_id, this, 'tile_selected');
        },
        move: function(tile, element, x = 0, y = 0) {
            tile_id = tile.unique_id;
            this.framework.move(tile_id, element, x, y);
            if (this.hasMultipleTerrainTypes(tile)) {
                this.framework.move(this.getSecondTerrainTypeID(tile.id), tile_id);
            }
            for (var wildlife_index in tile.supported_wildlife) {
                this.framework.move(this.getSupportedWildlifeID(tile.id, wildlife_index), tile_id);
            }
        },
        move_and_rotate: function(tile, element, x, y) {
            this.move(tile, element, x, y);
            if (this.hasMultipleTerrainTypes(tile)) {
                this.framework.classify(this.getSecondTerrainTypeID(tile.id), 'rotate' + tile.rotation);
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
        subscribe(tile, object, method) {
            this.subscriptions[tile.unique_id] = {object: object, method: method};
        },
        unsubscribe(tile, object, method) {
            id = tile.unique_id;
            if (id in this.subscriptions) {
                delete this.subscriptions[id];
            }
        },
        tile_selected(event) {
            id = event.currentTarget.id;
            if (id in this.subscriptions) {
                subscription = this.subscriptions[id];
                method = subscription.object[subscription.method];
                method(id);
            }
        },
    });
});
