'use strict';

var Backbone = require('backbone');
var crispy = require('crispy-string');

const ID_LENGTH = 10;

var contacts = [{
  id: '1',
  name: 'John Doe',
  phones: [{
    description: 'home',
    phone: '(333) 364 27364'
  }],
  emails: [{
    description: 'personal',
    email: 'john.doe@example.com'
  }, {
    description: 'work',
    email: 'john.doe@acme.com'
  }],
  address1: 'Cuarzo Street 2369',
  facebook: 'https://www.facebook.com/John.Doe',
  avatar: {
    url: 'http://www.minicoming.com/wp-content/miniwallpaper/20121202/1stezb0dwni2650.jpg'
  }
}, {
  id: '2',
  name: 'Jane Doe',
  emails: [{
    description: 'personal',
    email: 'jane.doe@example.com'
  }],
  address1: 'Tortilla Street 364',
  facebook: 'https://www.facebook.com/John.Doe',
  twitter: 'https://twitter.com/thejanedoe'
}, {
  id: '3',
  name: 'Abiee Alejandro',
  emails: [{
    description: 'personal',
    email: 'abiee@echamea.com'
  }],
  address1: 'Cuarzo 2369',
  facebook: 'https://www.facebook.com/abiee.alejandro',
  twitter: 'https://twitter.com/AbieeAlejandro',
  github: 'https://github.com/abiee'
}, {
  id: '4',
  name: 'Omare',
  email: 'me@omar-e.com',
  address1: 'Del Árbol street'
}];

class DataStore {
  constructor() {
    this.databaseName = 'contacts';
  }

  create(model) {
    var defer = Backbone.$.Deferred();

    // Assign an id to new models
    if (!model.id && model.id !== 0) {
      let id = this.generateId();
      model.set(model.idAttribute, id);
    }

    // Get the database connection
    this.openDatabase()
      .then(db => this.store(db, model))
      .then(result => defer.resolve(result));

    return defer.promise();
  }

  generateId() {
    return crispy.base32String(ID_LENGTH);
  }

  update(model) {
    var defer = Backbone.$.Deferred();

    // Get the database connection
    this.openDatabase()
      .then(db => this.store(db, model))
      .then(result => defer.resolve(result));

    return defer.promise();
  }

  store(db, model) {
    var defer = Backbone.$.Deferred();

    // Get the name of the object store
    var storeName = model.store;

    // Get the object store handler
    var tx = db.transaction(storeName, 'readwrite');
    var store = tx.objectStore(storeName);

    // Save the model in the store
    var obj = model.toJSON();
    store.put(obj);

    tx.oncomplete = function() {
      defer.resolve(obj);
    };

    tx.onerror = function() {
      defer.reject(obj);
    };

    return defer.promise();
  }

  destroy(model) {
    var defer = Backbone.$.Deferred();

    // Get the database connection
    this.openDatabase().then(function(db) {
      // Get the name of the object store
      let storeName = model.store;

      // Get the store handler
      var tx = db.transaction(storeName, 'readwrite');
      var store = tx.objectStore(storeName);

      // Delete object from the database
      let obj = model.toJSON();
      store.delete(model.id);

      tx.oncomplete = function() {
        defer.resolve(obj);
      };

      tx.onerror = function() {
        defer.reject(obj);
      };
    });

    return defer.promise();
  }

  findAll(model) {
    var defer = Backbone.$.Deferred();

    // Get the database connection
    this.openDatabase().then(db => {
      let result = [];

      // Get the name of the object store
      let storeName = model.store;

      // Get the store handler
      let tx = db.transaction(storeName, 'readonly');
      let store = tx.objectStore(storeName);

      // Open the query cursor
      let request = store.openCursor();

      // onsuccess callback will be called for each record
      // found for the query
      request.onsuccess = function() {
        let cursor = request.result;

        // Cursor will be null at the end of the cursor
        if (cursor) {
          result.push(cursor.value);

          // Go to the next record
          cursor.continue();
        } else {
          defer.resolve(result);
        }
      };
    });

    return defer.promise();
  }

  find(model) {
    var defer = Backbone.$.Deferred();

    // Get the database connection
    this.openDatabase().then(db => {
      // Get the name of the collection/store
      let storeName = model.store;

      // Get the store handler
      let tx = db.transaction(storeName, 'readonly');
      let store = tx.objectStore(storeName);

      // Open the query cursor
      let request = store.openCursor(IDBKeyRange.only(model.id));

      request.onsuccess = function() {
        let cursor = request.result;

        // Cursor will be null if record was not found
        if (cursor) {
          defer.resolve(cursor.value);
        } else {
          defer.reject();
        }
      };
    });

    return defer.promise();
  }

  openDatabase() {
    var defer = Backbone.$.Deferred();

    // If a database connection is already active use it,
    // otherwise open a new connection
    if (this.db) {
      defer.resolve(this.db);
    } else {
      let request = indexedDB.open(this.databaseName, 1);

      request.onupgradeneeded = () => {
        let db = request.result;
        this.createStores(db);
      };

      request.onsuccess = () => {
        // Cache recently opened connection
        this.db = request.result;
        defer.resolve(this.db);
      };
    }

    return defer.promise();
  }

  createStores(db) {
    var store = db.createObjectStore('contacts', {keyPath: 'id'});

    // Create the first records
    contacts.forEach(contact => {
      store.put(contact);
    });
  }
}

module.exports = DataStore;
