var proxyquery = require('proxyquireify')(require);
var Backbone = require('backbone');

var FakeApp = require('../../fakes/app');
var FakeRegion = require('../../fakes/region');
var FakeFormLayout = require('../../fakes/formLayout');

var fakes = {
  '../../app': FakeApp,
  './views/contactPreview': Backbone.View,
  './views/phoneListView': Backbone.View,
  './views/emailListView': Backbone.View,
  './views/contactForm': FakeFormLayout,
  './collections/phoneCollection': Backbone.Collection,
  './collections/emailCollection': Backbone.Collection
};

var ContactEditor = proxyquery('../../../app/js/apps/contacts/contactEditor', fakes);

describe('Contact editor', () => {
  var fakeContact;
  var editor;
  var region;

  beforeEach(() => {
    region = new FakeRegion();
    editor = new ContactEditor({region});
    fakeContact = new Backbone.Model({
      name: 'John Doe',
      facebook: 'https://www.facebook.com/john.doe',
      twitter: '@john.doe',
      github: 'https://github.com/johndoe',
      google: 'https://plus.google.com/johndoe'
    });
  });

  describe('showing a contact editor', () => {
    it('renders the editor in the given region', () => {
      spyOn(region, 'show').and.callThrough();
      editor.showEditor(fakeContact);
      expect(region.show).toHaveBeenCalled();
    });

    it('binds the avatar:selected event in the contact preview', () => {
      var expectedBlob = new Blob(['just text'], {type: 'text/plain'});

      editor.showEditor(fakeContact);
      editor.uploadAvatar = jasmine.createSpy(); // To prevent side effects

      editor.contactPreview.trigger('avatar:selected', expectedBlob);
      expect(editor.avatarSelected).toEqual(expectedBlob);
    });
  });

  describe('saving a contact', () => {
    beforeEach(() => {
      jasmine.Ajax.install();

      // Fake the contact url, it is not important here
      fakeContact.url = '/fake/contact';

      // Fake upload avatar, we are not testing this feature
      editor.uploadAvatar = function(contact, options) {
        options.success();
      };

      editor.showEditor(fakeContact);
    });

    afterEach(() => {
      jasmine.Ajax.uninstall();
      FakeApp.reset();
    });

    it('shows a success message when the contact is saved', () => {
      editor.saveContact(fakeContact);

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: '200',
        contentType: 'application/json',
        responseText: '{}'
      });

      expect(FakeApp.lastSuccessMessage).toEqual('Contact saved');
      expect(FakeApp.router.navigate).toHaveBeenCalled();
    });

    it('shows an error message when the contact cant be saved', () => {
      editor.saveContact(fakeContact);

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: '400',
        contentType: 'application/json',
        responseText: '{}'
      });

      expect(FakeApp.lastErrorMessage).toEqual('Something goes wrong');
      expect(FakeApp.router.navigate).not.toHaveBeenCalledWith('contacts', true);
    });

    it('saves the model with the phones and emails added', () => {
      var expectedPhone = {
        description: 'test',
        phone: '555 5555'
      };
      var expectedEmail = {
        description: 'test',
        phone: 'john.doe@example.com'
      };

      editor.phones = new Backbone.Collection([expectedPhone]);
      editor.emails = new Backbone.Collection([expectedEmail]);
      editor.saveContact(fakeContact);

      var requestText = jasmine.Ajax.requests.mostRecent().params;
      var request = JSON.parse(requestText);

      expect(request.phones.length).toEqual(1);
      expect(request.emails.length).toEqual(1);
      expect(request.phones).toContain(expectedPhone);
      expect(request.emails).toContain(expectedEmail);
    });

    it('does not save the contact if the model is not valid', () => {
      // Emulates an invalid model
      fakeContact.isValid = function() {
        return false;
      };

      editor.saveContact(fakeContact);
      expect(jasmine.Ajax.requests.count()).toEqual(0);
    });

    it('uploads the selected avatar if model is new', () => {
      // Emulates a new model
      fakeContact.isNew= function() {
        return true;
      };

      editor.uploadAvatar = jasmine.createSpy('uploadAvatar');
      editor.saveContact(fakeContact);

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: '200',
        contentType: 'application/json',
        responseText: '{}'
      });

      expect(editor.uploadAvatar).toHaveBeenCalled();
    });

    it('does not upload the selected avatar if model is not new', () => {
      // Emulates a not new model
      fakeContact.isNew= function() {
        return false;
      };

      editor.uploadAvatar = jasmine.createSpy('uploadAvatar');
      editor.saveContact(fakeContact);

      jasmine.Ajax.requests.mostRecent().respondWith({
        status: '200',
        contentType: 'application/json',
        responseText: '{}'
      });

      expect(editor.uploadAvatar).not.toHaveBeenCalled();
    });
  });
});
