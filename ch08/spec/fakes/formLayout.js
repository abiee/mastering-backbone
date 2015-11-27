'use strict';

var Common = require('../../app/js/common');

class FakeFormLayout extends Common.Layout {
  constructor(options) {
    super(options);
    this.template = '<div class="phone-list-container" />' +
                    '<div class="email-list-container" />';

    this.regions = {
      phones: '.phone-list-container',
      emails: '.email-list-container'
    };
  }
}

module.exports = FakeFormLayout;
