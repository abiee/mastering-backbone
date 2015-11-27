'use strict';

var Layout = require('../../../common').Layout;
var template = require('../templates/contactFormLayout.tpl');

class ContactFormLayout extends Layout {
  constructor(options) {
    super(options);
    this.template = template;
    this.regions = {
      preview: '#preview-container',
      form: '#form-container'
    };
  }

  get className() {
    return 'row page-container';
  }
}

module.exports = ContactFormLayout;
