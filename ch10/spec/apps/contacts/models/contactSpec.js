var Contact = require('../../../../app/js/apps/contacts/models/contact');

describe('Contact model', () => {
  describe('creating a new contact', () => {
    it('has the default values', () => {
      var contact = new Contact();

      expect(contact.get('name')).toEqual('');
      expect(contact.get('phone')).toEqual('');
      expect(contact.get('email')).toEqual('');
      expect(contact.get('address1')).toEqual('');
      expect(contact.get('address2')).toEqual('');
      expect(contact.get('avatar')).toEqual(null);
    });
  });

  it('has the rigth url', () => {
    var contact = new Contact();
    expect(contact.url()).toEqual('/api/contacts');
  });
});
