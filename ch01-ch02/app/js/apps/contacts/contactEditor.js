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
  }
}

class ContactForm extends ModelView {
  constructor(options) {
    super(options);
    this.template = '#contact-form';
  }

  get className() {
    return 'form-horizontal';
  }

  get events() {
    return {
      'click #save': 'saveContact',
      'click #cancel': 'cancel'
    };
  }

  serializeData() {
    return _.defaults(this.model.toJSON(), {
      name: '',
      age: '',
      phone: '',
      email: '',
      address1: '',
      address2: ''
    });
  }

  saveContact(event) {
    event.preventDefault();
    this.model.set('name', this.getInput('#name'));
    this.model.set('phone', this.getInput('#phone'));
    this.model.set('email', this.getInput('#email'));
    this.model.set('address1', this.getInput('#address1'));
    this.model.set('address2', this.getInput('#address2'));
    this.model.set('facebook', this.getInput('#facebook'));
    this.model.set('twitter', this.getInput('#twitter'));
    this.model.set('google', this.getInput('#google'));
    this.model.set('github', this.getInput('#github'));
    this.trigger('form:save', this.model);
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
    // Create the views
    var layout = new ContactFormLayout({model: contact});
    var contactForm = new ContactForm({model: contact});
    var contactPreview = new ContactPreview({model: contact});

    // Render the views
    this.region.show(layout);
    layout.getRegion('form').show(contactForm);
    layout.getRegion('preview').show(contactPreview);

    this.listenTo(contactForm, 'form:save', this.saveContact);
    this.listenTo(contactForm, 'form:cancel', this.cancel);
  }

  saveContact(contact) {
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
