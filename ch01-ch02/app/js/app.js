// General routes non sub-application dependant
var DefaultRouter = Backbone.Router.extend({
  routes: {
    '': 'defaultRoute'
  },

  // Redirect to contacts app by default
  defaultRoute() {
    this.navigate('contacts', true);
  }
});

var App = {
  Models: {},
  Collections: {},
  Routers: {},

  start() {
    // Initialize all available routes
    _.each(_.values(this.Routers), function(Router) {
      new Router();
    });

    // The common place where sub-applications will be showed
    App.mainRegion = new Region({el: '#main'});

    // Create a global router to enable sub-applications to redirect to
    // other urls
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

// Allow App object to listen and trigger events, useful
// for global events
_.extend(App, Backbone.Events);

window.App = App;
