taxi.TaxiRouter = Backbone.Router.extend({
  routes : {
    '' : 'home',
    'driver/:driver' : 'driver',
    'driver/:driver/:runner' : 'driver',
    'single/:driver/:runner' : 'driver'
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
  driver : function (driver, runner) {
    var
      model = this.drivers.get(driver),
      view = new taxi.DriverView({
        model : model,
        runner : runner
      });
    this.application.setView(view);
    this.application.setTitle(
      '<a href="#driver/' + model.get('key') + '">' + model.get('name') + ' Driver</a>'
    );
    //view.scroll(runner);
  }
});
