taxi = function (el, myConfig) {
  var
    config = new taxi.ConfigModel(myConfig || taxi.bdd.data()),
    view = new taxi.TaxiView({
      config : config
    }),
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
