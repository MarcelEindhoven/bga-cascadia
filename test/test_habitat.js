var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/javascript/habitat.js');

describe('Habitat', function () {
    beforeEach(function() {
        player_id = 125;

        framework = {
            add_css_class: sinon.spy(),
            resize: sinon.spy(),
        };
        token_subscriptions = {
            subscribe: sinon.spy(),
            unsubscribe: sinon.spy(),
        };
        dependencies = {framework: framework, token_subscriptions: token_subscriptions};

        sut = new sut_module(dependencies, player_id);
        move_spy = sinon.spy();

        wildlife = {id: 2, type: '1', unique_id: 'wildlife2', tile_unique_id: 'tile2', move: move_spy,};

        tile = {terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 50, unique_id: 'tile2', move: move_spy,};
        other_tile = {id: 2, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 51, unique_id: 'tile22', move: sinon.spy(),};

        expected_tile_id = 'tile' + tile.id;
        expected_upper_half_id = 'upper_half' + tile.id;

        element = 'test ';
        minimum_size = 50;
        vertical_distance = 80;
        horizontal_distance = 24;

        callback_object = {
            wildlife_placed: sinon.spy(),
        };
    });
    describe('Populate', function () {
        function act_default(x) {
            sut.populate(x);
        };
        it('moves to a tile', function () {
            // Arrange
            // Act
            act_default(wildlife);
            // Assert
            assert.equal(wildlife.move.getCall(0).args[0], wildlife.tile_unique_id);
        });
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
            assert.equal(tile.move.getCall(0).args.length, 3);
            assert.equal(tile.move.getCall(0).args[0], '' + player_id);
            assert.equal(tile.move.getCall(0).args[1], 0);
            assert.equal(tile.move.getCall(0).args[2], 0);
        });
        it('Move vertical after resize', function () {
            // Arrange
            act_default(tile);
            // Act
            act_default(other_tile);
            // Assert
            assert.equal(other_tile.move.getCall(0).args[1], 0);
            assert.equal(other_tile.move.getCall(0).args[2], vertical_distance / 2);
            assert.equal(move_spy.getCall(1).args[1], 0);
            assert.equal(move_spy.getCall(1).args[2], -vertical_distance / 2);
        });
        it('Move horizontal and vertical with (-1,0) after resize', function () {
            // Arrange
            act_default(tile);
            // Act
            other_tile.horizontal = tile.horizontal - 1;
            other_tile.vertical = tile.vertical;
            act_default(other_tile);
            // Assert
            assert.equal(move_spy.getCall(1).args[1], horizontal_distance / 2);
            assert.equal(move_spy.getCall(1).args[2], vertical_distance / 4);
            assert.equal(other_tile.move.getCall(0).args[1], - horizontal_distance / 2);
            assert.equal(other_tile.move.getCall(0).args[2], - vertical_distance / 4);
        });
        it('Always moves tile, also when there is no resize', function () {
            // Arrange
            // Act
            act_default(tile);
            act_default(tile);
            // Assert
            sinon.assert.callCount(tile.move, 2);
        });
    });
    describe('Remove tile', function () {
        function arrange_default(x) {
            sut.place(x);
        };
        function act_default(x) {
            sut.remove(x);
        };
        it('Single tile', function () {
            // Arrange
            arrange_default(tile);
            // Act
            act_default(tile);
            // Trigger a resize
            arrange_default(other_tile);
            // Assert
            sinon.assert.callCount(tile.move, 1);
        });
        it('Single tile remains', function () {
            // Arrange
            arrange_default(other_tile);
            arrange_default(tile);
            // Act
            act_default(tile);
            // Assert
            sinon.assert.callCount(tile.move, 1);
            sinon.assert.callCount(other_tile.move, 2);
        });
    });
    describe('Resize', function () {
        function act_default(x) {
            sut.place(x);
        };
        it('resize, single tile', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            assert.equal(framework.resize.getCall(0).args.length, 3);
            assert.equal(framework.resize.getCall(0).args[0], '' + player_id);
            assert.equal(framework.resize.getCall(0).args[1], minimum_size);
            assert.equal(framework.resize.getCall(0).args[2], minimum_size);
        });
        it('vertical maximum', function () {
            // Arrange
            act_default(tile);
            // Act
            act_default(other_tile);
            // Assert
            assert.equal(framework.resize.getCall(1).args.length, 3);
            assert.equal(framework.resize.getCall(1).args[0], '' + player_id);
            assert.equal(framework.resize.getCall(1).args[1], minimum_size);
            assert.equal(framework.resize.getCall(1).args[2], minimum_size + vertical_distance);
        });
        it('vertical minimum', function () {
            // Arrange
            act_default(tile);
            other_tile.vertical = tile.vertical - 1;
            // Act
            act_default(other_tile);
            // Assert
            assert.equal(framework.resize.getCall(1).args.length, 3);
            assert.equal(framework.resize.getCall(1).args[0], '' + player_id);
            assert.equal(framework.resize.getCall(1).args[1], minimum_size);
            assert.equal(framework.resize.getCall(1).args[2], minimum_size + vertical_distance);
        });
        it('Single resize, same other tile', function () {
            // Arrange
            act_default(tile);
            act_default(other_tile);
            // Act
            act_default(other_tile);
            // Assert
            sinon.assert.callCount(framework.resize, 2);
        });
        it('No resize, same tile', function () {
            // Arrange
            act_default(tile);
            // Act
            act_default(tile);
            // Assert
            sinon.assert.callCount(framework.resize, 1);
        });
        it('horizontal minimum', function () {
            // Arrange
            act_default(tile);
            other_tile.horizontal = tile.horizontal - 2;
            other_tile.vertical = tile.vertical;
            // Act
            act_default(other_tile);
            // Assert
            assert.equal(framework.resize.getCall(1).args[1], minimum_size + 2 * horizontal_distance);
            assert.equal(framework.resize.getCall(1).args[2], minimum_size);
        });
        it('Even and odd column', function () {
            // Arrange
            act_default(tile);
            other_tile.horizontal = tile.horizontal - 1;
            other_tile.vertical = tile.vertical;
            // Act
            act_default(other_tile);
            // Assert
            assert.equal(framework.resize.getCall(1).args.length, 3);
            assert.equal(framework.resize.getCall(1).args[0], '' + player_id);
            assert.equal(framework.resize.getCall(1).args[1], minimum_size + horizontal_distance);
            assert.equal(framework.resize.getCall(1).args[2], minimum_size + vertical_distance / 2);
        });
    });
    describe('Subscribe', function () {
        function act_default(x) {
            sut.subscribe_tile_selected_for_wildlife(x, callback_object, callback_object.wildlife_placed);
            };
        it('Does not bother token subscriptions when there are no tiles', function () {
            // Arrange
            // Act
            act_default(wildlife);
            // Assert
            sinon.assert.callCount(token_subscriptions.subscribe, 0);
        });
        it('calls token subscriptions when there is one matching tile', function () {
            // Arrange
            tile.supported_wildlife = [Number(wildlife.type)];
            sut.place(tile);
            // Act
            act_default(wildlife);
            // Assert
            sinon.assert.callCount(token_subscriptions.subscribe, 1);
            assert.equal(token_subscriptions.subscribe.getCall(0).args[0], tile);
            assert.equal(token_subscriptions.subscribe.getCall(0).args[1], callback_object);
            assert.equal(token_subscriptions.subscribe.getCall(0).args[2], callback_object.wildlife_placed);
        });
        it('calls token subscriptions once when there is one matching tile and a tile that does not match', function () {
            // Arrange
            tile.supported_wildlife = [Number(wildlife.type)];
            sut.place(tile);
            other_tile.supported_wildlife = [Number(wildlife.type) + 1];
            sut.place(other_tile);
            // Act
            act_default(wildlife);
            // Assert
            sinon.assert.callCount(token_subscriptions.subscribe, 1);
        });
        it('calls token subscriptions unsubscribe once when there is one matching tile and a tile that does not match', function () {
            // Arrange
            tile.supported_wildlife = [Number(wildlife.type)];
            sut.place(tile);
            other_tile.supported_wildlife = [Number(wildlife.type) + 1];
            sut.place(other_tile);
            // Act
            act_default(wildlife);
            sut.unsubscribe_tile_selected_for_wildlife(wildlife, callback_object, callback_object.wildlife_placed);
            // Assert
            sinon.assert.callCount(token_subscriptions.unsubscribe, 1);
        });
    });
});
