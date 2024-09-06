var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/javascript/usecase_place_tile.js');

describe('Use case select tile', function () {
    beforeEach(function() {
        player_id = 125;
        sut = new sut_module(player_id);

        tile_handler = {
            create: sinon.spy(),
            unsubscribe: sinon.spy(),
        };
        sut.set_tile_handler(tile_handler);

        habitat = {
            place: sinon.spy(),
            remove: sinon.spy(),
        };
        sut.set_habitat(habitat);

        token_subscriptions = {
            subscribe: sinon.spy(),
            unsubscribe: sinon.spy(),
        };
        sut.set_token_subscriptions(token_subscriptions);

        callback_object = {
            tile_placed: sinon.spy(),
        };

        tile = {id: 2, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 50, unique_id: 'tile2'};
        expected_candidate_tile = {horizontal: 50, vertical: 51};
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
    describe('Market Tile selected', function () {
        function act_default(positions, tile) {
            sut.set_candidate_positions(positions);
            sut.market_tile_selected(tile);
        };
        it('No candidate positions', function () {
            // Arrange
            // Act
            sut.market_tile_selected(tile);
            // Assert
        });
        it('Create tile', function () {
            // Arrange
            unique_id = tile.unique_id;
            // Act
            act_default([{horizontal: 52, vertical: 51}], tile);
            // Assert
            assert.equal(tile_handler.create.getCall(0).args.length, 1);
            assert.equal(tile_handler.create.getCall(0).args[0].vertical, 51);
            assert.equal(tile_handler.create.getCall(0).args[0].horizontal, 52);
            assert.equal(tile_handler.create.getCall(0).args[0].unique_id, unique_id+52+51);
        });
        it('Original tile unchanged', function () {
            // Arrange
            unique_id = tile.unique_id;
            vertical = tile.vertical;
            horizontal = tile.horizontal;
            // Act
            act_default([{horizontal: 52, vertical: 51}], tile);
            // Assert
            assert.equal(tile.horizontal, horizontal);
            assert.equal(tile.vertical, vertical);
            assert.equal(tile.unique_id, unique_id);
        });
        it('Propose tile', function () {
            // Arrange
            // Act
            act_default([{horizontal: 52, vertical: 51}], tile);
            // Assert
            assert.equal(habitat.place.getCall(0).args.length, 1);
            assert.equal(habitat.place.getCall(0).args[0].vertical, 51);
            assert.equal(habitat.place.getCall(0).args[0].horizontal, 52);
            assert.equal(habitat.place.getCall(0).args[0].unique_id, unique_id+52+51);
        });
        it('Subscribe', function () {
            // Arrange
            // Act
            act_default([{horizontal: 50, vertical: 51}], tile);
            // Assert
        });
    });
});
