define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.token_subscriptions', null, {
        constructor() {
            this.subscriptions = [];
        },
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
                    method = subscription.object[subscription.method];
                    method(subscription.object, subscription.token);
                }
            }
        },
    });
});
