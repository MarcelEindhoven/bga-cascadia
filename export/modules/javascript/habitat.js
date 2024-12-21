const { NUMPAD_0 } = require("dojo/keys");

/**
 * Habitat html size and habitat element relative coordinates
 * Use cases place permanent/proposed tile, remove proposed tile
 */
define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.habitat', null, {
        minimum_size : 50,
        vertical_distance : 80,
        horizontal_distance : 24,
        /**
         * Dependencies
         * framework.resize
         * tile/wildlife.move
         */
        constructor(dependencies, id) {
            this.clone(dependencies);

            this.id = '' + id;

            this.tiles = [],
            this.x_minimum = 5000000;
            this.x_maximum = 0;
            this.y_minimum = 5000000;
            this.y_maximum = 0;
        },
        clone(properties){
            for (var property in properties) {
                this[property] = properties[property];
            }
        },

        remove(tile) {
            delete this.tiles[tile.unique_id];
        },

        populate(wildlife) {
            wildlife.move(wildlife.tile_unique_id);
        },
        /**
         * Use case: make tiles selectable that support chosen wildlife
         */
        subscribe_tile_selected_for_wildlife(wildlife, object, method) {
            for (index in this.tiles) {
                tile = this.tiles[index];
                if (tile.supported_wildlife)
                    if (tile.supported_wildlife.includes(Number(wildlife.type)))
                        this.token_subscriptions.subscribe(tile, object, method);
            }
        },
        unsubscribe_tile_selected_for_wildlife(wildlife, object, method) {
            for (index in this.tiles) {
                tile = this.tiles[index];
                if (tile.supported_wildlife)
                    if (tile.supported_wildlife.includes(Number(wildlife.type)))
                        this.token_subscriptions.unsubscribe(tile, object, method);
            }
        },
        /**
         * Use case: place permanent or temporary tile or wildlife
         * tile_example = {unique_id:1, horizontal: 50, vertical: 50, move: function(this.id, x , y)}
         * Postcondition: tile.move has been called
         * Postcondition: all tiles fit within habitat
         */
        place(tile) {
            this.resize_if_tile_outside_boundary(tile);
            this.tiles[tile.unique_id] = tile;
            this.relocate(tile);
        },
        resize_if_tile_outside_boundary(tile) {
            const [x, y] = this.getAbsoluteCoordinates(tile.horizontal, tile.vertical);
            if ( this.is_resize_needed(x, y) )
                this.resize(x, y);
        },
        resize(new_x, new_y) {
            this.adjust_boundary(new_x, new_y);
            this.framework.resize(this.id, this.minimum_size + this.x_maximum - this.x_minimum, this.minimum_size + this.y_maximum - this.y_minimum);
            this.relocate_tiles();
        },
        is_resize_needed(new_x, new_y) {
            return (new_y < this.y_minimum) || (new_y > this.y_maximum) || (new_x < this.x_minimum) || (new_x > this.x_maximum);
        },
        adjust_boundary(new_x, new_y) {
            if (new_x > this.x_maximum) {
                this.x_maximum = new_x;
            }
            if (new_x < this.x_minimum) {
                this.x_minimum = new_x;                    
            }
            if (new_y > this.y_maximum) {
                this.y_maximum = new_y;
            }
            if (new_y < this.y_minimum) {
                this.y_minimum = new_y;
            }
        },
        relocate_tiles() {
            for (index in this.tiles)
                this.relocate(this.tiles[index]);
        },
        relocate(tile) {
            const y_centre = (this.y_maximum + this.y_minimum)/2;
            const x_centre = (this.x_maximum + this.x_minimum)/2;
            const [x, y] = this.getAbsoluteCoordinates(tile.horizontal, tile.vertical);
            tile.move(this.id, x - x_centre, y - y_centre);
        },
        getAbsoluteCoordinates(horizontal, vertical) {
            x = horizontal* this.horizontal_distance;
            y = vertical*this.vertical_distance;
            if (horizontal % 2) {y = y - this.vertical_distance/2;}
            return [x, y];
        },
    });
});
