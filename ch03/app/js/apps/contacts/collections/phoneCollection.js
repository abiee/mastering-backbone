'use strict';

App.Collections = App.Collections || {};

class PhoneCollection extends Backbone.Collection {
  constructor(options) {
    super(options);
  }

  get model() {
    return App.Models.Phone;
  }
}

App.Collections.PhoneCollection = PhoneCollection;
