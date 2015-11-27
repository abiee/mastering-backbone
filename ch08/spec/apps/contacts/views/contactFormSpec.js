var Backbone = require('backbone');
var ContactForm = require('../../../../app/js/apps/contacts/views/contactForm');

describe('Contact form', () => {
  var fakeContact;

  beforeEach(() => {
    fakeContact = new Backbone.Model({
      name: 'John Doe',
      facebook: 'https://www.facebook.com/john.doe',
      twitter: '@john.doe',
      github: 'https://github.com/johndoe',
      google: 'https://plus.google.com/johndoe'
    });
  });

  it('has the rigth class', () => {
    var view = new ContactForm({model: fakeContact});
    expect(view.className).toEqual('form-horizontal');
  });

  it('renders the rigth HTML', () => {
    var view = new ContactForm({model: fakeContact});

    view.render();

    expect(view.$el.html()).toContain(fakeContact.get('name'));
    expect(view.$el.html()).toContain(fakeContact.get('facebook'));
    expect(view.$el.html()).toContain(fakeContact.get('twitter'));
    expect(view.$el.html()).toContain(fakeContact.get('github'));
    expect(view.$el.html()).toContain(fakeContact.get('google'));
  });

  it('triggers a form:save event when save button is cliecked', () => {
    var view = new ContactForm({model: fakeContact});
    var callback = jasmine.createSpy('callback');

    view.on('form:save', callback);
    view.render();

    // Emulate a user click
    view.$el.find('#save').trigger('click');

    expect(callback).toHaveBeenCalled();
  });

  it('updates the model when the save button is clicked', () => {
    var view = new ContactForm({model: fakeContact});
    var callback = jasmine.createSpy('callback');
    var expectedValues = {
      name: 'Jane Doe',
      facebook: 'https://www.facebook.com/example',
      twitter: '@example',
      github: 'https://github.com/example',
      google: 'https://plus.google.com/example'
    };

    view.on('form:save', callback);
    view.render();

    // Change the input fields
    view.$el.find('#name').val(expectedValues.name);
    view.$el.find('#facebook').val(expectedValues.facebook);
    view.$el.find('#twitter').val(expectedValues.twitter);
    view.$el.find('#github').val(expectedValues.github);
    view.$el.find('#google').val(expectedValues.google);

    // Emulate a change events on all input fields
    view.$el.find('input').trigger('change');

    // Emulate a user click
    view.$el.find('#save').trigger('click');

    // Get the argument passed to the callback function
    var callArgs = callback.calls.argsFor(0);
    var model = callArgs[0];

    expect(model.get('name')).toEqual(expectedValues.name);
    expect(model.get('facebook')).toEqual(expectedValues.facebook);
    expect(model.get('twitter')).toEqual(expectedValues.twitter);
    expect(model.get('github')).toEqual(expectedValues.github);
    expect(model.get('google')).toEqual(expectedValues.google);
  });
});
