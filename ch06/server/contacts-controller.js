'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('lodash');
var crispy = require('crispy-string');

const ID_LENGTH = 10;
const AVATAR_PATH = __dirname + '/avatar';

function makeId() {
  return crispy.base32String(ID_LENGTH);
}

function isValidImage(mimetype) {
  return /jpeg|png|gif/.test(mimetype);
}

function generateFilename(len, extension) {
  return crispy.base32String(ID_LENGTH) + extension;
}

function generateFullPath(filename) {
  return AVATAR_PATH + '/' + filename;
}

function generateURLForAvatar(filename) {
  return 'http://localhost:3000/avatar/' + filename;
}

function getExtension(filename) {
  return path.extname(filename);
}

function removeAvatar(contact) {
  // Remove previous avatar if any
  if (_.has(contact, 'avatar.file')) {
    let currentAvatarPath = generateFullPath(contact.avatar.file);

    if (fs.existsSync(currentAvatarPath)) {
      fs.unlinkSync(currentAvatarPath);
    }
  }
}

var contacts = [{
  id: makeId(),
  name: 'John Doe',
  phones: [{
    description: 'home',
    phone: '(333) 364 27364'
  }],
  emails: [{
    description: 'personal',
    email: 'john.doe@example.com'
  }, {
    description: 'work',
    email: 'john.doe@acme.com'
  }],
  address1: 'Cuarzo Street 2369',
  facebook: 'https://www.facebook.com/John.Doe',
  avatar: {
    url: 'http://www.minicoming.com/wp-content/miniwallpaper/20121202/1stezb0dwni2650.jpg'
  }
}, {
  id: makeId(),
  name: 'Jane Doe',
  emails: [{
    description: 'personal',
    email: 'jane.doe@example.com'
  }],
  address1: 'Tortilla Street 364',
  facebook: 'https://www.facebook.com/John.Doe',
  twitter: 'https://twitter.com/thejanedoe'
}, {
  id: makeId(),
  name: 'Abiee Alejandro',
  emails: [{
    description: 'personal',
    email: 'abiee@echamea.com'
  }],
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

  var fields = ['name', 'phones', 'emails', 'address1', 'address2',
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
    var contact = _.find(contacts, 'id', contactId);

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
    var contact = _.find(contacts, 'id', contactId);

    if (!contact) {
      res.status(404);
      return next();
    }

    res.json(contact);
  },

  deleteContact(req, res, next) {
    // Ensures that contact exists
    var contactId = req.params.contactId;
    var contact = _.find(contacts, 'id', contactId);

    if (!contact) {
      res.status(404);
      return next();
    }

    // Drop the object with the given id from the contacts array
    _.remove(contacts, item => item.id === contact.id);
    res.json(contact);
  },

  uploadAvatar(req, res, next) {
    var contactId = req.params.contactId;
    var filename, fullpath;

    // Ensure that user has sent the file
    if (!_.has(req, 'file')) {
      return res.status(400).json({
        error: 'Please upload a file in the avatar field'
      });
    }

    // File should be in a valid format
    var metadata = req.file;
    if (!isValidImage(metadata.mimetype)) {
      res.status(400).json({
        error: 'Invalid format, please use jpg, png or gif files'
      });
      return next();
    }

    // Get target contact from database
    var contact = _.find(contacts, 'id', contactId);
    if (!contact) {
      res.status(404).json({
        error: 'contact not found'
      });
      return next();
    }

    // Ensure that avatar path exists
    if (!fs.existsSync(AVATAR_PATH)) {
      fs.mkdirSync(AVATAR_PATH);
    }

    // Ensure unique filename to prevent name colisions
    var extension = getExtension(metadata.originalname);
    do {
      filename = generateFilename(25, extension);
      fullpath = generateFullPath(filename);
    } while(fs.existsSync(fullpath));

    // Remove previous avatar if any
    removeAvatar(contact);

    // Save the file in disk
    var wstream = fs.createWriteStream(fullpath);
    wstream.write(metadata.buffer);
    wstream.end();

    // Update contact by assingn the url of the uploaded file
    contact.avatar = {
      file: filename,
      url: generateURLForAvatar(filename)
    };

    res.json({
      success: true,
      avatar: contact.avatar
    });
  }
};
