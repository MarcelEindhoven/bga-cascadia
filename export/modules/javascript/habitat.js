define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.habitat', null, {
        constructor(id) {
            this.id = '' + id;
            this.tiles = [];
            this.vertical_minimum = 50;
            this.vertical_maximum = 50;
            this.horizontal_minimum = 50;
            this.horizontal_maximum = 50;
        },
        setFramework(framework){this.framework = framework},
        setTileHandler(tile_handler){this.tile_handler = tile_handler;},

        place(tile) {
            this.tiles[tile.id] = tile;
            this.resize();
            this.tile_handler.move(tile, this.id, x = 0, y = 0);
        },
        resize() {
            vertical_minimum = 50;
            vertical_maximum = 50;
            horizontal_minimum = 50;
            horizontal_maximum = 50;
            for (id in this.tiles) {
                horizontal = this.tiles[id].horizontal;
                vertical = this.tiles[id].vertical;
                if (horizontal % 2) {vertical = vertical - 0.5;}
                if (vertical <vertical_minimum) {vertical_minimum = vertical;} else if (vertical >vertical_maximum) {vertical_maximum = vertical;}
                if (horizontal <horizontal_minimum) {horizontal_minimum = horizontal;} else if (horizontal >horizontal_maximum) {horizontal_maximum = horizontal;}
            }
            if ( (vertical_minimum < this.vertical_minimum)|| (vertical_maximum > this.vertical_maximum) || (horizontal_minimum < this.horizontal_minimum) || (horizontal_maximum > this.horizontal_maximum)) {
                if (horizontal_maximum > this.horizontal_maximum) {
                    this.horizontal_maximum = horizontal_maximum;
                }
                if (horizontal_minimum < this.horizontal_minimum) {
                    this.horizontal_minimum = horizontal_minimum;                    
                }
                if (vertical_maximum > this.vertical_maximum) {
                    this.vertical_maximum = vertical_maximum;
                }
                if (vertical_minimum < this.vertical_minimum) {
                    this.vertical_minimum = vertical_minimum;
                }
                this.framework.resize(this.id, 25 + 24 * (this.horizontal_maximum - this.horizontal_minimum), 25 + 80 *(this.vertical_maximum - this.vertical_minimum));
            }
            

        },
    });
});
