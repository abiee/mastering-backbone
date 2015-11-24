'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const TTL = 15 * MINUTES;

function getStore(model) {
  return model.dataStore;
}

function cacheExpire(data) {
  if (data && data.fetchedAt) {
    let now = new Date();
    let fetchedAt = new Date(data.fetchedAt);
    let difference = now.getTime() - fetchedAt.getTime();

    return difference > TTL;
  }

  return false;
}

function getCachedModel(model) {
  var store = getStore(model);

  // If model does not support localStorage cache or is a
  // collection
  if (!store && !model.id) {
    return null;
  }

  var data = store.find(model);

  if (cacheExpire(data)) {
    dropCache(store, model);
    data = null;
  }

  return data;
}

function updateCache(store, model) {
  // Ignore if cache is not supported for the model
  if (store) {
    var cachedModel = store.find(model);

    // Use fetchedAt attribute mdoel is already cached
    if (cachedModel && cachedModel.fetchedAt) {
      model.set('fetchedAt', cachedModel.fetchedAt);
    } else {
      model.set('fetchedAt', new Date());
    }

    store.update(model);
  }
}

function dropCache(store, model) {
  // Ignore if cache is not supported for the model
  if (store) {
    store.destroy(model);
  }
}

function cacheResponse(method, store, model) {
  if (method !== 'delete') {
    updateCache(store, model);
  } else {
    dropCache(store, model);
  }
}

module.exports =  _.wrap(Backbone.sync, (sync, method, model, options) => {
  var store = getStore(model);

  // Try to read from cache store
  if (method === 'read') {
    let cachedModel = getCachedModel(model);

    if (cachedModel) {
      let defer = Backbone.$.Deferred();
      defer.resolve(cachedModel);

      if (options && options.success) {
        options.success(cachedModel);
      }

      return defer.promise();
    }
  }

  return sync(method, model, options).then((data) => {
    // When getting a collection data is an array, if is a
    // model is a single object. Ensure that data is always
    // an array
    if (!_.isArray(data)) {
      data = [data];
    }

    data.forEach(item => {
      let model = new Backbone.Model(item);
      cacheResponse(method, store, model);
    });
  });
});
