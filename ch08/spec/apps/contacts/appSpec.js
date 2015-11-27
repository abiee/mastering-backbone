var proxyquery = require('proxyquireify')(require);

var FakeApp = require('../../fakes/app');
var FakeRegion = require('../../fakes/region');
var FakeContactEditor = require('../../fakes/contactEditor');

var fakes = {
  '../../app': FakeApp,
  './contactEditor': FakeContactEditor,
  './contactList': {},
  './contactViewer': {}
};

var ContactsApp = proxyquery('../../../app/js/apps/contacts/app', fakes);

describe('Contacts application facade', () => {
  var app;
  var region;

  function respond(request) {
    var fakeResponse = {
      name: 'John Doe',
      facebook: 'https://www.facebook.com/john.doe',
      twitter: '@john.doe',
      github: 'https://github.com/johndoe',
      google: 'https://plus.google.com/johndoe'
    };

    request.respondWith({
      status: 200,
      contentType: 'application/json',
      responseText: JSON.stringify(fakeResponse)
    });
  }

  beforeEach(() => {
    region = new FakeRegion();
    app = new ContactsApp({region});

    jasmine.Ajax.install();
  });

  afterEach(() => {
    jasmine.Ajax.uninstall();
  });

  describe('showing contact editor', () => {
    it('fetches data from the server', () => {
      app.showContactEditorById('1');

      var request = jasmine.Ajax.requests.mostRecent();
      expect(request.url).toEqual('/api/contacts/1');
    });

    it('triggers a loading:start event', () => {
      var callback = jasmine.createSpy('callback');

      FakeApp.on('loading:start', callback);
      app.showContactEditorById('1');

      expect(callback).toHaveBeenCalled();
    });

    it('triggers a loading:stop event when the contact is loaded', () => {
      var callback = jasmine.createSpy('callback');

      FakeApp.on('loading:stop', callback);
      app.showContactEditorById('1');
      respond(jasmine.Ajax.requests.mostRecent());

      expect(callback).toHaveBeenCalled();
    });

    it('shows the rigth contact', () => {
      spyOn(FakeContactEditor.prototype, 'showEditor');
      app.showContactEditorById('1');
      respond(jasmine.Ajax.requests.mostRecent());

      expect(FakeContactEditor.prototype.showEditor)
        .toHaveBeenCalled();

      var args = FakeContactEditor.prototype.showEditor.calls.argsFor(0);
      var model = args[0];

      expect(model.get('id')).toEqual('1');
      expect(model.get('name')).toEqual('John Doe');
    });
  });
});
