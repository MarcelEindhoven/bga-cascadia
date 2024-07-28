var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/BGA/javascript/framework.js');

describe('Framework', function () {
    beforeEach(function() {
        sut = new sut_module();

        dojo = {
            place: sinon.spy(),
            addClass: sinon.spy(),
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
        function act_default(category, id, type = 1) {
            sut.createToken(category, id, type);
        };
        it('format_block', function () {
            // Arrange
            category = 'category ';
            id = 'ID ';
            // Act
            act_default(category, id);
            // Assert
            sinon.assert.calledOnce(gamegui.format_block);
            assert.equal(gamegui.format_block.getCall(0).args.length, 2);
            assert.equal(gamegui.format_block.getCall(0).args[0], category);
            assert.equal(gamegui.format_block.getCall(0).args[1].token_id, id);
        });
        it('place', function () {
            // Arrange
            category = 'category';
            id = 'ID';
            // Act
            act_default(category, id);
            // Assert
            sinon.assert.calledOnce(dojo.place);
            assert.equal(dojo.place.getCall(0).args.length, 2);
            assert.equal(dojo.place.getCall(0).args[0], block);
            assert.equal(dojo.place.getCall(0).args[1], 'tokens');
        });
        it('colour', function () {
            // Arrange
            category = 'field_wildlife';
            id = 'ID';
            type = 'wildlife5';
            // Act
            act_default(category, id, type);
            // Assert
            sinon.assert.calledOnce(dojo.addClass);
            assert.equal(dojo.addClass.getCall(0).args.length, 2);
            assert.equal(dojo.addClass.getCall(0).args[0], id);
            assert.equal(dojo.addClass.getCall(0).args[1], 'wildlife5');
        });
    });
    describe('Move token', function () {
        function act_default(id_to_move, destination_id, x = 0, y = 0) {
            sut.move(id_to_move, destination_id, x, y);
        };
        function assert_default(spy, id_to_move, destination_id) {
            assert.equal(spy.getCall(0).args[0], id_to_move);
            assert.equal(spy.getCall(0).args[1], destination_id);
        }
        it('placeOnObject', function () {
            // Arrange
            id_to_move = 'category';
            destination_id = 'ID';
            // Act
            act_default(id_to_move, destination_id);
            // Assert
            sinon.assert.calledOnce(gamegui.placeOnObject);
            assert.equal(gamegui.placeOnObject.getCall(0).args.length, 2);
            assert_default(gamegui.placeOnObject, id_to_move, destination_id);
        });
        it('placeOnObjectPos', function () {
            // Arrange
            id_to_move = 'category';
            destination_id = 'ID';
            x = 1;
            y = 0;
            // Act
            act_default(id_to_move, destination_id, x, y);
            // Assert
            sinon.assert.calledOnce(gamegui.placeOnObjectPos);
            assert.equal(gamegui.placeOnObjectPos.getCall(0).args.length, 4);
            assert_default(gamegui.placeOnObjectPos, id_to_move, destination_id);
        });
    });
    describe('Classify token', function () {
        function act_default(id, type) {
            sut.classify(id, type);
        };
        it('colour', function () {
            // Arrange
            id = 'ID';
            type = 'wildlife5';
            // Act
            act_default(id, type);
            // Assert
            sinon.assert.calledOnce(dojo.addClass);
            assert.equal(dojo.addClass.getCall(0).args.length, 2);
            assert.equal(dojo.addClass.getCall(0).args[0], id);
            assert.equal(dojo.addClass.getCall(0).args[1], 'wildlife5');
        });
    });

});
