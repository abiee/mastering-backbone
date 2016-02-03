'use strict';

var ModelView = require('../../../common').ModelView;
var template = require('../templates/contactViewCallLog.tpl');

class ContactCallLog extends ModelView {
  constructor(options) {
    super(options);
    this.template = template;
  }

  get className() {
    return 'panel panel-simple';
  }
}

module.exports = ContactCallLog;
