define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.framework', null, {
        constructor() {
        },
        setDojo(toolkit){this.toolkit = toolkit},
        setGameGUI(dom){this.dom = dom},

        createToken(category, id, type){
            block = this.dom.format_block(category, {token_id: id});
            this.toolkit.place(block, 'tokens');
            this.toolkit.addClass(id, type);
        },
        move(id_to_move, destination_id, x = 0, y = 0){
            if (x != 0 || y != 0) {
                this.dom.placeOnObjectPos(id_to_move, destination_id, x, y);
            } else {
                this.dom.placeOnObject(id_to_move, destination_id);
            }
        },
        classify(id, type){
            this.toolkit.addClass(id, type);
        },
        resize(id, width, height){
            this.toolkit.style(id, 'width', '' + width + 'px');
            this.toolkit.style(id, 'height', '' + height + 'px');
        },
    });
});
