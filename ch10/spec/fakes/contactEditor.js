'use strict';

class FakeContactEditor {
  showEditor(contact) {
    this.showingContact = contact;
  }

  reset() {
    delete this.showingContact;
  }
}

module.exports = FakeContactEditor;
