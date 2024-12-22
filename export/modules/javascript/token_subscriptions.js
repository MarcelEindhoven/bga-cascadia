define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.token_subscriptions', null, {
        /**
         * Use case game object calls subscribe(token, object, method)
         * token.mark_as_selectable if only subscription for that token
         * 
         * Use case game object calls unsubscribe(token, object, method)
         * token.unmark_as_selectable if no more subscriptions for that token
         * 
         * Note that each subscribe must be followed by a corresponding unsubscribe
         * 
         * Use case player selects a token
         * subscription.object[subscription.method](subscription.token); for each subscription that matches unique_id
         * 
         * Each token must have the attribute unique_id and the following methods
         * - mark_as_selectable
         * - unmark_as_selectable
         */
        constructor() {
            this.subscriptions = [];
        },
        subscribe(token, object, method) {
            if (! this.is_token_in_subscriptions(token))
                token.mark_as_selectable();

            subscription = {token: token, object: object, method: method};
            this.subscriptions.push(subscription);
        },
        unsubscribe(token, object, method) {
            console.log(token);
            this.subscriptions = this.subscriptions.filter(e => e.method != method || e.object !== object || e.token !== token);
            if (! this.is_token_in_subscriptions(token))
                token.unmark_as_selectable();
        },
        is_token_in_subscriptions(token) {
            for (index in this.subscriptions)
                if (token.unique_id == this.subscriptions[index].token.unique_id)
                    return true;
            return false;
        },
        token_selected(event) {
            console.log('token_selected');
            console.log(event);
            id_selected_token = event.currentTarget.id;
            // Copy array to allow unsubscribe from callback
            subscriptions = Array.from(this.subscriptions);
            for (index in subscriptions) {
                subscription = subscriptions[index];
                console.log(subscription);
                if (id_selected_token == subscription.token.unique_id) {
                    console.log('subscription selected');
                    console.log(subscription);
                            subscription.object[subscription.method](subscription.token);
                }
            }
        },
    });
});
