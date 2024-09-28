var assert = require('assert');
var sinon = require('sinon');

var sut_module = require('../export/modules/javascript/usecase_setup.js');

class habitat_tile_class {
    constructor(x, y) {habitat_tile_constructor (x, y);this.value_from_constructor = x;}
};

class habitat_class {
    constructor(x, player_id) {habitat_constructor (x, player_id);this.value_from_constructor = x;}
    place(tile) {place_tile(tile);}
};

describe('Use case Setup', function () {
    beforeEach(function() {
        player_id = 125;

        framework = {
            add_css_class: sinon.spy(),
            mark_as_selectable: sinon.spy(),
            resize: sinon.spy(),
        };
        
        // Note that the following statement also calls constructor
        habitat_tile_factory = {class:habitat_tile_class, dependencies: 9, create: function(tile_specification) {return new this.class(this.dependencies, tile_specification);}};
        habitat_factory = {class:habitat_class, dependencies: 7, create: function(player_id) {return new this.class(this.dependencies, player_id);}};

        dependencies = {framework: framework, habitat_tile_factory: habitat_tile_factory, habitat_factory: habitat_factory};
        habitat_tile_constructor = sinon.spy();
        tile_create = sinon.spy();
        habitat_constructor = sinon.spy();
        place_tile = sinon.spy();

        habitat = {
            place: sinon.spy(),
            remove: sinon.spy(),
        };

        token_subscriptions = {
            subscribe: sinon.spy(),
            unsubscribe: sinon.spy(),
        };

        callback_object = {
            tile_placed: sinon.spy(),
        };
        sut = new sut_module(dependencies);

        tile = {id: 2, terrain_types: [1], supported_wildlife: [2], horizontal: 50, vertical: 50, unique_id: 'tile2'};
        expected_candidate_tile = {horizontal: 50, vertical: 51};
    });
    describe('Habitats', function () {
        function act_default(data) {
            gamedatas = {habitat: data};
            sut.setup(gamedatas);
        };
        it('No habitats', function () {
            // Arrange
            // Act
            act_default({});
            // Assert
            assert.equal(Object.keys(sut.get_habitats()).length, 0);
        });
        it('habitat constructor', function () {
            // Arrange
            // Act
            act_default({23: []});
            // Assert
            assert.equal(habitat_constructor.getCall(0).args[0], habitat_factory.dependencies);
            assert.equal(habitat_constructor.getCall(0).args[1], 23);
        });
        it('Single habitats', function () {
            // Arrange
            // Act
            act_default({23: []});
            // Assert
            assert.equal(Object.keys(sut.get_habitats()).length, 1);
        });
        it('Construct tile', function () {
            // Arrange
            // Act
            act_default({23: [tile]});
            // Assert
            assert.equal(habitat_tile_constructor.getCall(0).args[0], habitat_tile_factory.dependencies);
            assert.equal(habitat_tile_constructor.getCall(0).args[1], tile);
        });
        it('Place tile', function () {
            // Arrange
            // Act
            act_default({23: [tile]});
            // Assert
            assert.equal(place_tile.getCall(0).args[0].value_from_constructor, habitat_tile_factory.dependencies);
        });
    });
});
