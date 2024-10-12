var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/javascript/wildlife.js');

describe('wildlife wildlife', function () {
    beforeEach(function() {
        framework = {
            createToken: sinon.spy(),
            destroyToken: sinon.spy(),
            move: sinon.spy(),
            add_css_class: sinon.spy(),
            permanent_subscribe: sinon.spy(),
            subscribe_paint: sinon.spy(),
            unsubscribe_paint: sinon.spy(),
            add_css_class: sinon.spy(),
            remove_css_class: sinon.spy(),
        };
        token_subscriptions = {
        };
        dependencies = {framework: framework},

        callback_object = {
            token_selected: sinon.spy(),
        };
        callback_object2 = {
            token_selected: sinon.spy(),
        };

        wildlife = {id: 2, type: 3, unique_id: 'wildlife2'};
        other_wildlife = {id: 4, type: 3, unique_id: 'wildlife4'};
        expected_wildlife_id = wildlife.unique_id;

        element = 'test ';
        const object1 = {};

        Object.defineProperties(object1, {
          property1: {
            value: 42,
            writable: true,
          },
          property2: {},
        });
        Object.defineProperties(object1, {unique_id: {},});
        
        console.log(object1);
    });
    describe('Create token', function () {
        function act_default(wildlife) {
            sut = new sut_module(dependencies, wildlife);
        };
        it('createToken terrain_types[0]', function () {
            // Arrange
            // Act
            act_default(wildlife);
            // Assert
            assert.equal(framework.createToken.getCall(0).args.length, 3);
            assert.equal(framework.createToken.getCall(0).args[0], 'wildlife');
            assert.equal(framework.createToken.getCall(0).args[1], expected_wildlife_id);
            assert.equal(framework.createToken.getCall(0).args[2], 'wildlife' + wildlife.type);
        });
    });
    describe('Destroy token', function () {
        function act_default(wildlife) {
            sut = new sut_module(dependencies, wildlife);
            sut.destroy();
        };
        it('createToken terrain_types[0]', function () {
            // Arrange
            // Act
            act_default(wildlife);
            // Assert
            assert.equal(framework.destroyToken.getCall(0).args.length, 1);
            assert.equal(framework.destroyToken.getCall(0).args[0], expected_wildlife_id);
        });
        it('unRegister', function () {
            // Arrange
            // Act
            act_default(wildlife);
            // Assert
            assert.equal(framework.unsubscribe_paint.getCall(0).args.length, 1);
            assert.equal(framework.unsubscribe_paint.getCall(0).args[0].unique_id, wildlife.unique_id);
        });
    });
    describe('Move token', function () {
        function act_default(wildlife, element) {
            sut = new sut_module(dependencies, wildlife);
            sut.move(element);
            sut.paint();
        };
        it('expected_wildlife_id', function () {
            // Arrange
            // Act
            act_default(wildlife, element);
            // Assert
            assert.equal(framework.move.getCall(0).args[0], expected_wildlife_id);
            assert.equal(framework.move.getCall(0).args[1], element);
        });
    });
});
