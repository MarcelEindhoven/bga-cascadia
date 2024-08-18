var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/javascript/habitat_tiles.js');

describe('Habitat tiles', function () {
    beforeEach(function() {
        sut = new sut_module();
        framework = {
            createToken: sinon.spy(),
            move: sinon.spy(),
            classify: sinon.spy(),
            subscribe: sinon.spy(),
        };
        sut.setFramework(framework);

        callback_object = {
            tile_selected: sinon.spy(),
        };
        callback_object2 = {
            tile_selected: sinon.spy(),
        };

        tile = {id: 2, terrain_types: [1], supported_wildlife: [2], unique_id: 'tile2'};
        other_tile = {id: 4, terrain_types: [1], supported_wildlife: [2], unique_id: 'tile4'};

        expected_tile_id = 'tile' + tile.id;
        expected_upper_half_id = 'upper_half' + tile.id;

        element = 'test ';
    });
    describe('Create token', function () {
        function act_default(tile) {
            sut.create(tile);
        };
        it('createToken terrain_types[0]', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            assert.equal(framework.createToken.getCall(0).args.length, 3);
            assert.equal(framework.createToken.getCall(0).args[0], 'field');
            assert.equal(framework.createToken.getCall(0).args[1], expected_tile_id);
            assert.equal(framework.createToken.getCall(0).args[2], 'field' + tile.terrain_types[0]);
        });
        it('createToken supported_wildlife[0]', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            assert.equal(framework.createToken.getCall(1).args.length, 3);
            assert.equal(framework.createToken.getCall(1).args[0], 'field_wildlife');
            assert.equal(framework.createToken.getCall(1).args[1], 'field_wildlife0' + tile.id);
            assert.equal(framework.createToken.getCall(1).args[2], 'wildlife' + tile.supported_wildlife[0]);
        });
        it('createToken terrain_types[1]', function () {
            // Arrange
            tile.terrain_types = [1, 3];
            // Act
            act_default(tile);
            // Assert
            assert.equal(framework.createToken.getCall(1).args.length, 3);
            assert.equal(framework.createToken.getCall(1).args[0], 'upper_half');
            assert.equal(framework.createToken.getCall(1).args[1], expected_upper_half_id);
            assert.equal(framework.createToken.getCall(1).args[2], 'field' + tile.terrain_types[1]);
        });
        it('createToken supported_wildlife[2]', function () {
            // Arrange
            tile.supported_wildlife = [2, 4, 5];
            // Act
            act_default(tile);
            // Assert
            assert.equal(framework.createToken.getCall(3).args.length, 3);
            assert.equal(framework.createToken.getCall(3).args[0], 'field_wildlife');
            assert.equal(framework.createToken.getCall(3).args[1], 'field_wildlife2' + tile.id);
            assert.equal(framework.createToken.getCall(3).args[2], 'wildlife' + tile.supported_wildlife[2]);
        });
        it('subscribe', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            assert.equal(framework.subscribe.getCall(0).args.length, 3);
            assert.equal(framework.subscribe.getCall(0).args[0], expected_tile_id);
            assert.equal(framework.subscribe.getCall(0).args[1], sut);
            assert.equal(framework.subscribe.getCall(0).args[2], 'tile_selected');
        });
    });
    describe('Move token 0, 0', function () {
        function act_default(tile, element) {
            sut.move(tile, element);
        };
        it('expected_tile_id', function () {
            // Arrange
            // Act
            act_default(tile, element);
            // Assert
            assert.equal(framework.move.getCall(0).args.length, 4);
            assert.equal(framework.move.getCall(0).args[0], expected_tile_id);
            assert.equal(framework.move.getCall(0).args[1], element);
            assert.equal(framework.move.getCall(0).args[2], 0);
            assert.equal(framework.move.getCall(0).args[3], 0);
        });
        it('expected_upper_half_id', function () {
            // Arrange
            tile.terrain_types = [1, 3];
            // Act
            act_default(tile, element);
            // Assert
            assert.equal(framework.move.getCall(1).args.length, 2);
            assert.equal(framework.move.getCall(1).args[0], expected_upper_half_id);
            assert.equal(framework.move.getCall(1).args[1], expected_tile_id);
        });
        it('field_wildlife0', function () {
            // Arrange
            // Act
            act_default(tile, element);
            // Assert
            assert.equal(framework.move.getCall(1).args.length, 2);
            assert.equal(framework.move.getCall(1).args[0], 'field_wildlife0' + tile.id);
            assert.equal(framework.move.getCall(1).args[1], expected_tile_id);
        });
        it('field_wildlife2', function () {
            // Arrange
            tile.supported_wildlife = [2, 4, 5];
            // Act
            act_default(tile, element);
            // Assert
            assert.equal(framework.move.getCall(3).args.length, 2);
            assert.equal(framework.move.getCall(3).args[0], 'field_wildlife2' + tile.id);
            assert.equal(framework.move.getCall(3).args[1], expected_tile_id);
        });
    });
    describe('Move token x, y', function () {
        function act_default(tile, element, x = 0, y = 0) {
            sut.move(tile, element, x, y);
        };
        it('x, y', function () {
            // Arrange
            // Act
            act_default(tile, element, x, y);
            // Assert
            assert.equal(framework.move.getCall(0).args.length, 4);
            assert.equal(framework.move.getCall(0).args[0], expected_tile_id);
            assert.equal(framework.move.getCall(0).args[1], element);
            assert.equal(framework.move.getCall(0).args[2], x);
            assert.equal(framework.move.getCall(0).args[3], y);
        });
    });
    describe('Rotate token', function () {
        function act_default(tile, element, x, y) {
            sut.move_and_rotate(tile, element, x, y);
        };
        it('Move', function () {
            // Arrange
            // Act
            act_default(tile, element, x, y);
            // Assert
            assert.equal(framework.move.getCall(0).args.length, 4);
            assert.equal(framework.move.getCall(0).args[0], expected_tile_id);
            assert.equal(framework.move.getCall(0).args[1], element);
            assert.equal(framework.move.getCall(0).args[2], x);
            assert.equal(framework.move.getCall(0).args[3], y);
        });
        it('no rotate', function () {
            // Arrange
            // Act
            act_default(tile, element, x, y);
            // Assert
            sinon.assert.notCalled(framework.classify);
        });
        it('Rotate', function () {
            // Arrange
            tile.terrain_types = [1, 3];
            tile.rotation = 1;
            // Act
            act_default(tile, element, x, y);
            // Assert
            assert.equal(framework.classify.getCall(0).args.length, 2);
            assert.equal(framework.classify.getCall(0).args[0], expected_upper_half_id);
            assert.equal(framework.classify.getCall(0).args[1], 'rotate' + tile.rotation);
        });
    });
    describe('Subscribe', function () {
        function act_default(tile, object, method) {
            sut.subscribe(tile, object, method);
        };
        it('Subscribe', function () {
            // Arrange
            // Act
            sut.subscribe(tile, callback_object, 'tile_selected');
            // Assert
            sinon.assert.notCalled(callback_object.tile_selected);
        });
        it('Event without subscription', function () {
            // Arrange
            event = {currentTarget: {id: 'token'}};
            // Act
            sut.tile_selected(event);
            // Assert
            sinon.assert.notCalled(callback_object.tile_selected);
        });
        it('Event ID does not match subscription', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'tile_selected');
            event = {currentTarget: {id: 'token'}};
            // Act
            sut.tile_selected(event);
            // Assert
            sinon.assert.notCalled(callback_object.tile_selected);
        });
        it('Event ID does matches subscription', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'tile_selected');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.tile_selected(event);
            // Assert
            assert.equal(callback_object.tile_selected.getCall(0).args.length, 1);
            assert.equal(callback_object.tile_selected.getCall(0).args[0], tile);
        });
        it('Unsubscribe', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'tile_selected');
            sut.unsubscribe(tile, callback_object, 'tile_selected');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.tile_selected(event);
            // Assert
            sinon.assert.notCalled(callback_object.tile_selected);
        });
        it('Unsubscribe Different method', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'tile_selected');
            sut.unsubscribe(tile, callback_object, 'tile_selectedxxxxxxxxxx');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.tile_selected(event);
            // Assert
            sinon.assert.callCount(callback_object.tile_selected, 1);
        });
        it('Unsubscribe Different object', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'tile_selected');
            sut.unsubscribe(tile, callback_object2, 'tile_selected');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.tile_selected(event);
            // Assert
            sinon.assert.callCount(callback_object.tile_selected, 1);
        });
        it('Unsubscribe Different tile', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'tile_selected');
            sut.unsubscribe(other_tile, callback_object, 'tile_selected');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.tile_selected(event);
            // Assert
            sinon.assert.callCount(callback_object.tile_selected, 1);
        });
        it('Multiple subscribe different ids', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'tile_selected');
            sut.subscribe(other_tile, callback_object2, 'tile_selected');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.tile_selected(event);
            // Assert
            assert.equal(callback_object.tile_selected.getCall(0).args.length, 1);
            assert.equal(callback_object.tile_selected.getCall(0).args[0], tile);

            sinon.assert.notCalled(callback_object2.tile_selected);
        });
        it('Multiple subscribe same ids', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'tile_selected');
            sut.subscribe(tile, callback_object2, 'tile_selected');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.tile_selected(event);
            // Assert
            assert.equal(callback_object.tile_selected.getCall(0).args[0], tile);
            assert.equal(callback_object2.tile_selected.getCall(0).args[0], tile);
        });
    });
});
