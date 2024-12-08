/**
 * A wildlife is displayed as a stack of html tokens with css classes
 * Use case create:
 * wildlife = wildlife(dependencies, wildlife_specification);
 * wildlife.subscribe_selected(object, method);
 * 
 * Use case move:
 * wildlife.move(HTML ID, x = 0, y = 0);
 * 
 * Use case give control back to user:
 * Precondition: wildlife.move has been called at least once
 * wildlife.paint();
 */
define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.wildlife', null, {
        /**
         * Dependencies
         * framework.createToken
         * framework.destroyToken
         * framework.subscribe
         * framework.subscribe_paint
         * framework.unsubscribe_paint
         * framework.move
         * framework.add_css_class
         * framework.remove_css_class
         */
        constructor(dependencies, wildlife) {
            this.clone(dependencies);
            this.create(wildlife);
        },
        create(wildlife){
            this.clone(wildlife);

            this.framework.createToken('wildlife', this.unique_id, 'wildlife' + this.type);
            
            this.framework.subscribe_paint(this);
        },
        clone(properties){
            for (var property in properties) {
                this[property] = properties[property];
            }
        },
        destroy(){
            this.framework.unsubscribe_paint(this);

            this.framework.destroyToken(this.unique_id);
        },
        subscribe_selected(object, method) {
            this.framework.permanent_subscribe(this.unique_id, object, method);
        },
        move: function(location, x = 0, y = 0) {
            this.location = location;
            this.x = x;
            this.y = y;
        },
        paint: function() {
            this.framework.move(this.unique_id, this.location, this.x, this.y);
        },
    });
});
