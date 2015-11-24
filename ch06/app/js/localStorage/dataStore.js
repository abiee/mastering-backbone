'use strict';

var _ = require('underscore');
var crispy = require('crispy-string');

const ID_LENGTH = 10;

function generateId() {
  return crispy.base32String(ID_LENGTH);
}

class DataStore {
  constructor(name) {
    this.name = name;

    // Keep track of all ids stored for a particular collection
    this.index = this.getIndex();
  }

  getIndex() {
    var index = localStorage.getItem(this.name);
    return (index && index.split(',')) || [];
  }

  create(model) {
    // Assign an id to new models
    if (!model.id && model.id !== 0) {
      model.id = generateId();
      model.set(model.idAttribute, model.id);
    }

    // Save model in the store with an unique name,
    // e.g. collectionName-modelId
    localStorage.setItem(
      this.itemName(model.id), this.serialize(model)
    );

    // Keep track of stored id
    this.index.push(model.get(model.idAttribute));
    this.updateIndex();

    // Return stored model
    return this.find(model);
  }

  // Save the ids comma separated for a given collection
  updateIndex() {
    localStorage.setItem(this.name, this.index.join(','));
  }

  update(model) {
    // Overwrite the data stored in the store,
    // actually makes the update
    localStorage.setItem(
      this.itemName(model.id), this.serialize(model)
    );

    // Keep track of the model id in the collection
    var modelId = model.id.toString();
    if (_.indexOf((this.index, modelId)) >= 0) {
      this.index.push(modelId);
      this.updateIndex();
    }

    // Return stored model
    return this.find(model);
  }

  serialize(model) {
    return JSON.stringify(model.toJSON());
  }

  find(model) {
    return this.deserialize(
      localStorage.getItem(this.itemName(model.id))
    );
  }

  findAll() {
    var result = [];

    // Get all items with the id tracked for the given collection
    for (let i = 0, id, data; i < this.index.length; i++) {
      id = this.index[i];
      data = this.deserialize(localStorage.getItem(
        this.itemName(id)
      ));

      if (data) {
        result.push(data);
      }
    }

    return result;
  }

  deserialize(data) {
    return data ? JSON.parse(data) : null;
  }

  destroy(model) {
    // Remove item from the store
    localStorage.removeItem(this.itemName(model.id));

    // Rmoeve id from tracked ids
    var modelId = model.id.toString();
    for (let i = 0; i < this.index.length; i++) {
      if (this.index[i] === modelId) {
        this.index.splice(i, 1);
      }
    }
    this.updateIndex();

    return model;
  }

  itemName(id) {
    return this.name + '-' + id;
  }
}

module.exports = DataStore;
