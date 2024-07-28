define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.habitat_tiles', null, {
        constructor() {
        },
        setFramework(framework){this.framework = framework},

        create(tile){
            this.framework.createToken('field', 'tile' + tile.id, 'field' + tile.terrain_types[0]);
        },
    });
});
