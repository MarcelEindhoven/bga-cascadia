define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.framework', null, {
        constructor() {
            this.ui_elements = [];
            this.ui_dirty = false;
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
        mark_as_selectable(id) {
            this.classify(id, selectable);
        },
        resize(id, width, height){
            this.toolkit.style(id, 'width', '' + width + 'px');
            this.toolkit.style(id, 'height', '' + height + 'px');
            this.ui_dirty = true;
        },
        subscribe(id, object, method) {
            this.toolkit.addClass(id, 'subscribe');
            this.toolkit.query('.subscribe').connect('onclick', object, method);
            this.toolkit.removeClass(id, 'subscribe');
        },
        add_ui_element(UI_element) {
            this.ui_elements.push(UI_element);
        },
        callback_control_will_be_returned_to_user(ths) {
            ths.control_will_be_returned_to_user();
        },
        control_will_be_returned_to_user() {
            console.log (this);
            if (this.ui_dirty) {
                for (index in this.ui_elements) {
                    ui_element = this.ui_elements[index];
                    ui_element.paint();
                }
    
                this.ui_dirty = false;
            }
        },
    });
});
