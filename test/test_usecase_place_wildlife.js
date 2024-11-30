var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/javascript/usecase_place_wildlife.js');

describe('Use case place wildlife', function () {
    beforeEach(function() {
        habitat = {
            subscribe_tile_selected_for_wildlife: sinon.spy(),
            unsubscribe_tile_selected_for_wildlife: sinon.spy(),
        };

        wildlife = {id: 2, type: 1, unique_id: 'wildlife2', };

        dependencies = {chosen_wildlife: wildlife, habitat: habitat};
        sut = new sut_module(dependencies);

        callback_object = {
            wildlife_placed: sinon.spy(),
        };
    });
    describe('Subscribe', function () {
        function act_default(tile) {
            sut.subscribe_wildlife_placed(callback_object, 'wildlife_placed');
        };
        it('subscribes', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            assert.equal(habitat.subscribe_tile_selected_for_wildlife.getCall(0).args[1], sut);
            assert.equal(habitat.subscribe_tile_selected_for_wildlife.getCall(0).args[2], 'candidate_tile_selected');
            assert.equal(habitat.subscribe_tile_selected_for_wildlife.getCall(0).args[0], wildlife);
        });
    });
    describe('Candidate Tile selected', function () {
        beforeEach(function() {
            sut.subscribe_wildlife_placed(callback_object, 'wildlife_placed');
        });
        function act_default(tile) {
            sut.candidate_tile_selected(tile);
        };
        it('calls the subscriber with the selected tile', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            assert.equal(callback_object.wildlife_placed.getCall(0).args[0], tile);
        });
        it('unsubscribes', function () {
            // Arrange
            // Act
            act_default(tile);
            // Assert
            assert.equal(habitat.unsubscribe_tile_selected_for_wildlife.getCall(0).args[1], sut);
            assert.equal(habitat.unsubscribe_tile_selected_for_wildlife.getCall(0).args[2], 'candidate_tile_selected');
            assert.equal(habitat.unsubscribe_tile_selected_for_wildlife.getCall(0).args[0], wildlife);
        });
    });
});
