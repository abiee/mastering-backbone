class SocialNetworksView extends ModelView {
  constructor(options) {
    super(options);
    this.template = '#social-networks';
  }

  get tagName() {
    return 'ul';
  }
}
