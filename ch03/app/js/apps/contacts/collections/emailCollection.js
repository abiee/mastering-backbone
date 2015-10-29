'use strict';

App.Collections = App.Collections || {};

class EmailCollection extends Backbone.Collection {
  constructor(options) {
    super(options);
  }

  get model() {
    return App.Models.Email;
  }
}

App.Collections.EmailCollection = EmailCollection;
