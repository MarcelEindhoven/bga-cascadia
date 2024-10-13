define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.token_subscriptions', null, {
        /**
         * Use case subscribe(token, object, method)
         * token.mark_as_selectable if only subscription for that token
         * 
         * Use case unsubscribe(token, object, method)
         * token.unmark_as_selectable if no more subscriptions for that token
         * 
         * Note that each subscribe must be followed by an unsubscribe
         * 
         * Use case token selected
         * subscription.object[subscription.method](subscription.token);
         */
        constructor() {
            this.subscriptions = [];
        },
        setFramework(framework){this.framework = framework},
        subscribe(token, object, method) {
            subscription = {token: token, object: object, method: method};
            this.subscriptions.push(subscription);
        },
        unsubscribe(token, object, method) {
            this.subscriptions = this.subscriptions.filter(e => e.method != method || e.object !== object || e.token !== token);
        },
        token_selected(event) {
            id = event.currentTarget.id;
            for (index in this.subscriptions) {
                subscription = this.subscriptions[index];
                if (id == subscription.token.unique_id) {
                    subscription.object[subscription.method](subscription.token);
                }
            }
        },
    });
});
