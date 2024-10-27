define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.framework', null, {
        constructor() {
            this.ui_elements = [];
        },
        setDojo(toolkit){this.toolkit = toolkit},
        setGameGUI(dom){this.dom = dom},

        createToken(category, id, type){
            block = this.dom.format_block(category, {token_id: id});
            this.toolkit.place(block, 'tokens');
            this.toolkit.addClass(id, type);
        },
        destroyToken(id) {
            this.toolkit.destroy(id);
        },
        move(id_to_move, destination_id, x = 0, y = 0){
            //console.log ('move '+ id_to_move + ', '+ destination_id + ', '+ x + ', ' + y);
            if (x != 0 || y != 0) {
                this.dom.placeOnObjectPos(id_to_move, destination_id, x, y);
            } else {
                this.dom.placeOnObject(id_to_move, destination_id);
            }
        },
        add_css_class(id, type){
            this.toolkit.addClass(id, type);
        },
        remove_css_class(id, type){
            this.toolkit.removeClass(id, type);
        },
        mark_as_selectable(id) {
            this.add_css_class(id, 'selectable');
        },
        resize(id, width, height){
            this.toolkit.style(id, 'width', '' + width + 'px');
            this.toolkit.style(id, 'height', '' + height + 'px');
        },
        permanent_subscribe(id, object, method) {
            this.toolkit.addClass(id, 'subscribe');
            this.toolkit.query('.subscribe').connect('onclick', object, method);
            this.toolkit.removeClass(id, 'subscribe');
        },
        subscribe_paint(UI_element) {
            this.ui_elements.push(UI_element);
        },
        unsubscribe_paint(UI_element) {
            this.ui_elements.splice(this.ui_elements.indexOf(UI_element), 1);
        },
        event_has_been_handled(event) {event.preventDefault(); event.stopPropagation();},
        control_may_be_returned_to_user() {
            console.log ('control_may_be_returned_to_user');
            for (index in this.ui_elements) {
                ui_element = this.ui_elements[index];
                ui_element.paint();
            }
        },
    });
});
