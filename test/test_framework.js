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
            placeOnObjectPos: sinon.spy(),
            format_block: sinon.fake.returns(block),
        };
        sut.setGameGUI(gamegui);
    });
    describe('Create element', function () {
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
            gamegui.format_block.getCall(0).args[0] = type;
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
});
