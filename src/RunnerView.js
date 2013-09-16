taxi.RunnerView = Backbone.View.extend({  
  tagName : 'li',
  className : 'taxi-runner',
  context : {},
  initialize : function (options) {
    this.driverKey = options.driverKey;
    this.before = options.before;
    this.after = options.after;
  },  
  remove : function () {
    if (this.after) {
      try {
        this.after.call(this.context);
      } catch (e) {
        console.error(e);      
      }
    }
    return Backbone.View.prototype.remove.apply(this, arguments);
  },
  render : function () {
    this.$el.html(taxi.templates.runner({
      runner : this.model,
      driver_key : this.driverKey
    }));
    this.executeCallbacks();
    return this;
  },
  executeCallbacks : function () {
    var
      $container = this.$('.taxi-runner-container'),
      options = {
        $container : $container
      };
    try {
      if (this.before) {
        this.before.call(this.context, options);
      }

      if (this.model.callback) {
        this.model.callback.call(this.context, options);
      }
    } catch (e) {
      $container
        .addClass('taxi-error')
        .text(e.stack || e.toString());
      console.error(e);
    }
  }
});