taxi.DriverView = Backbone.View.extend({
  className : 'taxi-driver',
  contexts : {},
  destroy : function () {
    var
      runners = this.model.get('passengers'),
      afterEach = this.model.get('afterEach'),
      contexts = this.contexts;
    if (afterEach) {
      _.each(runners, function (runner) {
        afterEach.call(contexts[runner.key]);
      });
    }
  },
  render : function () {
    var
      data = this.getRenderData(),
      html = taxi.templates.driver(data);
    this.$el.html(html);
    this.$runners = this.$el.find('.taxi-driver-runners');
    this.renderRunners();
    return this;
  },
  renderRunners : function () {
    var
      key = this.model.get('key'),
      $runners = this.$runners,
      runners = this.model.get('passengers'),
      beforeEach = this.model.get('beforeEach'),
      contexts = this.contexts;
    _.each(runners, function (runner) {
      var
        context = {},
        $html = $(taxi.templates.runner({
          'runner' : runner,
          'driver_key' : key
        })),
        $container = $html.find('.taxi-runner-container'),
        options = {
          $container : $container
        };
      if (beforeEach) {
        beforeEach.call(context, options);
      }
      if (runner.callback) {
        runner.callback.call(context, options);
      }
      $runners.append($html);
      contexts[runner.key] = context;
    });
  },
  getRenderData : function () {
    return this.model.toJSON();
  }
});
