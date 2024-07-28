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
        };
        sut.setFramework(framework);
    });
    describe('Create token', function () {
        function act_default(tile) {
            sut.create(tile);
        };
        it('createToken terrain_types[0]', function () {
            // Arrange
            tile = {id: 2, terrain_types: [1], supported_wildlife: [2]};
            // Act
            act_default(tile);
            // Assert
            assert.equal(framework.createToken.getCall(0).args.length, 3);
            assert.equal(framework.createToken.getCall(0).args[0], 'field');
            assert.equal(framework.createToken.getCall(0).args[1], 'tile' + tile.id);
            assert.equal(framework.createToken.getCall(0).args[2], 'field' + tile.terrain_types[0]);
        });
        it('createToken supported_wildlife[0]', function () {
            // Arrange
            tile = {id: 2, terrain_types: [1], supported_wildlife: [2]};
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
            tile = {id: 2, terrain_types: [1, 3], supported_wildlife: [2]};
            // Act
            act_default(tile);
            // Assert
            assert.equal(framework.createToken.getCall(1).args.length, 3);
            assert.equal(framework.createToken.getCall(1).args[0], 'upper_half');
            assert.equal(framework.createToken.getCall(1).args[1], 'upper_half' + tile.id);
            assert.equal(framework.createToken.getCall(1).args[2], 'field' + tile.terrain_types[1]);
        });
        it('createToken supported_wildlife[2]', function () {
            // Arrange
            tile = {id: 2, terrain_types: [1], supported_wildlife: [2, 4, 5]};
            // Act
            act_default(tile);
            // Assert
            assert.equal(framework.createToken.getCall(3).args.length, 3);
            assert.equal(framework.createToken.getCall(3).args[0], 'field_wildlife');
            assert.equal(framework.createToken.getCall(3).args[1], 'field_wildlife2' + tile.id);
            assert.equal(framework.createToken.getCall(3).args[2], 'wildlife' + tile.supported_wildlife[2]);
        });
    });
});
