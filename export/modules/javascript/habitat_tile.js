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
 * Precondition: tile.move has been called at least once
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

        /**
         * Create and subscribe
         */
        constructor(dependencies, tile_specification) {
            this.overrule(dependencies);
            this.create_from(tile_specification);
            this.rotation_number = this.rotation;
        },
        // tile_specification_example: {terrain_types: [1], supported_wildlife: [2], unique_id: 'tile_specification2', rotation: 5},
        create_from(tile_specification){
            this.overrule(tile_specification);

            // Note that the primary field token has the same unique_id as the tile, which is used in the subscribe
            this.framework.createToken('field', this.unique_id, 'field' + this.terrain_types[0]);
            if (this.hasMultipleTerrainTypes()) {
                this.framework.createToken('upper_half', this.getSecondTerrainTypeID(), 'field' + this.terrain_types[1]);
            }
            for (var wildlife_index in this.supported_wildlife) {
                this.framework.createToken('field_wildlife', this.getSupportedWildlifeID(wildlife_index), 'wildlife' + this.supported_wildlife[wildlife_index]);
            }
            
            this.framework.subscribe_paint(this);
        },
        overrule(properties){
            for (var property in properties) {
                this[property] = properties[property];
            }
        },
        subscribe_selected(object, method) {
            this.framework.permanent_subscribe(this.unique_id, object, method);
        },

        /**
         * Use case select market tile to place in habitat
         * This tile should be marked as selectable if it can be selected by the player
         * This tile should be unmarked as selectable when it can no longer be selected by the player (when the use case stops)
         */
        mark_as_selectable() {
            this.framework.add_css_class(this.unique_id, 'selectable');
        },
        /**
         * Precondition: tile was previously marked as selectable
         */
        unmark_as_selectable() {
            this.framework.remove_css_class(this.unique_id, 'selectable');
        },

        /**
         * Opposite of create
         */
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

        /**
         * Specify parameters used in paint
         */
        move: function(location, x = 0, y = 0) {
            this.location = location;
            this.x = x;
            this.y = y;
        },
        rotate: function() {
            if (this.rotation_number == undefined)
                this.rotation_number = 0;
            this.rotation_number = this.rotation_number + 1;
            if (this.rotation_number > 5)
                this.rotation_number = 0;
        },

        /**
         * Put tile on the board (required first time and after any layout change)
         */
        paint: function() {
            this.paint_terrain();
            this.paint_supported_wildlife();
            this.paint_rotation();
        },
        paint_terrain() {
            this.framework.move(this.unique_id, this.location, this.x, this.y);
            if (this.hasMultipleTerrainTypes()) {
                this.framework.move(this.getSecondTerrainTypeID(), this.unique_id);
            }
        },
        paint_supported_wildlife() {
            if (this.supported_wildlife[2] != undefined) {
                this.framework.move(this.getSupportedWildlifeID(0), this.unique_id, 0, -10);
                this.framework.move(this.getSupportedWildlifeID(1), this.unique_id, 10, 8);
                this.framework.move(this.getSupportedWildlifeID(2), this.unique_id, -10, 8);
            }
            else if (this.supported_wildlife[1] != undefined){
                this.framework.move(this.getSupportedWildlifeID(0), this.unique_id, 0, -10);
                this.framework.move(this.getSupportedWildlifeID(1), this.unique_id, 0, 10);
            }
            else {
                this.framework.move(this.getSupportedWildlifeID(0), this.unique_id);
            }
        },
        paint_rotation() {
            if (this.hasMultipleTerrainTypes() && (this.rotation_number != undefined) && (this.class_rotation != 'rotate' + this.rotation_number)) {
                if (this.class_rotation != undefined) {
                    this.framework.remove_css_class(this.getSecondTerrainTypeID(), this.class_rotation);
                }
                this.class_rotation = 'rotate' + this.rotation_number;
                this.framework.add_css_class(this.getSecondTerrainTypeID(), this.class_rotation);
            }
        },

        /**
         * Utility functions
         */
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
