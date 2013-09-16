taxi.DriverListView = Backbone.View.extend({
  className : 'taxi-driver-list',
  render : function () {
    var
      html = taxi.templates.driver_list(this.getRenderData());
    this.$el.html(html);
    return this;
  },
  getRenderData : function () {
    return this.collection.toJSON();
  }
});
