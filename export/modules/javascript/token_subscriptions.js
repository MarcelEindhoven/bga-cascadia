define(['dojo/_base/declare'], (declare) => {
    return declare('cascadia.token_subscriptions', null, {
        constructor() {
            this.subscriptions = [];
        },
        subscribe(token, object, method) {
            subscription = {token: token, object: object, method: method};
            console.log(subscription);
            this.subscriptions.push(subscription);
            console.log(this.subscriptions);
        },
        unsubscribe(token, object, method) {
            this.subscriptions = this.subscriptions.filter(e => e.method != method || e.object !== object || e.token !== token);
        },
        token_selected(event) {
            id = event.currentTarget.id;
            for (index in this.subscriptions) {
                subscription = this.subscriptions[index];
                if (id == subscription.token.unique_id) {
                    console.log ('call '+ id + ' method '+ subscription.method + 'index '+ index);
                    console.log(subscription.object);
                    method = subscription.object[subscription.method];
                    method(subscription.object, subscription.token);
                }
            }
        },
    });
});
