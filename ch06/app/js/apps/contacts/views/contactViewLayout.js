'use strict';

var Layout = require('../../../common').Layout;
var template = require('../templates/contactViewLayout.tpl');

class ContactViewLayout extends Layout {
  constructor(options) {
    super(options);
    this.template = template;
    this.regions = {
      widget: '#contact-widget',
      about: '#about-container',
      calls: '#call-log-container'
    };
  }

  get className() {
    return 'row page-container';
  }
}

module.exports = ContactViewLayout;
