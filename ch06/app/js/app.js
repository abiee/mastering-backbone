'use strict';

var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');
var BackboneValidation = require('backbone-validation');
var swal = require('sweetalert');
var noty = require('noty');
var Region = require('./common').Region;
var DataStore = require('./indexedDB/dataStore');

// Initialize all available routes
require('./apps/contacts/router');

// General routes non sub-application dependant
class DefaultRouter extends Backbone.Router {
  constructor(options) {
    super(options);
    this.routes = {
      '': 'defaultRoute'
    };
    this._bindRoutes();
  }

  // Redirect to contacts app by default
  defaultRoute() {
    this.navigate('contacts', true);
  }
}

var App = {
  start() {
    // The common place where sub-applications will be showed
    App.mainRegion = new Region({el: '#main'});

    this.initializePlugins();

    // Create a global router to enable sub-applications to redirect to
    // other URLs
    App.router = new DefaultRouter();
    Backbone.history.start();
  },

  // Only a subapplication can be running at once, destroy any
  // current running subapplication and start the asked one
  startSubApplication(SubApplication) {
    // Do not run the same subapplication twice
    if (this.currentSubapp && this.currentSubapp instanceof SubApplication) {
      return this.currentSubapp;
    }

    // Destroy any previous subapplication if we can
    if (this.currentSubapp && this.currentSubapp.destroy) {
      this.currentSubapp.destroy();
    }

    // Run subapplication
    this.currentSubapp = new SubApplication({region: App.mainRegion});
    return this.currentSubapp;
  },

  initializePlugins() {
    //PNotify.prototype.options.styling = 'bootstrap3';
  },

  successMessage(message) {
    var options = {
      title: 'Success',
      type: 'success',
      text: message,
      confirmButtonText: 'Okay'
    };

    swal(options);
  },

  errorMessage(message) {
    var options = {
      title: 'Error',
      type: 'error',
      text: message,
      confirmButtonText: 'Okay'
    };

    swal(options);
  },

  askConfirmation(message, callback) {
    var options = {
      title: 'Are you sure?',
      // Show the warning icon
      type: 'warning',
      text: message,
      // By default the cancel button is not shown
      showCancelButton: true,
      confirmButtonText: 'Yes, do it!',
      // Overwrite the default button color
      confirmButtonColor: '#5cb85c',
      cancelButtonText: 'No'
    };

    // Show the message
    swal(options, function(isConfirm) {
      callback(isConfirm);
    });
  },

  notifySuccess(message) {
    new noty({
      text: message,
      layout: 'topRight',
      theme: 'relax',
      type: 'success',
      timeout: 3000 // close automatically
    });
  },

  notifyError(message) {
    new noty({
      text: message,
      layout: 'topRight',
      theme: 'relax',
      type: 'error',
      timeout: 3000 // close automatically
    });
  }
};

_.extend(BackboneValidation.callbacks, {
  valid(view, attr) {
    var $el = view.$('#' + attr);
    if ($el.length === 0) {
      $el = view.$('[name~=' + attr + ']');
    }

    // If input is inside an input group, $el is changed to
    // remove error properly
    if ($el.parent().hasClass('input-group')) {
      $el = $el.parent();
    }

    var $group = $el.closest('.form-group');
    $group.removeClass('has-error')
      .addClass('has-success');

    var $helpBlock = $el.next('.help-block');
    if ($helpBlock.length === 0) {
      $helpBlock = $el.children('.help-block');
    }
    $helpBlock.slideUp({
      done: function() {
        $helpBlock.remove();
      }
    });
  },

  invalid(view, attr, error) {
    var $el = view.$('#' + attr);
    if ($el.length === 0) {
      $el = view.$('[name~=' + attr + ']');
    }

    $el.focus();

    var $group = $el.closest('.form-group');
    $group.removeClass('has-success')
      .addClass('has-error');

    // If input is inside an input group $el is changed to
    // place error properly
    if ($el.parent().hasClass('input-group')) {
      $el = $el.parent();
    }

    // If error already exists and its message is different to new
    // error's message then the previous one is replaced,
    // otherwise new error is shown with a slide down animation
    if ($el.next('.help-block').length !== 0) {
      $el.next('.help-block')[0].innerText = error;
    } else if ($el.children('.help-block').length !== 0) {
      $el.children('.help-block')[0].innerText = error;
    } else {
      var $error = $('<div>')
                 .addClass('help-block')
                 .html(error)
                 .hide();

      // Placing error
      if ($el.prop('tagName') === 'div' && !$el.hasClass('input-group')) {
        $el.append($error);
      } else {
        $el.after($error);
      }

      // Showing animation on error message
      $error.slideDown();
    }
  }
});

// Allow App object to listen and trigger events, useful
// for global events
_.extend(App, Backbone.Events);

var store = new DataStore();
Backbone.sync = function(method, model, options) {
  var response;
  var defer = Backbone.$.Deferred();

  switch(method) {
    case 'read':
      if (model.id) {
        response = store.find(model);
      } else {
        response = store.findAll(model);
      }
      break;

    case 'create':
      response = store.create(model);
      break;

    case 'update':
      response = store.update(model);
      break;

    case 'delete':
      response = store.destroy(model);
      break;
  }

  response.then(function(result) {
    if (options && options.success) {
      options.success(result);
      defer.resolve(result);
    }
  });

  return defer.promise();
};

module.exports = App;
