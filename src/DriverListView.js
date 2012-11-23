taxi.DriverListView = Backbone.View.extend({
  className : 'taxi-driver-list',
  render : function () {
    var
      data = this.getRenderData(),
      html = taxi.templates.driver_list(data);
    this.$el.html(html);
    return this;
  },
  getRenderData : function () {
    return this.collection.toJSON();
  }
});
