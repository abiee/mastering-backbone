'use strict';

var Layout = require('../../../common').Layout;
var template = require('../templates/contactListLayout.tpl');

class ContactListLayout extends Layout {
  constructor(options) {
    super(options);
    this.template = template;
    this.regions = {
      actions: '.actions-bar-container',
      list: '.list-container'
    };
  }

  get className() {
    return 'row page-container';
  }
}

module.exports = ContactListLayout;
