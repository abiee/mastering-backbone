'use strict';

var CollectionView = require('../../../common').CollectionView;
var EmailListItemView = require('./emailListItemView');

class EmailListView extends CollectionView {
  constructor(options) {
    super(options);
    this.modelView = EmailListItemView;
  }
}

module.exports = EmailListView;
