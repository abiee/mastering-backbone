'use strict';

var ModelView = require('../../../common').ModelView;
var template = require('../templates/contactFormPreview.tpl');

class ContactPreview extends ModelView {
  constructor(options) {
    super(options);
    this.template = template;

    this.model.on('change', this.render, this);
  }
}

module.exports = ContactPreview;
