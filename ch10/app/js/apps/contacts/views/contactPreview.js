'use strict';

var ModelView = require('../../../common').ModelView;
var template = require('../templates/contactFormPreview.tpl');

class ContactPreview extends ModelView {
  constructor(options) {
    super(options);
    this.template = template;

    this.model.on('change', this.render, this);

    if (options.controller) {
      this.listenTo(
        options.controller, 'avatar:uploading:start',
        this.uploadingAvatarStart, this
      );
      this.listenTo(
        options.controller, 'avatar:uploading:done',
        this.uploadingAvatarDone, this
      );
      this.listenTo(
        options.controller, 'avatar:uploading:error',
        this.uploadingAvatarError, this
      );
    }
  }

  get events() {
    return {
      'click img': 'showSelectFileDialog',
      'change #avatar': 'fileSelected'
    };
  }

  showSelectFileDialog() {
    $('#avatar').trigger('click');
  }

  fileSelected(event) {
    event.preventDefault();

    var $img = this.$('img');

    // Get a blob instance of the file selected
    var $fileInput = this.$('#avatar')[0];
    var fileBlob = $fileInput.files[0];

    // Render the image selected in the img tag
    var fileReader = new FileReader();
    fileReader.onload = event => {
      $img.attr('src', event.target.result);

      if (this.model.isNew()) {
        this.model.set({
          avatar: {
            url: event.target.result
          }
        });
      }
    };
    fileReader.readAsDataURL(fileBlob);

    this.trigger('avatar:selected', fileBlob);
  }

  uploadingAvatarStart() {
    this.originalAvatarMessage = this.$('span.info').html();
    this.$('span.notice').html('Uploading avatar...');
  }

  uploadingAvatarDone() {
    this.$('span.notice').html(this.originalAvatarMessage || '');
  }

  uploadingAvatarError() {
    this.$('span.notice').html('Can\'t upload image, try again later');
  }
}

module.exports = ContactPreview;
