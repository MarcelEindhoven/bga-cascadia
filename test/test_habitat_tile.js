var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/javascript/habitat_tile.js');

describe('Habitat tile', function () {
    beforeEach(function() {
        framework = {
            createToken: sinon.spy(),
            destroyToken: sinon.spy(),
            move: sinon.spy(),
            classify: sinon.spy(),
            subscribe: sinon.spy(),
            subscribe_paint: sinon.spy(),
            unsubscribe_paint: sinon.spy(),
            add_css_class: sinon.spy(),
            remove_css_class: sinon.spy(),
        };
        token_subscriptions = {
        };
        dependencies = {framework: framework},

        callback_object = {
            token_selected: sinon.spy(),
        };
        callback_object2 = {
            token_selected: sinon.spy(),
        };

        tile = {id: 2, terrain_types: [1], supported_wildlife: [2], unique_id: 'tile2',};
        other_tile = {id: 4, terrain_types: [1], supported_wildlife: [2], unique_id: 'tile4'};
        
        expected_tile_id = 'tile' + tile.id;
        expected_upper_half_id = 'upper_half' + tile.unique_id;

        element = 'test ';
        const object1 = {};

        Object.defineProperties(object1, {
          property1: {
            value: 42,
            writable: true,
          },
          property2: {},
        });
        Object.defineProperties(object1, {unique_id: {},});
        
        console.log(object1);
    });
    describe('Create token', function () {
        function act_default(tile) {
            sut = new sut_module(dependencies, tile);
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
            assert.equal(framework.createToken.getCall(1).args[1], 'field_wildlife0' + tile.unique_id);
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
            assert.equal(framework.createToken.getCall(3).args[1], 'field_wildlife2' + tile.unique_id);
            assert.equal(framework.createToken.getCall(3).args[2], 'wildlife' + tile.supported_wildlife[2]);
        });
        it('Register', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            assert.equal(framework.subscribe_paint.getCall(0).args.length, 1);
            assert.equal(framework.subscribe_paint.getCall(0).args[0].unique_id, tile.unique_id);
        });
    });
    describe('subscribe_selected', function () {
        function act_default(tile, token_subscriptions, token_selected) {
            sut = new sut_module(dependencies, tile);
            sut.subscribe_selected(token_subscriptions, token_selected);
        };
        it('subscribe', function () {
            // Arrange
            // Act
            act_default(tile, token_subscriptions, 'token_selected');
            // Assert
            assert.equal(framework.subscribe.getCall(0).args.length, 3);
            assert.equal(framework.subscribe.getCall(0).args[0], expected_tile_id);
            assert.equal(framework.subscribe.getCall(0).args[1], token_subscriptions);
            assert.equal(framework.subscribe.getCall(0).args[2], 'token_selected');
        });
    });
    describe('Destroy token', function () {
        function act_default(tile) {
            sut = new sut_module(dependencies, tile);
            sut.destroy();
        };
        it('createToken terrain_types[0]', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            assert.equal(framework.destroyToken.getCall(0).args.length, 1);
            assert.equal(framework.destroyToken.getCall(0).args[0], expected_tile_id);
        });
        it('destroyToken supported_wildlife[0]', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            assert.equal(framework.destroyToken.getCall(1).args.length, 1);
            assert.equal(framework.destroyToken.getCall(1).args[0], 'field_wildlife0' + tile.unique_id);
        });
        it('destroyToken terrain_types[1]', function () {
            // Arrange
            tile.terrain_types = [1, 3];
            // Act
            act_default(tile);
            // Assert
            assert.equal(framework.destroyToken.getCall(1).args.length, 1);
            assert.equal(framework.destroyToken.getCall(1).args[0], expected_upper_half_id);
        });
        it('destroyToken supported_wildlife[2]', function () {
            // Arrange
            tile.supported_wildlife = [2, 4, 5];
            // Act
            act_default(tile);
            // Assert
            assert.equal(framework.destroyToken.getCall(3).args.length, 1);
            assert.equal(framework.destroyToken.getCall(3).args[0], 'field_wildlife2' + tile.unique_id);
        });
        it('unRegister', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            assert.equal(framework.unsubscribe_paint.getCall(0).args.length, 1);
            assert.equal(framework.unsubscribe_paint.getCall(0).args[0].unique_id, tile.unique_id);
        });
    });
    describe('Move token 0, 0', function () {
        function act_default(tile, element) {
            sut = new sut_module(dependencies, tile);
            sut.move(element);
            sut.paint();
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
            assert.equal(framework.move.getCall(1).args[0], 'field_wildlife0' + tile.unique_id);
            assert.equal(framework.move.getCall(1).args[1], expected_tile_id);
        });
        it('field_wildlife1', function () {
            // Arrange
            tile.supported_wildlife = [2, 5];
            // Act
            act_default(tile, element);
            // Assert
            assert.equal(framework.move.getCall(1).args.length, 4);
            assert.equal(framework.move.getCall(1).args[0], 'field_wildlife0' + tile.unique_id);
            assert.equal(framework.move.getCall(1).args[1], expected_tile_id);
            assert.equal(framework.move.getCall(1).args[2], 0);
            assert.equal(framework.move.getCall(1).args[3], -10);
            assert.equal(framework.move.getCall(2).args.length, 4);
            assert.equal(framework.move.getCall(2).args[0], 'field_wildlife1' + tile.unique_id);
            assert.equal(framework.move.getCall(2).args[1], expected_tile_id);
            assert.equal(framework.move.getCall(2).args[2], 0);
            assert.equal(framework.move.getCall(2).args[3], -framework.move.getCall(1).args[3]);
        });
        it('field_wildlife2', function () {
            // Arrange
            tile.supported_wildlife = [2, 4, 5];
            // Act
            act_default(tile, element);
            // Assert
            assert.equal(framework.move.getCall(1).args.length, 4);
            assert.equal(framework.move.getCall(1).args[0], 'field_wildlife0' + tile.unique_id);
            assert.equal(framework.move.getCall(1).args[1], expected_tile_id);
            assert.equal(framework.move.getCall(1).args[2], 0);
            assert.equal(framework.move.getCall(1).args[3], -10);
            assert.equal(framework.move.getCall(2).args.length, 4);
            assert.equal(framework.move.getCall(2).args[0], 'field_wildlife1' + tile.unique_id);
            assert.equal(framework.move.getCall(2).args[1], expected_tile_id);
            assert.equal(framework.move.getCall(3).args.length, 4);
            assert.equal(framework.move.getCall(3).args[0], 'field_wildlife2' + tile.unique_id);
            assert.equal(framework.move.getCall(3).args[1], expected_tile_id);
            assert.equal(framework.move.getCall(3).args[2], -framework.move.getCall(2).args[2]);
            assert.equal(framework.move.getCall(3).args[3], framework.move.getCall(2).args[3]);
        });
    });
    describe('Move token x, y', function () {
        function act_default(tile, element, x = 0, y = 0) {
            sut = new sut_module(dependencies, tile);
            sut.move(element, x, y);
            sut.paint();
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
    describe('Rotation', function () {
        function assert_default(tile) {
            sut = new sut_module(dependencies, tile);
        };
        function act_default() {
            sut.paint();
        };
        it('Paint without rotation', function () {
            // Arrange
            assert_default(tile);
            // Act
            act_default();
            // Assert
            sinon.assert.notCalled(framework.add_css_class);
        });
        it('Paint with rotation and no multiple terrain types', function () {
            // Arrange
            tile.rotation = 3;
            assert_default(tile);
            // Act
            act_default();
            // Assert
            sinon.assert.notCalled(framework.add_css_class);
        });
        it('Paint with rotation and multiple terrain types', function () {
            // Arrange
            tile.rotation = 3;
            tile.terrain_types = [2, 3];
            assert_default(tile);
            // Act
            act_default();
            // Assert
            sinon.assert.callCount(framework.add_css_class, 1);
            assert.equal(framework.add_css_class.getCall(0).args.length, 2);
            assert.equal(framework.add_css_class.getCall(0).args[0], sut.getSecondTerrainTypeID());
            assert.equal(framework.add_css_class.getCall(0).args[1], 'rotate3');
        });
        it('Paint again', function () {
            // Arrange
            tile.rotation = 3;
            tile.terrain_types = [2, 3];
            assert_default(tile);
            // Act
            act_default();
            sut.paint();
            // Assert
            sinon.assert.callCount(framework.add_css_class, 1);
        });
        it('Remove CSS class after change in rotation', function () {
            // Arrange
            tile.rotation = 5;
            tile.terrain_types = [2, 3];
            assert_default(tile);
            // Act
            act_default();
            sut.rotation = 0;
            sut.paint();
            // Assert
            sinon.assert.callCount(framework.add_css_class, 2);
            assert.equal(framework.add_css_class.getCall(1).args[0], sut.getSecondTerrainTypeID());
            assert.equal(framework.add_css_class.getCall(1).args[1], 'rotate0');
            sinon.assert.callCount(framework.remove_css_class, 1);
            assert.equal(framework.remove_css_class.getCall(0).args.length, 2);
            assert.equal(framework.remove_css_class.getCall(0).args[0], sut.getSecondTerrainTypeID());
            assert.equal(framework.remove_css_class.getCall(0).args[1], 'rotate5');
        });
    });
});
