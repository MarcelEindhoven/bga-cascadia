var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/javascript/usecase_place_tile.js');

class habitat_tile_class {
    constructor(x, y) {
        habitat_tile_constructor (x, y);
        this.clone(y);
    }
    clone(properties){
        for (var property in properties) {
            this[property] = properties[property];
        }
    }
    destroy() {
        habitat_tile_destroy();
    }
};

describe('Use case select tile', function () {
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

        market = {
            subscribe_tile_selected: sinon.spy(),
            unsubscribe_tile_selected: sinon.spy(),
        };
        habitat_tile_constructor = sinon.spy();
        habitat_tile_destroy = sinon.spy();

        habitat_tile_factory = {class:habitat_tile_class, dependencies: 9, create: function(tile_specification) {return new this.class(this.dependencies, tile_specification);}};

        dependencies = {token_subscriptions: token_subscriptions, market: market, habitat_tile_factory: habitat_tile_factory, habitat: habitat};
        sut = new sut_module(dependencies);

        callback_object = {
            tile_placed: sinon.spy(),
        };

        tile = {id: 2, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 50, unique_id: 'tile2', destroy: habitat_tile_destroy};
    });
    describe('Subscribe', function () {
        function act_default(object, method) {
            sut.subscribe_tile_placed(object, method);
        };
        it('First subscribe, market subscribe', function () {
            // Arrange
            // Act
            act_default(callback_object, 'tile_placed');
            // Assert
            assert.equal(market.subscribe_tile_selected.getCall(0).args[0], sut);
            assert.equal(market.subscribe_tile_selected.getCall(0).args[1], 'market_tile_selected');
        });
        it('Second subscribe, only one market subscribe', function () {
            // Arrange
            // Act
            act_default(callback_object, 'tile_placed');
            act_default(callback_object, 'Another method');
            // Assert
            sinon.assert.callCount(market.subscribe_tile_selected, 1);
        });
    });
    describe('Candidate Tile selected', function () {
        beforeEach(function() {
            sut.set_candidate_positions([{horizontal: 50, vertical: 51}, {horizontal: 50, vertical: 52}]);
            sut.subscribe_tile_placed(callback_object, 'tile_placed');
            sut.market_tile_selected(tile);
        });
        function act_default(tile) {
            sut.candidate_tile_selected(tile);
        };
        it('Callback', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            assert.equal(callback_object.tile_placed.getCall(0).args[0], tile);
        });
        it('market unsubscribe', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            sinon.assert.callCount(market.unsubscribe_tile_selected, 1);
            assert.equal(market.unsubscribe_tile_selected.getCall(0).args[0], sut);
            assert.equal(market.unsubscribe_tile_selected.getCall(0).args[1], 'market_tile_selected');
        });
        it('habitat cleanup', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            sinon.assert.callCount(habitat.remove, 2);
        });
        it('token_subscriptions cleanup', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            sinon.assert.callCount(token_subscriptions.unsubscribe, 2);
        });
    });
    describe('Market Tile selected', function () {
        function act_default(positions, tile) {
            sut.set_candidate_positions(positions);
            sut.market_tile_selected(tile);
        };
        it('No candidate positions', function () {
            // Arrange
            // Act
            sut.market_tile_selected(tile);
            // Assert
        });
        it('Create tile', function () {
            // Arrange
            unique_id = tile.unique_id;
            // Act
            act_default([{horizontal: 52, vertical: 51}], tile);
            // Assert
            assert.equal(habitat_tile_constructor.getCall(0).args[1].vertical, 51);
            assert.equal(habitat_tile_constructor.getCall(0).args[1].horizontal, 52);
            assert.equal(habitat_tile_constructor.getCall(0).args[1].unique_id, unique_id+52+51);
            assert.equal(habitat_tile_constructor.getCall(0).args[1].terrain_types, tile.terrain_types);
            assert.equal(habitat_tile_constructor.getCall(0).args[1].supported_wildlife, tile.supported_wildlife);
        });
        it('Original tile unchanged', function () {
            // Arrange
            unique_id = tile.unique_id;
            vertical = tile.vertical;
            horizontal = tile.horizontal;
            // Act
            act_default([{horizontal: 52, vertical: 51}], tile);
            // Assert
            assert.equal(tile.horizontal, horizontal);
            assert.equal(tile.vertical, vertical);
            assert.equal(tile.unique_id, unique_id);
        });
        it('Propose tile', function () {
            // Arrange
            // Act
            act_default([{horizontal: 52, vertical: 51}], tile);
            // Assert
            assert.equal(habitat.place.getCall(0).args[0].vertical, 51);
            assert.equal(habitat.place.getCall(0).args[0].horizontal, 52);
            assert.equal(habitat.place.getCall(0).args[0].unique_id, unique_id+52+51);
        });
        it('Subscribe', function () {
            // Arrange
            // Act
            act_default([{horizontal: 50, vertical: 51}], tile);
            // Assert
            assert.equal(token_subscriptions.subscribe.getCall(0).args[0].unique_id, unique_id+50+51);
            assert.equal(token_subscriptions.subscribe.getCall(0).args[1], sut);
            assert.equal(token_subscriptions.subscribe.getCall(0).args[2], 'candidate_tile_selected');
        });
        it('Multiple candidate positions', function () {
            // Arrange
            // Act
            act_default([{horizontal: 50, vertical: 51}, {horizontal: 50, vertical: 51}], tile);
            // Assert
            sinon.assert.callCount(token_subscriptions.subscribe, 2);
            sinon.assert.callCount(habitat.place, 2);
            sinon.assert.callCount(habitat_tile_constructor, 2);
        });
        it('Market Tile selected again, so cleanup previous candidate tiles', function () {
            // Arrange
            // Act
            act_default([{horizontal: 50, vertical: 51}, {horizontal: 50, vertical: 51}], tile);
            sut.market_tile_selected(tile);
            // Assert
            sinon.assert.callCount(token_subscriptions.unsubscribe, 2);
            sinon.assert.callCount(habitat.remove, 2);
            sinon.assert.callCount(tile.destroy, 2);
            sinon.assert.callCount(market.unsubscribe_tile_selected, 0);
        });
        it('Market Tile selected again, so remove previous candidate tiles from object', function () {
            // Arrange
            // Act
            act_default([{horizontal: 50, vertical: 51}, {horizontal: 50, vertical: 51}], tile);
            sut.market_tile_selected(tile);
            sut.market_tile_selected(tile);
            // Assert
            sinon.assert.callCount(token_subscriptions.unsubscribe, 4);
            sinon.assert.callCount(habitat.remove, 4);
        });
    });
});
