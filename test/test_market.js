var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/javascript/market.js');

describe('market', function () {
    beforeEach(function() {
        player_id = 125;
        sut = new sut_module(player_id);

        framework = {
            classify: sinon.spy(),
            mark_as_selectable: sinon.spy(),
            resize: sinon.spy(),
        };
        sut.setFramework(framework);

        tile_handler = {
            move_and_rotate: sinon.spy(),
            move: sinon.spy(),
        };
        sut.setTileHandler(tile_handler);

        token_subscriptions = {
            subscribe: sinon.spy(),
            unsubscribe: sinon.spy(),
        };
        sut.set_token_subscriptions(token_subscriptions);

        tile = {id: 2, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 50, unique_id: 'tile2'};
        other_tile = {id: 22, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 51};

        expected_tile_id = 'tile' + tile.id;
        expected_upper_half_id = 'upper_half' + tile.id;

        element = 'test ';
        minimum_size = 50;
        vertical_distance = 80;
        horizontal_distance = 24;
    });
    describe('Place tile', function () {
        function act_default(x) {
            sut.place(x);
            sut.paint();
        };
        it('Single tile', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            assert.equal(tile_handler.move.getCall(0).args.length, 2);
            assert.equal(tile_handler.move.getCall(0).args[0], tile);
            assert.equal(tile_handler.move.getCall(0).args[1], 'habitat_' + tile.location_arg);
        });
    });
    describe('Subscribe tile', function () {
        function act_default(x, object, method) {
            sut.place(x);
            sut.subscribe_tile_selected(object, method);
        };
        it('no tile', function () {
            // Arrange
            // Act
            sut.subscribe_tile_selected();
            // Assert
            sinon.assert.notCalled(token_subscriptions.subscribe);
        });
        it('Single tile', function () {
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
        it('Blinking tile', function () {
            // Arrange
            object = token_subscriptions;
            method = 'q';
            // Act
            act_default(tile, object, method);
            // Assert
            assert.equal(framework.mark_as_selectable.getCall(0).args.length, 1);
            assert.equal(framework.mark_as_selectable.getCall(0).args[0], tile.unique_id);
        });
    });
});
