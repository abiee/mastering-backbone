'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

class Contact extends Backbone.Model {
  constructor(options) {
    super(options);
    this.urlRoot = '/api/contacts';

    this.validation = {
      name: {
        required: true,
        minLength: 3
      }
    };

    this.store = 'contacts';
  }

  get defaults() {
    return {
      name: '',
      phone: '',
      email: '',
      address1: '',
      address2: '',
      facebook: '',
      twitter: '',
      google: '',
      github: '',
      avatar: null
    };
  }

  uploadAvatar(imageBlob, options) {
    // Create a form object to emulate a multipart/form-data
    var formData = new FormData();
    formData.append('avatar', imageBlob);

    var ajaxOptions = {
      url: '/api/contacts/' + this.get('id') + '/avatar',
      type: 'POST',
      data: formData,
      cache: false,
      contentType: false,
      processData: false
    };

    options = options || {};

    // Copy options to ajaxOptions
    _.extend(ajaxOptions, _.pick(options, 'success', 'error'));

    // Attach a progress handler only if is defined
    if (options.progress) {
      ajaxOptions.xhr = function() {
        var xhr = $.ajaxSettings.xhr();

        if (xhr.upload) {
          // For handling the progress of the upload
          xhr.upload.addEventListener('progress', event => {
            let length = event.total;
            let uploaded = event.loaded;
            let percent = uploaded / length;

            options.progress(length, uploaded, percent);
          }, false);
        }

        return xhr;
      };
    }

    $.ajax(ajaxOptions);
  }

  toJSON() {
    var result = Backbone.Model.prototype.toJSON.call(this);

    if (result.phones && result.phones.length > 0) {
      result.phone = result.phones[0].phone;
    }

    if (result.emails && result.emails.length > 0) {
      result.email = result.emails[0].email;
    }

    return result;
  }
}

module.exports = Contact;
