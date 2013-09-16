taxi.TaxiRouter = Backbone.Router.extend({
  routes : {
    '' : 'home',
    'driver/:driver' : 'driver',
    'driver/:driver/:passenger' : 'driver',
    'single/:driver/:passenger' : 'driver'
  },
  initialize : function (options) {
    this.config = options.config;
    this.drivers = this.config.drivers;
    this.application = options.application;
  },
  home : function () {
    var
      view = new taxi.DriverListView({
        collection : this.drivers
      });
    this.application.setView(view);
    this.application.setTitle();
  },
  driver : function (driver, passenger) {
    var
      model = this.drivers.get(driver),
      view = new taxi.DriverView({
        model : model,
        passenger : passenger
      });
    this.application.setView(view);
    this.application.setTitle(
      '<a href="#driver/' + model.get('key') + '">' + model.get('name') + ' Driver</a>'
    );
    //view.scroll(passenger);
  }
});
