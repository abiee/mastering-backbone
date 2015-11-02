'use strict';

var CollectionView = require('../../../common').CollectionView;
var PhoneListItemView = require('./phoneListItemView');

class PhoneListView extends CollectionView {
  constructor(options) {
    super(options);
    this.modelView = PhoneListItemView;
  }
}

module.exports = PhoneListView;
