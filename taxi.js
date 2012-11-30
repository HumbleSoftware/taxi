/*! taxi.js - v1.0.0 - 2012-11-30
* https://github.com/HumbleSoftware/taxi.js
* Copyright (c) 2012 Carl Sutherland; Licensed MIT */

;(function () {

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

taxi.DriverModel = Backbone.Model.extend({
  idAttribute : 'key',
  defaults : {
    'key' : '',
    'name' : ''
  }
});

taxi.ConfigModel = Backbone.Model.extend({
  initialize : function (options) {
    this.drivers = new taxi.DriverCollection(options.drivers);
  }
});

taxi['lib'] = taxi['lib'] || {};
taxi.lib.bdd = function bdd () {

  var
    helpers = [
      'driver',
      'passenger',
      'beforeEach',
      'afterEach'
    ],
    drivers,
    config,
    driverContext;

  function initialize () {
    drivers = [];
    driverContext = null;
    config = {
      drivers : drivers
    };
  }

  // Helpers:
  function addDriver (name, callback) {
    var
      driver = {
        key : driverKey(name),
        name : name,
        passengers : []
      };
    driverContext = driver;
    callback.call(this);
    driverContext = null;
    drivers.push(driver);
    return driver;
  }
  function addPassenger (name, callback) {
    var
      passenger = {
        key : passengerKey(name),
        name : name,
        callback : callback
      };
    passenger = passenger;
    driverContext.passengers.push(passenger);
    return passenger;
  }
  function validate (name, callback, type) {
    if (!name || !_.isString(name)) {
      throw new Error('invalid ' + type + ' name');
    }
    if (!_.isFunction(callback)) {
      throw new Error('invalid ' + type + ' callback');
    }
  }
  function addEach (callback, type) {
    var
      object = driverContext || config;
    if (object[type]) {
      object[type] = _.compose(callback, object[type]);
    } else {
      object[type] = callback;
    }
  }
  function validateEach (callback, type) {
    if (!_.isFunction(callback)) {
      throw 'invalid ' + type + ' callback';
    }
  }

  // Keys:
  function nameToKey (name) {
    return (name || '')
      .replace(/[^\w]+/g, '_')
      .toLowerCase();
  }
  function uniqueKey (list, key) {
    var
      testKey = key,
      index = 1;
    function test (item) {
      return item.key === testKey;
    }
    while (_.any(list, test)) {
      testKey = key + '_' + index++;
    }
    return testKey;
  }
  function driverKey (name) {
    return uniqueKey(drivers, nameToKey(name));
  }
  function passengerKey (name) {
    return uniqueKey(driverContext.passengers, nameToKey(name));
  }

  // Class:
  initialize();
  return {
    driver : function (name, callback) {
      if (driverContext) {
        throw new Error('already driving');
      }
      validate(name, callback, 'driver');
      return addDriver(name, callback);
    },
    passenger : function (name, callback) {
      if (!driverContext) {
        throw new Error('no driver');
      }
      validate(name, callback, 'passenger');
      return addPassenger(name, callback);
    },
    beforeEach : function (callback) {
      validateEach(callback, 'beforeEach');
      addEach(callback, 'beforeEach');
    },
    afterEach : function (callback) {
      validateEach(callback, 'afterEach');
      addEach(callback, 'afterEach');
    },
    data : function data () {
      return config;
    },
    inject : function (context) {
      if (_.isObject(context)) {
        _.each(helpers, function (helper) {
          context[helper] = this[helper];
        }, this);
      }
    },
   reset : function () {
     initialize();
   }
  };
};
taxi.bdd = taxi.lib.bdd();

taxi.TaxiView = Backbone.View.extend({
  className : 'taxi',
  view : null,
  initialize : function (options) {
    this.config = options.config;
    this.menu = new taxi.DriverListView({
      collection : this.config.drivers
    });
  },
  destroy : function () {
    this.menu.destroy();
  },
  render : function () {
    var
      menu = this.menu,
      $el = this.$el;
    menu.render();
    this.$el.html(taxi.templates.taxi());
    this.$content = $el.find('.taxi-view');
    this.$title = $el.find('.taxi-title');
    this.$menu = menu.$el;
    $el.find('.taxi-menu').append(menu.$el);
    return this;
  },
  setView : function (view) {
    if (this.view && this.view.destroy) {
      this.view.destroy();
    }
    if (view) {
      this.view = view;
      this.$content.html(view.render().$el);
    }
  },
  setTitle : function (title) {
    this.$title.text(title || 'A UI component driver.');
  }
});

taxi.TaxiRouter = Backbone.Router.extend({
  routes : {
    '' : 'home',
    'driver/:driver' : 'driver',
    'driver/:driver/:runner' : 'driver'
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
        model : model
      });
    this.application.setView(view);
    this.application.setTitle(model.get('name') + ' Driver');
    view.scroll(runner);
  }
});

taxi.DriverCollection = Backbone.Collection.extend({
  model : taxi.DriverModel
});

taxi.DriverListView = Backbone.View.extend({
  className : 'taxi-driver-list',
  render : function () {
    var
      data = this.getRenderData(),
      html = taxi.templates.driver_list(data);
    this.$el.html(html);
    return this;
  },
  getRenderData : function () {
    return this.collection.toJSON();
  }
});

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
        try {
          beforeEach.call(context, options);
        } catch (e) {
          console.error(e);
        }
      }
      if (runner.callback) {
        try {
          runner.callback.call(context, options);
        } catch (e) {
          $container
            .addClass('taxi-error')
            .text(e.stack || e.toString());
          console.error(e);
        }
      }
      $runners.append($html);
      contexts[runner.key] = context;
    });
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

this["taxi"] = this["taxi"] || {};
this["taxi"]["templates"] = this["taxi"]["templates"] || {};

this["taxi"]["templates"]["taxi"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<div class=\"taxi-header\">\n  <h1>Taxi.js - <span class=\"taxi-title\"></span></h1>\n  <div class=\"taxi-menu\">\n    <a href=\"#\">menu</a>\n  </div>\n</div>\n<div class=\"taxi-view\"></div>\n";});

this["taxi"]["templates"]["driver"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  


  return "<ul class=\"taxi-driver-runners\"></ul>\n";});

this["taxi"]["templates"]["runner"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, foundHelper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li class=\"taxi-runner\" data-key=\"";
  stack1 = depth0.runner;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.key;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\">\n  <div class=\"taxi-runner-name\">\n    <a href=\"#driver/";
  foundHelper = helpers.driver_key;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.driver_key; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "/";
  stack1 = depth0.runner;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.key;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "\">";
  stack1 = depth0.runner;
  stack1 = stack1 == null || stack1 === false ? stack1 : stack1.name;
  stack1 = typeof stack1 === functionType ? stack1() : stack1;
  buffer += escapeExpression(stack1) + "</a>\n  </div>\n  <div class=\"taxi-runner-container\"></div>\n</li>\n";
  return buffer;});

this["taxi"]["templates"]["driver_list"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  helpers = helpers || Handlebars.helpers;
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, foundHelper;
  buffer += "\n  <li><a href=\"#driver/";
  foundHelper = helpers.key;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.key; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "\">";
  foundHelper = helpers.name;
  if (foundHelper) { stack1 = foundHelper.call(depth0, {hash:{}}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1() : stack1; }
  buffer += escapeExpression(stack1) + "</a></li>\n  ";
  return buffer;}

  buffer += "<ul>\n  ";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(1, program1, data)});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n";
  return buffer;});
taxi.version = "1.0.0";
})();
