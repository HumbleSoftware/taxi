taxi.TaxiRouter = Backbone.Router.extend({
  routes : {
    '' : 'home',
    'driver/:driver' : 'driver',
    'driver/:driver/:runner' : 'driver'
  },
  initialize : function (options) {
    this.drivers = options.drivers;
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
    console.log('home');
  },
  driver : function (driver, runner) {
    var
      model = this.drivers.get(driver),
      view = new taxi.DriverView({
        model : model
      });

    console.log('driver', driver);

    this.setView(view);
  }
});
