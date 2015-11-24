'use strict';

var CollectionView = require('../../../common').CollectionView;
var ContactListItemView = require('./contactListItemView');

class ContactListView extends CollectionView {
  constructor(options) {
    super(options);
    this.modelView = ContactListItemView;
  }

  get className() {
    return 'contact-list';
  }
}

module.exports = ContactListView;
