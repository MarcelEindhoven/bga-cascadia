var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/BGA/javascript/framework.js');

describe('Framework', function () {
    beforeEach(function() {
        sut = new sut_module();

        query_result = {
            connect: sinon.stub(),
        };
        dojo = {
            place: sinon.spy(),
            addClass: sinon.spy(),
            removeClass: sinon.spy(),
            style: sinon.spy(),
            disconnect: sinon.spy(),
            query: sinon.stub().returns(query_result),
            destroy: sinon.spy(),
        };

        sut.setDojo(dojo);

        block = {test: 'test'}
        gamegui = {
            placeOnObject: sinon.spy(),
            placeOnObjectPos: sinon.spy(),
            format_block: sinon.fake.returns(block),
        };
        sut.setGameGUI(gamegui);

        UI_element1 = {
            paint: sinon.stub(),
        };
        UI_element2 = {
            paint: sinon.stub(),
        };
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
    describe('Destroy token', function () {
            function act_default(id) {
                sut.destroyToken(id);
            };
            it('destroy', function () {
                // Arrange
                id = 'ID ';
                // Act
                act_default(id);
                // Assert
                sinon.assert.calledOnce(dojo.destroy);
                assert.equal(dojo.destroy.getCall(0).args.length, 1);
                assert.equal(dojo.destroy.getCall(0).args[0], id);
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
            sut.add_css_class(id, type);
        };
        it('addClass', function () {
            // Arrange
            id = 'ID';
            type = 'upper_half5';
            // Act
            act_default(id, type);
            // Assert
            sinon.assert.calledOnce(dojo.addClass);
            assert.equal(dojo.addClass.getCall(0).args.length, 2);
            assert.equal(dojo.addClass.getCall(0).args[0], id);
            assert.equal(dojo.addClass.getCall(0).args[1], type);
        });
        it('removeClass', function () {
            // Arrange
            id = 'ID';
            type = 'upper_half6';
            // Act
            act_default(id, type);
            sut.remove_css_class(id, type);
            // Assert
            sinon.assert.calledOnce(dojo.removeClass);
            assert.equal(dojo.removeClass.getCall(0).args.length, 2);
            assert.equal(dojo.removeClass.getCall(0).args[0], id);
            assert.equal(dojo.removeClass.getCall(0).args[1], type);
        });
    });
    describe('Resize', function () {
        function act_default(id, width, height) {
            sut.resize(id, width, height);
        };
        it('Style called width', function () {
            // Arrange
            id = 'ID';
            width = 200;
            height = 100;
            // Act
            act_default(id, width, height);
            // Assert
            assert.equal(dojo.style.getCall(0).args.length, 3);
            assert.equal(dojo.style.getCall(0).args[0], id);
            assert.equal(dojo.style.getCall(0).args[1], 'width');
            assert.equal(dojo.style.getCall(0).args[2], '' + width + 'px');
        });
        it('Style called height', function () {
            // Arrange
            id = 'ID';
            width = 200;
            height = 100;
            // Act
            act_default(id, width, height);
            // Assert
            assert.equal(dojo.style.getCall(1).args.length, 3);
            assert.equal(dojo.style.getCall(1).args[0], id);
            assert.equal(dojo.style.getCall(1).args[1], 'height');
            assert.equal(dojo.style.getCall(1).args[2], '' + height + 'px');
        });
    });
    describe('Subscribe', function () {
        function act_default(id, object, method) {
            sut.permanent_subscribe(id, object, method);
        };
        it('addClass', function () {
            // Arrange
            id = 'ID';
            object = 'wildlife5';
            method = 'habitat_selected';
            // Act
            act_default(id, object, method);
            // Assert
            sinon.assert.calledOnce(dojo.addClass);
            assert.equal(dojo.addClass.getCall(0).args.length, 2);
            assert.equal(dojo.addClass.getCall(0).args[0], id);
            assert.equal(dojo.addClass.getCall(0).args[1], 'subscribe');
        });
        it('query', function () {
            // Arrange
            id = 'ID';
            object = 'wildlife5';
            method = 'habitat_selected';
            // Act
            act_default(id, object, method);
            // Assert
            sinon.assert.calledOnce(dojo.query);
            assert.equal(dojo.query.getCall(0).args.length, 1);
            assert.equal(dojo.query.getCall(0).args[0], '.subscribe');
        });
        it('connect', function () {
            // Arrange
            id = 'ID';
            object = 'wildlife5';
            method = 'habitat_selected';
            // Act
            act_default(id, object, method);
            // Assert
            sinon.assert.calledOnce(query_result.connect);
            assert.equal(query_result.connect.getCall(0).args.length, 3);
            assert.equal(query_result.connect.getCall(0).args[0], 'onclick');
            assert.equal(query_result.connect.getCall(0).args[1], object);
            assert.equal(query_result.connect.getCall(0).args[2], method);
        });
        it('removeClass', function () {
            // Arrange
            id = 'ID';
            object = 'wildlife5';
            method = 'habitat_selected';
            // Act
            act_default(id, object, method);
            // Assert
            sinon.assert.calledOnce(dojo.removeClass);
            assert.equal(dojo.removeClass.getCall(0).args.length, 2);
            assert.equal(dojo.removeClass.getCall(0).args[0], id);
            assert.equal(dojo.removeClass.getCall(0).args[1], 'subscribe');
        });
    });
    describe('Paint', function () {
        function act_default() {
            sut.control_may_be_returned_to_user();
        };
        it('No UI elements', function () {
            // Arrange
            // Act
            act_default();
            // Assert
        });
        it('UI elements', function () {
            // Arrange
            sut.subscribe_paint(UI_element1);
            sut.subscribe_paint(UI_element2);
            // Act
            act_default();
            // Assert
            sinon.assert.calledOnce(UI_element1.paint);
            sinon.assert.calledOnce(UI_element2.paint);
        });
        it('UI element', function () {
            // Arrange
            sut.subscribe_paint(UI_element1);
            // Act
            act_default();
            // Assert
            sinon.assert.calledOnce(UI_element1.paint);
        });
        it('UI elements', function () {
            // Arrange
            sut.subscribe_paint(UI_element1);
            sut.subscribe_paint(UI_element2);
            // Act
            sut.unsubscribe_paint(UI_element1);
            act_default();
            // Assert
            sinon.assert.notCalled(UI_element1.paint);
            sinon.assert.calledOnce(UI_element2.paint);
        });
    });

});
