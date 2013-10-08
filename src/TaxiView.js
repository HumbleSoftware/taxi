taxi.TaxiView = Backbone.View.extend({
  className : 'taxi',
  view : null,
  initialize : function (options) {
    this.config = options.config;
    this.menu = new taxi.DriverListView({
      collection : this.config.drivers
    });
  },
  remove : function () {
    this.menu.remove();
    return Backbone.View.prototype.remove.apply(this, arguments);
  },
  render : function () {
    this.$el.html(taxi.templates.taxi());
    this.$content = this.$('.taxi-view');
    this.$title = this.$('.taxi-title');
    this.$('.taxi-menu').append(this.menu.render().$el);
    return this;
  },
  setView : function (view) {
    if (this.view) {
      this.view.remove();
    }
    if (view) {
      this.view = view;
      this.$content.html(view.render().$el);
    }
  },
  setTitle : function (title) {
    this.$title.html(title || 'A UI component driver.');
  }
});
