'use strict';

var _ = require('underscore');
var BackboneValidation = require('backbone-validation');
var Layout = require('../../../common').Layout;
var template = require('../templates/contactForm.tpl');

class ContactForm extends Layout {
  constructor(options) {
    super(options);
    this.template = template;
    this.regions = {
      phones: '.phone-list-container',
      emails: '.email-list-container'
    };
  }

  get className() {
    return 'form-horizontal';
  }

  get events() {
    return {
      'change input': 'inputChanged',
      'keyup input': 'inputChanged',
      'click #new-phone': 'addPhone',
      'click #new-email': 'addEmail',
      'click #save': 'saveContact',
      'click #cancel': 'cancel'
    };
  }

  serializeData() {
    return _.defaults(this.model.toJSON(), {
      name: '',
      age: '',
      address1: '',
      address2: ''
    });
  }

  onRender() {
    BackboneValidation.bind(this);
  }

  addPhone() {
    this.trigger('phone:add');
  }

  addEmail() {
    this.trigger('email:add');
  }

  saveContact(event) {
    event.preventDefault();
    this.trigger('form:save', this.model);
  }

  inputChanged(event) {
    var $target = $(event.target);
    var value = $target.val();
    var id = $target.attr('id');
    this.model.set(id, value);
  }

  getInput(selector) {
    return this.$el.find(selector).val();
  }

  cancel() {
    this.trigger('form:cancel');
  }
}

module.exports = ContactForm;
