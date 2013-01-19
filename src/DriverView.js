taxi.DriverView = Backbone.View.extend({
  className : 'taxi-driver',
  contexts : {},
  initialize : function (options) {
    this.runner = options.runner;
  },
  destroy : function () {
    var
      runners = this.model.get('passengers'),
      afterEach = this.model.get('afterEach'),
      contexts = this.contexts;
    if (afterEach) {
      _.each(runners, function (runner) {
        try {
          afterEach.call(contexts[runner.key]);
        } catch (e) {
          console.error(e);
        }
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
      runner = this.runner,
      runners = this.model.get('passengers');
    if (runner) {
      this.renderRunner(_.find(runners, function (config) {
        return config.key === runner;
      }));
    } else {
      _.each(runners, this.renderRunner, this);
    }
  },
  renderRunner : function (runner) {
    var
      key = this.model.get('key'),
      $runners = this.$runners,
      beforeEach = this.model.get('beforeEach'),
      contexts = this.contexts,
      context = {},
      $html = $(taxi.templates.runner({
        'runner' : runner,
        'driver_key' : key
      })),
      $container = $html.find('.taxi-runner-container'),
      options = {
        $container : $container
      };

    try {
      if (beforeEach) {
        beforeEach.call(context, options);
      }
      if (runner.callback) {
        runner.callback.call(context, options);
      }
    } catch (e) {
      $container
        .addClass('taxi-error')
        .text(e.stack || e.toString());
      console.error(e);
    }

    $runners.append($html);
    contexts[runner.key] = context;
  },
  getRenderData : function () {
    return this.model.toJSON();
  },
  scroll : function (key) {
    var
      selector = '[data-key="' + key + '"]',
      $runner = this.$runners.children().filter(selector),
      position = $runner.position();
    if (position) {
      this.$el.scrollTop(position.top);
    }
  }
});
