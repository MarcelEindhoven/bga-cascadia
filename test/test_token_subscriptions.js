var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/javascript/token_subscriptions.js');

describe('Habitat tiles', function () {
    beforeEach(function() {
        sut = new sut_module();

        callback_object = {
            token_selected: sinon.spy(),
        };
        callback_object2 = {
            token_selected: sinon.spy(),
        };

        tile = {id: 2, terrain_types: [1], supported_wildlife: [2], unique_id: 'tile2'};
        other_tile = {id: 4, terrain_types: [1], supported_wildlife: [2], unique_id: 'tile4'};

        expected_tile_id = 'tile' + tile.id;
        expected_upper_half_id = 'upper_half' + tile.id;

        element = 'test ';
    });
    describe('Subscribe', function () {
        it('Subscribe', function () {
            // Arrange
            // Act
            sut.subscribe(tile, callback_object, 'token_selected');
            // Assert
            sinon.assert.notCalled(callback_object.token_selected);
        });
        it('Event without subscription', function () {
            // Arrange
            event = {currentTarget: {id: 'token'}};
            // Act
            sut.token_selected(event);
            // Assert
            sinon.assert.notCalled(callback_object.token_selected);
        });
        it('Event ID does not match subscription', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'token_selected');
            event = {currentTarget: {id: 'token'}};
            // Act
            sut.token_selected(event);
            // Assert
            sinon.assert.notCalled(callback_object.token_selected);
        });
        it('Event ID does matches subscription', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'token_selected');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.token_selected(event);
            // Assert
            assert.equal(callback_object.token_selected.getCall(0).args.length, 2);
            assert.equal(callback_object.token_selected.getCall(0).args[0], callback_object);
            assert.equal(callback_object.token_selected.getCall(0).args[1], tile);
        });
        it('Unsubscribe', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'token_selected');
            sut.unsubscribe(tile, callback_object, 'token_selected');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.token_selected(event);
            // Assert
            sinon.assert.notCalled(callback_object.token_selected);
        });
        it('Unsubscribe Different method', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'token_selected');
            sut.unsubscribe(tile, callback_object, 'token_selectedxxxxxxxxxx');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.token_selected(event);
            // Assert
            sinon.assert.callCount(callback_object.token_selected, 1);
        });
        it('Unsubscribe Different object', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'token_selected');
            sut.unsubscribe(tile, callback_object2, 'token_selected');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.token_selected(event);
            // Assert
            sinon.assert.callCount(callback_object.token_selected, 1);
        });
        it('Unsubscribe Different tile', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'token_selected');
            sut.unsubscribe(other_tile, callback_object, 'token_selected');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.token_selected(event);
            // Assert
            sinon.assert.callCount(callback_object.token_selected, 1);
        });
        it('Multiple subscribe different ids', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'token_selected');
            sut.subscribe(other_tile, callback_object2, 'token_selected');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.token_selected(event);
            // Assert
            assert.equal(callback_object.token_selected.getCall(0).args.length, 2);
            assert.equal(callback_object.token_selected.getCall(0).args[0], callback_object);
            assert.equal(callback_object.token_selected.getCall(0).args[1], tile);

            sinon.assert.notCalled(callback_object2.token_selected);
        });
        it('Multiple subscribe same ids', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'token_selected');
            sut.subscribe(tile, callback_object2, 'token_selected');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.token_selected(event);
            // Assert
            assert.equal(callback_object.token_selected.getCall(0).args[0], callback_object);
            assert.equal(callback_object2.token_selected.getCall(0).args[0], callback_object2);
            assert.equal(callback_object.token_selected.getCall(0).args[1], tile);
            assert.equal(callback_object2.token_selected.getCall(0).args[1], tile);
        });
    });
});