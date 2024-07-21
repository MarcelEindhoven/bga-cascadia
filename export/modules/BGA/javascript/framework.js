define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.framework', null, {
        constructor() {
        },
        setDojo(toolkit){this.toolkit = toolkit},
        setGameGUI(dom){this.dom = dom},

        createToken(type, id){
            block = this.dom.format_block(type, {token_id: id});
            this.toolkit.place(block, 'tokens');
        },
        move(id_to_move, destination_id, x = 0, y = 0){
            if (x != 0 || y != 0) {
                this.dom.placeOnObjectPos(id_to_move, destination_id, x, y);
            } else {
                this.dom.placeOnObject(id_to_move, destination_id);
            }
        },
    });
});
