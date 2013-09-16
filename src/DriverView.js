taxi.DriverView = Backbone.View.extend({
  className : 'taxi-driver',
  $runnerViews : $(),
  initialize : function (options) {
    this.runner = options.runner;
  },
  remove : function () {
    _.invoke(this.$runnerViews, 'remove');
    return Backbone.View.prototype.remove.apply(this, arguments);
  },
  render : function () {
    var
      html = taxi.templates.driver(this.getRenderData());
    this.$el.html(html);
    this.$runners = this.$('.taxi-driver-runners');
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
      beforeEach = this.model.get('beforeEach'),
      afterEach = this.model.get('afterEach'),
      runnerView = new taxi.RunnerView({
        model : runner,
        driverKey : key,
        before : beforeEach,
        after : afterEach
      });

    this.$runnerViews.append(runnerView);
    this.$runners.append(runnerView.render().$el);
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
