taxi.ConfigModel = Backbone.Model.extend({
  initialize : function (options) {
    this.drivers = new taxi.DriverCollection(options.drivers);
  }
});
