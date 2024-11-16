var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/javascript/usecase_select_wildlife.js');

describe('Use case select tile', function () {
    beforeEach(function() {
        wildlife = {};
        market = {
            subscribe_tile_selected: sinon.spy(),
            unsubscribe_tile_selected: sinon.spy(),
            get_wildlife_from_combination_with: sinon.stub().returns(wildlife),
        };
        dependencies = {market: market};
    });
    describe('Subscribe', function () {
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
        it('Unsubscribes to market when destroyed', function () {
            // Arrange
            // Act
            act_default();
            sut.terminate();
            // Assert
            assert.equal(market.unsubscribe_tile_selected.getCall(0).args[0], sut);
            assert.equal(market.unsubscribe_tile_selected.getCall(0).args[1], 'market_tile_selected');
        });
        it('Retrieves wildlife from market when tile is selected', function () {
            // Arrange
            act_default();
            tile = {id: 2, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 50, unique_id: 'tile2', location_arg: 3};
            // Act
            sut.market_tile_selected(tile);
            // Assert
            assert.equal(market.get_wildlife_from_combination_with.getCall(0).args[0], tile);
        });
        it('returns wildlife from market', function () {
            // Arrange
            act_default();
            tile = {id: 2, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 50, unique_id: 'tile2', location_arg: 3};
            // Act
            sut.market_tile_selected(tile);
            selected_wildlife = sut.get_selected_wildlife();
            // Assert
            assert.equal(selected_wildlife, wildlife);
        });
    });
});
