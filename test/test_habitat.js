var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/javascript/habitat.js');

describe('Habitat', function () {
    beforeEach(function() {
        player_id = 125;
        sut = new sut_module(player_id);

        framework = {
            classify: sinon.spy(),
        };
        sut.setFramework(framework);

        tile_handler = {
            move: sinon.spy(),
        };
        sut.setTileHandler(tile_handler);

        tile = {id: 2, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 51};

        expected_tile_id = 'tile' + tile.id;
        expected_upper_half_id = 'upper_half' + tile.id;

        element = 'test ';
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
});
