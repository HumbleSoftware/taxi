taxi.TaxiRouter = Backbone.Router.extend({
  routes : {
    '' : 'home',
    'driver/:driver' : 'driver',
    'driver/:driver/:runner' : 'driver'
  },
  initialize : function (options) {
    this.config = options.config;
    this.drivers = this.config.drivers;
    this.setView = function (view) {
      options.application.setView(view);
    };
  },
  home : function () {
    var
      view = new taxi.DriverListView({
        collection : this.drivers
      });
    this.setView(view);
  },
  driver : function (driver, runner) {
    var
      model = this.drivers.get(driver),
      view = new taxi.DriverView({
        model : model
      });
    this.setView(view);
  }
});
