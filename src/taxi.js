taxi = function (el, config) {

  var
    drivers = new taxi.DriverCollection(config),
    view = new taxi.TaxiView(),
    router = new taxi.TaxiRouter({
      drivers : drivers,
      application : view
    });

  $(el).html(view.render().el);

  try {
    Backbone.history.start();
  } catch (e) {
    // Handle it!
  }
};
