var ContactCollection = require('../../../../app/js/apps/contacts/collections/contactCollection');

describe('Contac collection', () => {
  it('has the rigth urlRoot', () => {
    var collection = new ContactCollection();
    expect(collection.url).toEqual('/api/contacts');
  });
});
