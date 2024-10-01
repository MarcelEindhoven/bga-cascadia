var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/javascript/market.js');

describe('market', function () {
    beforeEach(function() {
        player_id = 125;
        sut = new sut_module(player_id);

        framework = {
            add_css_class: sinon.spy(),
            mark_as_selectable: sinon.spy(),
            resize: sinon.spy(),
        };
        sut.setFramework(framework);

        tile_handler = {
            mark_as_selectable: sinon.spy(),
            move_and_rotate: sinon.spy(),
            move: sinon.spy(),
        };
        sut.setTileHandler(tile_handler);

        token_subscriptions = {
            subscribe: sinon.spy(),
            unsubscribe: sinon.spy(),
        };
        sut.set_token_subscriptions(token_subscriptions);

        tile = {move: sinon.spy(), id: 2, location_arg: 2, terrain_types: [1], supported_wildlife: [2], unique_id: 'tile2'};
        other_tile = {move: sinon.spy(), id: 22, location_arg: 1, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 51};

        wildlife = {move: sinon.spy(), id: 2, location_arg: 3, unique_id: 'wildlife2'};

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
        };
        it('Single tile', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            assert.equal(tile.move.getCall(0).args.length, 1);
            assert.equal(tile.move.getCall(0).args[0], 'habitat_' + tile.location_arg);
        });
    });
    describe('Place wildlife', function () {
        function act_default(x) {
            sut.populate(x);
        };
        it('Single wildlife', function () {
            // Arrange
            // Act
            act_default(wildlife);
            // Assert
            assert.equal(wildlife.move.getCall(0).args.length, 1);
            assert.equal(wildlife.move.getCall(0).args[0], 'wildlife_' + wildlife.location_arg);
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
            assert.equal(tile_handler.mark_as_selectable.getCall(0).args.length, 1);
            assert.equal(tile_handler.mark_as_selectable.getCall(0).args[0], tile);
        });
    });
});
