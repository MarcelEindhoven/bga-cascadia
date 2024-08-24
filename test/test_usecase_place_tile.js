var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/javascript/usecase_place_tile.js');

describe('Use case select tile', function () {
    beforeEach(function() {
        player_id = 125;
        sut = new sut_module(player_id);

        framework = {
            subscribe: sinon.spy(),
            unsubscribe: sinon.spy(),
        };
        sut.setFramework(framework);

        callback_object = {
            tile_placed: sinon.spy(),
        };

        tile = {id: 2, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 50, unique_id: 'tile2'};
        other_tile = {id: 22, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 51, unique_id: 'tile2'};

        expected_tile_id = 'tile' + tile.id;
        expected_upper_half_id = 'upper_half' + tile.id;

        element = 'test ';
        minimum_size = 50;
        vertical_distance = 80;
        horizontal_distance = 24;
    });
    describe('Candidate Tile selected', function () {
        function act_default(object, method, tile) {
            sut.subscribe_tile_placed(object, method);
            sut.candidate_tile_selected(tile);
        };
        it('tile_placed', function () {
            // Arrange
            // Act
            act_default(callback_object, 'tile_placed', tile);
            // Assert
            assert.equal(callback_object.tile_placed.getCall(0).args.length, 1);
        });
    });
});
