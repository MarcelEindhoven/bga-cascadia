var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/javascript/market.js');

describe('market', function () {
    beforeEach(function() {
        player_id = 125;
        sut = new sut_module(player_id);

        framework = {
            classify: sinon.spy(),
            resize: sinon.spy(),
        };
        sut.setFramework(framework);

        tile_handler = {
            move_and_rotate: sinon.spy(),
            move: sinon.spy(),
        };
        sut.setTileHandler(tile_handler);

        tile = {id: 2, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 50};
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
            sut.refresh();
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
});
