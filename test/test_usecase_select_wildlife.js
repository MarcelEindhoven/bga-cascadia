var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/javascript/usecase_select_wildlife.js');

describe('Use case select tile', function () {
    beforeEach(function() {
        wildlife = {};
        market = {
            subscribe_tile_selected: sinon.spy(),
            unsubscribe_tile_selected: sinon.spy(),
            get_wildlife_from_combination_with: sinon.stub(),
        };
        dependencies = {market: market};
        market.get_wildlife_from_combination_with.onCall(0).returns(wildlife);
    });
    describe('Constructor', function () {
        function act_default() {
            sut = new sut_module(dependencies);
        };
        it('Subscribes to market when created', function () {
            // Arrange
            // Act
            act_default();
            // Assert
            assert.equal(market.subscribe_tile_selected.getCall(0).args[0], sut);
            assert.equal(market.subscribe_tile_selected.getCall(0).args[1], 'market_tile_selected');
        });
    });
    describe('Terminate', function () {
        beforeEach(function() {
            sut = new sut_module(dependencies);
        });
        function act_default() {
            sut.terminate();
        };
        it('Unsubscribes to market when destroyed', function () {
            // Arrange
            // Act
            act_default();
            // Assert
            assert.equal(market.unsubscribe_tile_selected.getCall(0).args[0], sut);
            assert.equal(market.unsubscribe_tile_selected.getCall(0).args[1], 'market_tile_selected');
        });
    });
    describe('Market tile is selected', function () {
        beforeEach(function() {
            sut = new sut_module(dependencies);
        });
        function act_default(x) {
            sut.market_tile_selected(x);
        };
        it('Retrieves wildlife from market when tile is selected', function () {
            // Arrange
            tile = {id: 2, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 50, unique_id: 'tile2', location_arg: 3};
            // Act
            act_default(tile);
            // Assert
            assert.equal(market.get_wildlife_from_combination_with.getCall(0).args[0], tile);
        });
        it('returns wildlife from market and updates location', function () {
            // Arrange
            tile = {id: 2, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 50, unique_id: 'tile2', location_arg: 3};
            // Act
            act_default(tile);
            selected_wildlife = sut.get_selected_wildlife();
            // Assert
            assert.equal(selected_wildlife, wildlife);
            assert.equal(selected_wildlife.y, 50);
        });
        it('restores zero position for unselected wildlife', function () {
            // Arrange
            other_wildlife = {};
            market.get_wildlife_from_combination_with.onCall(1).returns(other_wildlife);

            tile = {id: 2, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 50, unique_id: 'tile2', location_arg: 3};

            // Act
            act_default(tile);
            first_selected_wildlife = sut.get_selected_wildlife();
            act_default(tile);
            second_selected_wildlife = sut.get_selected_wildlife();

            // Assert
            assert.equal(first_selected_wildlife, wildlife);
            assert.equal(first_selected_wildlife.y, 0);
            assert.equal(second_selected_wildlife, other_wildlife);
            assert.equal(second_selected_wildlife.y, 50);
        });
    });
});
