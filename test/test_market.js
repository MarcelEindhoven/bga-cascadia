var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/javascript/market.js');

describe('market', function () {
    beforeEach(function() {
        sut = new sut_module();

        token_subscriptions = {
            subscribe: sinon.spy(),
            unsubscribe: sinon.spy(),
        };
        sut.set_token_subscriptions(token_subscriptions);

        tile = {move: sinon.spy(), id: 2, location_arg: 3, terrain_types: [1], supported_wildlife: [2], unique_id: 'tile2'};
        other_tile = {move: sinon.spy(), id: 22, location_arg: 1, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 51};

        wildlife = {move: sinon.spy(), id: 2, location_arg: 3, unique_id: 'wildlife2'};
        other_wildlife = {move: sinon.spy(), id: 1, location_arg: 1, unique_id: 'wildlife1'};
    });
    describe('Place tile', function () {
        function act_default(x) {
            sut.place(x);
        };
        it('When the server places an object in the market, pass the row and column as one ID to the object which takes care of the actual placement on the board', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            assert.equal(tile.move.getCall(0).args.length, 1);
            assert.equal(tile.move.getCall(0).args[0], 'habitat_' + tile.location_arg);
        });
    });
    describe('When tile is removed', function () {
        function act_default(x) {
            return sut.remove_tile(x);
        };
        it('is no longer in the market', function () {
            // Arrange
            sut.place(tile);
            // Act
            act_default({id: 2, unique_id: 'tile2'});
            // Assert
            sut.subscribe_tile_selected();
            sinon.assert.notCalled(token_subscriptions.subscribe);
        });
        it('returns the removed tile', function () {
            // Arrange
            sut.place(tile);
            // Act
            returned_tile = act_default({id: 2, unique_id: 'tile2'});
            // Assert
            assert.equal(tile, returned_tile);
        });
    });
    describe('Place wildlife', function () {
        function act_default(x) {
            sut.populate(x);
        };
        it('When the server places an object in the market, pass the row and column as one ID to the object which takes care of the actual placement on the board', function () {
            // Arrange
            // Act
            act_default(wildlife);
            // Assert
            assert.equal(wildlife.move.getCall(0).args.length, 1);
            assert.equal(wildlife.move.getCall(0).args[0], 'wildlife_' + wildlife.location_arg);
        });
    });
    describe('Get wildlife', function () {
        function act_default(x) {
            return sut.get_wildlife_from_combination_with(x);
        };
        it('matches wildlife with tile for only one tile and one wildlife', function () {
            // Arrange
            sut.place(tile);
            sut.populate(wildlife);
            // Act
            retrieved_wildlife = act_default(tile);
            // Assert
            assert.equal(retrieved_wildlife, wildlife);
        });
        it('matches wildlife with tile for multiple wildlife', function () {
            // Arrange
            sut.place(tile);
            sut.populate(other_wildlife);
            sut.populate(wildlife);
            // Act
            retrieved_wildlife = act_default(tile);
            // Assert
            assert.equal(retrieved_wildlife, wildlife);
        });
    });
    describe('Subscribe', function () {
        function act_default(x, object, method) {
            sut.place(x);
            sut.subscribe_tile_selected(object, method);
        };
        it('Empty market has no effect when a subscribe is called', function () {
            // Arrange
            // Act
            sut.subscribe_tile_selected();
            // Assert
            sinon.assert.notCalled(token_subscriptions.subscribe);
        });
        it('Each market tile must become selectable by the player', function () {
            // Arrange
            object = token_subscriptions;
            method = 'q';
            // Act
            act_default(tile, object, method);
            // Assert
            assert.equal(token_subscriptions.subscribe.getCall(0).args.length, 3);
            assert.equal(token_subscriptions.subscribe.getCall(0).args[0], tile);
            assert.equal(token_subscriptions.subscribe.getCall(0).args[1], object);
            assert.equal(token_subscriptions.subscribe.getCall(0).args[2], method);
        });
    });
    describe('Unsubscribe', function () {
        function act_default(x, object, method) {
            sut.place(x);
            sut.unsubscribe_tile_selected(object, method);
        };
        it('Each market tile must be unsubscribed when the subscriber is no longer interested', function () {
            // Arrange
            object = token_subscriptions;
            method = 'q';
            // Act
            act_default(tile, object, method);
            // Assert
            assert.equal(token_subscriptions.unsubscribe.getCall(0).args.length, 3);
            assert.equal(token_subscriptions.unsubscribe.getCall(0).args[0], tile);
            assert.equal(token_subscriptions.unsubscribe.getCall(0).args[1], object);
            assert.equal(token_subscriptions.unsubscribe.getCall(0).args[2], method);
        });
    });
});
