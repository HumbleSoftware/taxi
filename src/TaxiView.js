taxi.TaxiView = Backbone.View.extend({
  className : 'taxi',
  view : null,
  initialize : function (options) {
    this.config = options.config;
    this.menu = new taxi.DriverListView({
      collection : this.config.drivers
    });
  },
  destroy : function () {
    this.menu.destroy();
  },
  render : function () {
    var
      menu = this.menu,
      $el = this.$el;
    menu.render();
    this.$el.html(taxi.templates.taxi());
    this.$content = $el.find('.taxi-view');
    this.$title = $el.find('.taxi-title');
    this.$menu = menu.$el;
    $el.find('.taxi-menu').append(menu.$el);
    return this;
  },
  setView : function (view) {
    if (this.view && this.view.destroy) {
      this.view.destroy();
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
