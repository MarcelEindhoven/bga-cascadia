/**
 * Habitat html size and habitat element relative coordinates
 * Use cases place permanent/proposed tile, remove proposed tile
 */
define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.habitat', null, {
        minimum_size : 50,
        vertical_distance : 80,
        horizontal_distance : 24,
        constructor(dependencies, id) {
        /**
         * Dependencies
         * framework.resize
         */
        this.clone(dependencies);

            this.id = '' + id;

            this.tiles = [];
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

        // tile_example = {unique_id:1, horizontal: 50, vertical: 50, move: function(this.id, x , y)}
        place(tile) {
            this.tiles[tile.unique_id] = tile;
            this.resize(tile);
        },
        remove(tile) {
            delete this.tiles[tile.unique_id];
        },
        resize(tile) {
            const [x, y] = this.getAbsoluteCoordinates(tile.horizontal, tile.vertical);
            if ( (y < this.y_minimum) || (y > this.y_maximum) || (x < this.x_minimum) || (x > this.x_maximum)) {
                this.adjust_boundaries(x, y);
                this.framework.resize(this.id, this.minimum_size + this.x_maximum - this.x_minimum, this.minimum_size + this.y_maximum - this.y_minimum);
                this.relocate_tiles();
            }
        },
        adjust_boundaries(x, y) {
            if (x > this.x_maximum) {
                this.x_maximum = x;
            }
            if (x < this.x_minimum) {
                this.x_minimum = x;                    
            }
            if (y > this.y_maximum) {
                this.y_maximum = y;
            }
            if (y < this.y_minimum) {
                this.y_minimum = y;
            }
        },
        relocate_tiles() {
            const y_centre = (this.y_maximum + this.y_minimum)/2;
            const x_centre = (this.x_maximum + this.x_minimum)/2;
            for (index in this.tiles) {
                tile = this.tiles[index];
                const [x, y] = this.getAbsoluteCoordinates(tile.horizontal, tile.vertical);
                tile.move(this.id, x - x_centre, y - y_centre);
            }
        },
        getAbsoluteCoordinates(horizontal, vertical) {
            x = horizontal* this.horizontal_distance;
            y = vertical*this.vertical_distance;
            if (horizontal % 2) {y = y - this.vertical_distance/2;}
            return [x, y];
        },
    });
});
