var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/javascript/usecase_place_wildlife.js');

describe('Use case place wildlife', function () {
    beforeEach(function() {
        token_subscriptions = {
            subscribe: sinon.spy(),
            unsubscribe: sinon.spy(),
        };

        habitat = {
            place: sinon.spy(),
            remove: sinon.spy(),
            populate: sinon.spy(),
        };

        dependencies = {token_subscriptions: token_subscriptions, market: market, habitat: habitat};
        sut = new sut_module(dependencies);

        callback_object = {
            wildlife_placed: sinon.spy(),
        };

        wildlife = {id: 2, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 50, unique_id: 'wildlife2', };
    });
});
