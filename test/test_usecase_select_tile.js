var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/javascript/usecase_select_tile.js');

describe('Habitat', function () {
    beforeEach(function() {
        player_id = 125;
        sut = new sut_module(player_id);

        framework = {
            subscribe: sinon.spy(),
            unsubscribe: sinon.spy(),
        };
        sut.setFramework(framework);

        callback_object = {
            token_selected: sinon.spy(),
        };

        tile = {id: 2, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 50};
        other_tile = {id: 22, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 51};

        expected_tile_id = 'tile' + tile.id;
        expected_upper_half_id = 'upper_half' + tile.id;

        element = 'test ';
        minimum_size = 50;
        vertical_distance = 80;
        horizontal_distance = 24;
    });
    describe('Start selecting', function () {
        function act_default(x) {
            sut.start(x);
        };
        it('No tile', function () {
            // Arrange
            // Act
            act_default([]);
            // Assert
            sinon.assert.callCount(framework.subscribe, 0);
        });
        it('Single tile', function () {
            // Arrange
            // Act
            act_default([tile]);
            // Assert
            assert.equal(framework.subscribe.getCall(0).args.length, 3);
            assert.equal(framework.subscribe.getCall(0).args[0], tile.id);
            assert.equal(framework.subscribe.getCall(0).args[1], sut);
            assert.equal(framework.subscribe.getCall(0).args[2], 'token_selected');
        });
    });
    describe('Stop selecting', function () {
        function act_default(x) {
            sut.start(x);
            sut.stop();
        };
        it('No tile', function () {
            // Arrange
            // Act
            act_default([]);
            // Assert
            sinon.assert.callCount(framework.unsubscribe, 0);
        });
        it('Single tile', function () {
            // Arrange
            // Act
            act_default([tile]);
            // Assert
            assert.equal(framework.unsubscribe.getCall(0).args.length, 3);
            assert.equal(framework.unsubscribe.getCall(0).args[0], tile.id);
            assert.equal(framework.unsubscribe.getCall(0).args[1], sut);
            assert.equal(framework.unsubscribe.getCall(0).args[2], 'token_selected');
        });
    });
    describe('Tile selected', function () {
        function act_default(object, method, event) {
            sut.subscribe_token_selected(object, method);
            sut.token_selected(event);
        };
        it('token_selected', function () {
            // Arrange
            event = {srcElement: {}};
            // Act
            act_default(callback_object, 'token_selected', event);
            // Assert
            assert.equal(callback_object.token_selected.getCall(0).args.length, 1);
        });
    });
});
