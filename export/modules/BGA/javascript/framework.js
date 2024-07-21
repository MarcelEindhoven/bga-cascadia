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
    });
});
