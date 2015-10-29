'use strict';

class ContactFormLayout extends Layout {
  constructor(options) {
    super(options);
    this.template = '#contact-form-layout';
    this.regions = {
      preview: '#preview-container',
      form: '#form-container'
    };
  }

  get className() {
    return 'row page-container';
  }
}

class ContactPreview extends ModelView {
  constructor(options) {
    super(options);
    this.template = '#contact-form-preview';

    this.model.on('change', this.render, this);
  }
}

class PhoneListItemView extends ModelView {
  constructor(options) {
    super(options);
    this.template = '#contact-form-phone-item';
  }

  get className() {
    return 'form-group';
  }

  get events() {
    return {
      'change .description': 'updateDescription',
      'change .phone': 'updatePhone',
      'click a': 'deletePhone'
    };
  }

  updateDescription() {
    var $el = this.$('.description');
    this.model.set('description', $el.val());
  }

  updatePhone() {
    var $el = this.$('.phone');
    this.model.set('phone', $el.val());
  }

  deletePhone(event) {
    event.preventDefault();
    this.trigger('phone:deleted', this.model);
  }
}

class PhoneListView extends CollectionView {
  constructor(options) {
    super(options);
    this.modelView = PhoneListItemView;
  }
}

class EmailListItemView extends ModelView {
  constructor(options) {
    super(options);
    this.template = '#contact-form-email-item';
  }

  get className() {
    return 'form-group';
  }

  get events() {
    return {
      'change .description': 'updateDescription',
      'change .phone': 'updateEmail',
      'click a': 'deleteEmail'
    };
  }

  updateDescription() {
    var $el = this.$('.description');
    this.model.set('description', $el.val());
  }

  updateEmail() {
    var $el = this.$('.email');
    this.model.set('email', $el.val());
  }

  deleteEmail(event) {
    event.preventDefault();
    this.trigger('email:deleted', this.model);
  }
}

class EmailListView extends CollectionView {
  constructor(options) {
    super(options);
    this.modelView = EmailListItemView;
  }
}

class ContactForm extends Layout {
  constructor(options) {
    super(options);
    this.template = '#contact-form';
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
    Backbone.Validation.bind(this);
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

class ContactEditor {
  constructor(options) {
    this.region = options.region;

    // Allow subapplication to listen and trigger events,
    // useful for subapplication wide events
    _.extend(this, Backbone.Events);
  }

  showEditor(contact) {
    // Data
    var phonesData = contact.get('phones') || [];
    var emailsData = contact.get('emails') || [];
    this.phones = new App.Collections.PhoneCollection(phonesData);
    this.emails = new App.Collections.EmailCollection(emailsData);

    // Create the views
    var layout = new ContactFormLayout({model: contact});
    var phonesView = new PhoneListView({collection: this.phones});
    var emailsView = new EmailListView({collection: this.emails});
    var contactForm = new ContactForm({model: contact});
    var contactPreview = new ContactPreview({model: contact});

    // Render the views
    this.region.show(layout);
    layout.getRegion('form').show(contactForm);
    layout.getRegion('preview').show(contactPreview);
    contactForm.getRegion('phones').show(phonesView);
    contactForm.getRegion('emails').show(emailsView);

    this.listenTo(contactForm, 'form:save', this.saveContact);
    this.listenTo(contactForm, 'form:cancel', this.cancel);
    this.listenTo(contactForm, 'phone:add', this.addPhone);
    this.listenTo(contactForm, 'email:add', this.addEmail);

    this.listenTo(phonesView, 'item:phone:deleted', (view, phone) => {
      this.deletePhone(phone);
    });
    this.listenTo(emailsView, 'item:email:deleted', (view, email) => {
      this.deleteEmail(email);
    });
  }

  saveContact(contact) {
    var phonesData = this.phones.toJSON();
    var emailsData = this.emails.toJSON();

    contact.set({
      phones: phonesData,
      emails: emailsData
    });

    if (!contact.isValid(true)) {
      return;
    }

    contact.save(null, {
      success() {
        // Redirect user to contact list after save
        App.notifySuccess('Contact saved');
        App.router.navigate('contacts', true);
      },
      error() {
        // Show error message if something goes wrong
        App.notifyError('Something goes wrong');
      }
    });
  }

  addPhone() {
    this.phones.add({});
  }

  addEmail() {
    this.emails.add({});
  }

  deletePhone(phone) {
    this.phones.remove(phone);
  }

  deleteEmail(email) {
    this.emails.remove(email);
  }

  cancel() {
    // Warn user before make redirection to prevent accidental
    // cencel
    App.askConfirmation('Changes will be lost', isConfirm => {
      if (isConfirm) {
        App.router.navigate('contacts', true);
      }
    });
  }

  // Close any active view and remove event listeners
  // to prevent zombie functions
  destroy() {
    this.region.remove();
    this.stopListening();
  }
}
