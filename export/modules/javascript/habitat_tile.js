/**
 * A tile is displayed as a stack of html tokens with css classes
 * Use case create:
 * tile = habitat_tile(dependencies, tile_specification);
 * tile.subscribe_selected(object, method);
 * 
 * Use case move:
 * tile.move(HTML ID, x = 0, y = 0);
 * 
 * Use case give control back to user:
 * tile.paint();
 */
define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.habitat_tile', null, {
        /**
         * Dependencies
         * framework.createToken
         * framework.destroyToken
         * framework.subscribe
         * framework.subscribe_paint
         * framework.unsubscribe_paint
         * framework.move
         * framework.add_css_class
         * framework.remove_css_class
         */
        constructor(dependencies, tile) {
            this.clone(dependencies);
            this.create(tile);
        },
        // tile_example: {terrain_types: [1], supported_wildlife: [2], unique_id: 'tile2', rotation: 5},
        create(tile){
            this.clone(tile);

            this.framework.createToken('field', this.unique_id, 'field' + this.terrain_types[0]);
            if (this.hasMultipleTerrainTypes()) {
                this.framework.createToken('upper_half', this.getSecondTerrainTypeID(), 'field' + this.terrain_types[1]);
            }
            for (var wildlife_index in this.supported_wildlife) {
                this.framework.createToken('field_wildlife', this.getSupportedWildlifeID(wildlife_index), 'wildlife' + this.supported_wildlife[wildlife_index]);
            }
            
            this.framework.subscribe_paint(this);
        },
        clone(properties){
            for (var property in properties) {
                this[property] = properties[property];
            }
        },
        destroy(){
            this.framework.unsubscribe_paint(this);

            this.framework.destroyToken(this.unique_id);
            if (this.hasMultipleTerrainTypes()) {
                this.framework.destroyToken(this.getSecondTerrainTypeID());
            }
            for (var wildlife_index in this.supported_wildlife) {
                this.framework.destroyToken(this.getSupportedWildlifeID(wildlife_index));
            }
        },
        subscribe_selected(object, method) {
            this.framework.subscribe(this.unique_id, object, method);
        },
        move: function(element, x = 0, y = 0) {
            this.element = element;
            this.x = x;
            this.y = y;
        },
        paint: function() {
            this.paint_terrain();
            this.paint_wildlife();
            this.paint_rotation();
        },
        paint_terrain() {
            this.framework.move(tile.unique_id, this.element, this.x, this.y);
            if (this.hasMultipleTerrainTypes()) {
                this.framework.move(this.getSecondTerrainTypeID(), tile.unique_id);
            }
        },
        paint_wildlife() {
            if (tile.supported_wildlife[2] != undefined) {
                this.framework.move(this.getSupportedWildlifeID(0), tile.unique_id, 0, -10);
                this.framework.move(this.getSupportedWildlifeID(1), tile.unique_id, 10, 8);
                this.framework.move(this.getSupportedWildlifeID(2), tile.unique_id, -10, 8);
            }
            else if (tile.supported_wildlife[1] != undefined){
                this.framework.move(this.getSupportedWildlifeID(0), tile.unique_id, 0, -10);
                this.framework.move(this.getSupportedWildlifeID(1), tile.unique_id, 0, 10);
            }
            else {
                this.framework.move(this.getSupportedWildlifeID(0), tile.unique_id);
            }
        },
        paint_rotation() {
            if (this.hasMultipleTerrainTypes() && (this.rotation != undefined) && (this.class_rotation != 'rotate' + this.rotation)) {
                if (this.class_rotation != undefined) {
                    this.framework.remove_css_class(this.getSecondTerrainTypeID(), this.class_rotation);
                }
                this.class_rotation = 'rotate' + this.rotation;
                this.framework.add_css_class(this.getSecondTerrainTypeID(), this.class_rotation);
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
