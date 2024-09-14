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
            add_ui_element: sinon.spy(),
        };
        token_subscriptions = {
            createToken: sinon.spy(),
            move: sinon.spy(),
            classify: sinon.spy(),
            subscribe: sinon.spy(),
        };
        dependencies = {framework: framework, token_subscriptions: token_subscriptions},
        sut = new sut_module(dependencies);

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
        it('subscribe', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            assert.equal(framework.subscribe.getCall(0).args.length, 3);
            assert.equal(framework.subscribe.getCall(0).args[0], expected_tile_id);
            assert.equal(framework.subscribe.getCall(0).args[1], token_subscriptions);
            assert.equal(framework.subscribe.getCall(0).args[2], 'token_selected');
        });
        it('Register', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            assert.equal(framework.add_ui_element.getCall(0).args.length, 1);
            assert.equal(framework.add_ui_element.getCall(0).args[0].unique_id, tile.unique_id);
        });
    });
    describe('Destroy token', function () {
        function act_default(tile) {
            sut.create(tile);
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
    });
    describe('Move token 0, 0', function () {
        function act_default(tile, element) {
            sut.create(tile);
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
            sut.create(tile);
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
});
