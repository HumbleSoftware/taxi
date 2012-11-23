taxi = function (el, myConfig) {
  var
    view = new taxi.TaxiView(),
    config = new taxi.ConfigModel(myConfig || taxi.bdd.data()),
    router = new taxi.TaxiRouter({
      config : config,
      application : view
    });

  $(el).html(view.render().el);

  try {
    Backbone.history.start();
  } catch (e) {
    // Handle it!
  }
};
