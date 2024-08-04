var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/javascript/habitat.js');

describe('Habitat', function () {
    beforeEach(function() {
        player_id = 125;
        sut = new sut_module(player_id);

        framework = {
            classify: sinon.spy(),
            resize: sinon.spy(),
        };
        sut.setFramework(framework);

        tile_handler = {
            move: sinon.spy(),
        };
        sut.setTileHandler(tile_handler);

        tile = {id: 2, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 50};
        other_tile = {id: 22, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 51};

        expected_tile_id = 'tile' + tile.id;
        expected_upper_half_id = 'upper_half' + tile.id;

        element = 'test ';
        minimum_size = 25;
        vertical_distance = 80;
        horizontal_distance = 24;
    });
    describe('Place tile', function () {
        function act_default(tile) {
            sut.place(tile);
        };
        it('move', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            assert.equal(tile_handler.move.getCall(0).args.length, 4);
            assert.equal(tile_handler.move.getCall(0).args[0], tile);
            assert.equal(tile_handler.move.getCall(0).args[1], '' + player_id);
            assert.equal(tile_handler.move.getCall(0).args[2], 0);
            assert.equal(tile_handler.move.getCall(0).args[3], 0);
        });
    });
    describe('Resize', function () {
        function act_default(tile) {
            sut.place(tile);
        };
        it('vertical maximum', function () {
            // Arrange
            act_default(tile);
            // Act
            act_default(other_tile);
            // Assert
            assert.equal(framework.resize.getCall(0).args.length, 3);
            assert.equal(framework.resize.getCall(0).args[0], '' + player_id);
            assert.equal(framework.resize.getCall(0).args[1], minimum_size);
            assert.equal(framework.resize.getCall(0).args[2], minimum_size + vertical_distance);
        });
        it('vertical minimum', function () {
            // Arrange
            act_default(tile);
            other_tile.vertical = tile.vertical - 1;
            // Act
            act_default(other_tile);
            // Assert
            assert.equal(framework.resize.getCall(0).args.length, 3);
            assert.equal(framework.resize.getCall(0).args[0], '' + player_id);
            assert.equal(framework.resize.getCall(0).args[1], minimum_size);
            assert.equal(framework.resize.getCall(0).args[2], minimum_size + vertical_distance);
        });
        it('Single resize, same other tile', function () {
            // Arrange
            act_default(tile);
            act_default(other_tile);
            // Act
            act_default(other_tile);
            // Assert
            sinon.assert.callCount(framework.resize, 1);
        });
        it('No resize, single tile', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            sinon.assert.notCalled(framework.resize);
        });
        it('No resize, same tile', function () {
            // Arrange
            act_default(tile);
            // Act
            act_default(tile);
            // Assert
            sinon.assert.notCalled(framework.resize);
        });
        it('horizontal minimum', function () {
            // Arrange
            act_default(tile);
            other_tile.horizontal = tile.horizontal - 2;
            other_tile.vertical = tile.vertical;
            // Act
            act_default(other_tile);
            // Assert
            assert.equal(framework.resize.getCall(0).args.length, 3);
            assert.equal(framework.resize.getCall(0).args[0], '' + player_id);
            assert.equal(framework.resize.getCall(0).args[1], minimum_size + 2 * horizontal_distance);
            assert.equal(framework.resize.getCall(0).args[2], minimum_size);
        });
        it('Even and odd column', function () {
            // Arrange
            act_default(tile);
            other_tile.horizontal = tile.horizontal - 1;
            other_tile.vertical = tile.vertical;
            // Act
            act_default(other_tile);
            // Assert
            assert.equal(framework.resize.getCall(0).args.length, 3);
            assert.equal(framework.resize.getCall(0).args[0], '' + player_id);
            assert.equal(framework.resize.getCall(0).args[1], minimum_size + horizontal_distance);
            assert.equal(framework.resize.getCall(0).args[2], minimum_size + vertical_distance / 2);
        });
    });
});
