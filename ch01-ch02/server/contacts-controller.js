var _ = require('lodash');
var crispy = require('crispy-string');

const ID_LENGTH = 10;

function makeId() {
  return crispy.base32String(ID_LENGTH);
}

var contacts = [{
  id: makeId(),
  name: 'John Doe',
  phone: '(333) 364 27364',
  email: 'john.doe@example.com',
  address1: 'Cuarzo Street 2369',
  facebook: 'https://www.facebook.com/John.Doe'
}, {
  id: makeId(),
  name: 'Jane Doe',
  email: 'jane.doe@example.com',
  address1: 'Tortilla Street 364',
  facebook: 'https://www.facebook.com/John.Doe',
  twitter: 'https://twitter.com/thejanedoe'
}, {
  id: makeId(),
  name: 'Abiee Alejandro',
  email: 'abiee@echamea.com',
  address1: 'Cuarzo 2369',
  facebook: 'https://www.facebook.com/abiee.alejandro',
  twitter: 'https://twitter.com/AbieeAlejandro',
  github: 'https://github.com/abiee'
}, {
  id: makeId(),
  name: 'Omare',
  email: 'me@omar-e.com',
  address1: 'Del Árbol street'
}];

// Extract and set default values of a contact from a standard
// express request object
function extractContactData(req) {
  var result = {};
  var data = req.body;

  var fields = ['name', 'phone', 'email', 'address1', 'address2',
    'facebook', 'twitter', 'google', 'github'];

  fields.forEach(field => {
    if (data[field]) {
      result[field] = data[field];
    }
  });

  return result;
}

module.exports = {
  showContacts(req, res) {
    res.json(contacts);
  },

  // Insert a new contact JSON into the contacts array
  createContact(req, res) {
    var contact = extractContactData(req);

    // Asssign a random id
    contact.id = makeId();
    contacts.push(contact);

    res.status(201)
      .json(contact);
  },

  updateContact(req, res, next) {
    var contactId = req.params.contactId;
    var contact = _.find(contacts, ['id', contactId]);

    if (!contact) {
      res.status(404);
      return next();
    }

    // extractContactData do not alter the contact id
    contact = Object.assign(contact, extractContactData(req));
    contacts[contactId] = contact;
    res.json(contact);
  },

  // Locates an item in the contacts array with the id attribute equals
  // to the req.params.contactId value
  findContactById(req, res, next) {
    var contactId = req.params.contactId;
    var contact = _.find(contacts, ['id', contactId]);

    if (!contact) {
      res.status(404);
      return next();
    }

    res.json(contact);
  },

  deleteContact(req, res, next) {
    // Ensures that contact exists
    var contactId = req.params.contactId;
    var contact = _.find(contacts, ['id', contactId]);

    if (!contact) {
      res.status(404);
      return next();
    }

    // Drop the object with the given id from the contacts array
    _.remove(contacts, item => item.id === contact.id);
    res.json(contact);
  }
};
