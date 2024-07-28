define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.habitat_tiles', null, {
        constructor() {
        },
        setFramework(framework){this.framework = framework},

        create(tile){
            this.framework.createToken('field', 'tile' + tile.id, 'field' + tile.terrain_types[0]);
            if (typeof tile.terrain_types[1] != 'undefined') {
                this.framework.createToken('upper_half', 'upper_half' + tile.id, 'field' + tile.terrain_types[1]);
            }
            for (var wildlife_index in tile.supported_wildlife) {
                this.framework.createToken('field_wildlife', 'field_wildlife' + wildlife_index + tile.id, 'wildlife' + tile.supported_wildlife[wildlife_index]);
            }
        },
    });
});
