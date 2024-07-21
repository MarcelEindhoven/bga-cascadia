var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/BGA/javascript/framework.js');

describe('Framework', function () {
    beforeEach(function() {
        sut = new sut_module();

        dojo = {
            place: sinon.spy(),
        };
        sut.setDojo(dojo);

        block = {test: 'test'}
        gamegui = {
            placeOnObject: sinon.spy(),
            placeOnObjectPos: sinon.spy(),
            format_block: sinon.fake.returns(block),
        };
        sut.setGameGUI(gamegui);
    });
    describe('Create token', function () {
        function act_default(type, id) {
            sut.createToken(type, id);
        };
        it('format_block', function () {
            // Arrange
            type = 'type ';
            id = 'ID ';
            // Act
            act_default(type, id);
            // Assert
            sinon.assert.calledOnce(gamegui.format_block);
            sinon.assert.match(gamegui.format_block.getCall(0).args.length, 2);
            sinon.assert.match(gamegui.format_block.getCall(0).args[0], type);
            sinon.assert.match(gamegui.format_block.getCall(0).args[1].token_id, id);
        });
        it('place', function () {
            // Arrange
            type = 'type';
            id = 'ID';
            // Act
            act_default(type, id);
            // Assert
            sinon.assert.calledOnce(dojo.place);
            sinon.assert.match(dojo.place.getCall(0).args.length, 2);
            sinon.assert.match(dojo.place.getCall(0).args[0], block);
            sinon.assert.match(dojo.place.getCall(0).args[1], 'tokens');
        });
    });
    describe('Move token', function () {
        function act_default(id_to_move, destination_id, x = 0, y = 0) {
            sut.move(id_to_move, destination_id, x, y);
        };
        function assert_default(spy, id_to_move, destination_id) {
            sinon.assert.match(spy.getCall(0).args[0], id_to_move);
            sinon.assert.match(spy.getCall(0).args[1], destination_id);
        }
        it('placeOnObject', function () {
            // Arrange
            id_to_move = 'type';
            destination_id = 'ID';
            // Act
            act_default(id_to_move, destination_id);
            // Assert
            sinon.assert.calledOnce(gamegui.placeOnObject);
            sinon.assert.match(gamegui.placeOnObject.getCall(0).args.length, 2);
            assert_default(gamegui.placeOnObject, id_to_move, destination_id);
        });
        it('placeOnObjectPos', function () {
            // Arrange
            id_to_move = 'type';
            destination_id = 'ID';
            x = 1;
            y = 0;
            // Act
            act_default(id_to_move, destination_id, x, y);
            // Assert
            sinon.assert.calledOnce(gamegui.placeOnObjectPos);
            sinon.assert.match(gamegui.placeOnObjectPos.getCall(0).args.length, 4);
            assert_default(gamegui.placeOnObjectPos, id_to_move, destination_id);
        });
    });

});
