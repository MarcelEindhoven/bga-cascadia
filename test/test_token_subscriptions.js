var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/javascript/token_subscriptions.js');

describe('Token subscriptions', function () {
    beforeEach(function() {
        sut = new sut_module();

        callback_object = {
            token_selected: sinon.spy(),
            unsubscribe: function (event) {sut.unsubscribe(tile, callback_object, 'unsubscribe');},
        };
        callback_object2 = {
            token_selected: sinon.spy(),
        };
        complete_object = {value: 5, internal_method: sinon.spy(), external_method: function (event) {this.internal_method();}}

        tile = {unique_id: 'tile2', mark_as_selectable: sinon.spy(), unmark_as_selectable: sinon.spy(),};
        other_tile = {unique_id: 'tile4', mark_as_selectable: sinon.spy(), unmark_as_selectable: sinon.spy(),};

        expected_tile_id = 'tile' + tile.id;
        expected_upper_half_id = 'upper_half' + tile.id;

        element = 'test ';
    });
    describe('Subscribe', function () {
        it('has no effect by itself', function () {
            // Arrange
            // Act
            sut.subscribe(tile, callback_object, 'token_selected');
            // Assert
            sinon.assert.notCalled(callback_object.token_selected);
        });
        it('is not needed but then token_selected also has no effect', function () {
            // Arrange
            event = {currentTarget: {id: 'token'}};
            // Act
            sut.token_selected(event);
            // Assert
            sinon.assert.notCalled(callback_object.token_selected);
        });
        it('has no effect when Event ID does not match subscription token unique_id', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'token_selected');
            event = {currentTarget: {id: 'token'}};
            // Act
            sut.token_selected(event);
            // Assert
            sinon.assert.notCalled(callback_object.token_selected);
        });
        it('invokes callback method when Event ID does matches subscription token unique_id', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'token_selected');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.token_selected(event);
            // Assert
            assert.equal(callback_object.token_selected.getCall(0).args.length, 1);
            assert.equal(callback_object.token_selected.getCall(0).args[0], tile);
        });
        it('allows Callback method to access object parameters', function () {
            // Arrange
            sut.subscribe(tile, complete_object, 'external_method');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.token_selected(event);
            // Assert
            sinon.assert.calledOnce(complete_object.internal_method);
        });
        it('uses the correct subscription when multiple subscriptions have different ids', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'token_selected');
            sut.subscribe(other_tile, callback_object2, 'token_selected');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.token_selected(event);
            // Assert
            assert.equal(callback_object.token_selected.getCall(0).args[0], tile);

            sinon.assert.notCalled(callback_object2.token_selected);
        });
        it('uses all subscriptions when those subscriptions have same ids', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'token_selected');
            sut.subscribe(tile, callback_object2, 'token_selected');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.token_selected(event);
            // Assert
            assert.equal(callback_object.token_selected.getCall(0).args[0], tile);
            assert.equal(callback_object2.token_selected.getCall(0).args[0], tile);
        });
        it('marks token as selectable when the token is not yet present in the subscriptions', function () {
            // Arrange
            // Act
            sut.subscribe(tile, callback_object, 'token_selected');
            // Assert
            sinon.assert.callCount(tile.mark_as_selectable, 1);
        });
        it('does not mark token as selectable when another subscription already contains that token', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'Another method');
            // Act
            sut.subscribe(tile, callback_object, 'token_selected');
            // Assert
            sinon.assert.callCount(tile.mark_as_selectable, 1);
        });
    });
    describe('Unsubscribe', function () {
        beforeEach(function() {
            sut.subscribe(tile, callback_object, 'token_selected');
        });
        it('removes subscription when all three parameters match', function () {
            // Arrange
            sut.unsubscribe(tile, callback_object, 'token_selected');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.token_selected(event);
            // Assert
            sinon.assert.notCalled(callback_object.token_selected);
        });
        it('does not remove subscription when method name does not match', function () {
            // Arrange
            sut.unsubscribe(tile, callback_object, 'token_selectedxxxxxxxxxx');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.token_selected(event);
            // Assert
            sinon.assert.callCount(callback_object.token_selected, 1);
        });
        it('does not remove subscription when callback_object does not match', function () {
            // Arrange
            sut.unsubscribe(tile, callback_object2, 'token_selected');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.token_selected(event);
            // Assert
            sinon.assert.callCount(callback_object.token_selected, 1);
        });
        it('does not remove subscription when token unique_id does not match', function () {
            // Arrange
            sut.unsubscribe(other_tile, callback_object, 'token_selected');
            event = {currentTarget: {id: tile.unique_id}};
            // Act
            sut.token_selected(event);
            // Assert
            sinon.assert.callCount(callback_object.token_selected, 1);
        });
        it('stops marking token as selectable when the subscription is removed', function () {
            // Arrange
            // Act
            sut.unsubscribe(tile, callback_object, 'token_selected');
            // Assert
            sinon.assert.callCount(tile.unmark_as_selectable, 1);
        });
        it('does not stop marking token as selectable when another subscription is remaining for that token', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'Another method');
            // Act
            sut.unsubscribe(tile, callback_object, 'token_selected');
            // Assert
            sinon.assert.notCalled(tile.unmark_as_selectable);
        });
        it('handles unsubscribe from a callback in the middle of the token_selected for loop without undefined reading token error', function () {
            // Arrange
            sut.subscribe(tile, callback_object, 'unsubscribe');
            sut.subscribe(tile, callback_object, 'token_selected');
            // Act
            sut.token_selected(event);
            // Assert
        });
    });
});
