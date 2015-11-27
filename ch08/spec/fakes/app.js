'use strict';

var _ = require('underscore');
var Backbone = require('backbone');

var fakeRouter = {
  navigate: jasmine.createSpy()
};

var FakeApp = {
  router:  fakeRouter,

  notifySuccess(message) {
    this.lastSuccessMessage= message;
  },

  notifyError(message) {
    this.lastErrorMessage = message;
  },

  reset() {
    delete this.lastSuccessMessage;
    delete this.lastErrorMessage;
    this.router.navigate = jasmine.createSpy();
  }
};

_.extend(FakeApp, Backbone.Events);

module.exports = FakeApp;
