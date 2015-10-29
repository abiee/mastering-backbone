'use strict';

App.Models = App.Models || {};

class Phone extends Backbone.Model {
  get defaults() {
    return {
      description: '',
      phone: ''
    };
  }
}

App.Models.Phone = Phone;
