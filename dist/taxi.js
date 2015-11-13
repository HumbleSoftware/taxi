/*!
* taxi.js - v0.0.1 - 2015-11-13
* https://github.com/HumbleSoftware/taxi.js
* Copyright (c) 2015 Carl Sutherland; Licensed MIT 
*/
;(function (Backbone, _) {taxi = function (el, myConfig) {
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
      '<a href="#driver/'+model.get('key')+'">'+model.get('name')+' Driver</a>'
    );
    //view.scroll(runner);
  }
});

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
    this.$title.html(title || 'A UI component driver.');
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

this["taxi"] = this["taxi"] || {};
this["taxi"]["templates"] = this["taxi"]["templates"] || {};

this["taxi"]["templates"]["driver"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<ul class="taxi-driver-runners"></ul>\n';

}
return __p
};

this["taxi"]["templates"]["driver_list"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '<ul>\n  ';
 _.each(obj, function (driver) { ;
__p += '\n  <li><a href="#driver/' +
__e( driver.key ) +
'">' +
__e( driver.name ) +
'</a></li>\n  ';
 }); ;
__p += '\n</ul>\n';

}
return __p
};

this["taxi"]["templates"]["runner"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li class="taxi-runner" data-key="' +
__e( runner.key ) +
'">\n  <div class="taxi-runner-name">\n    <a href="#driver/' +
__e( driver_key ) +
'/' +
__e( runner.key ) +
'">' +
__e( runner.name ) +
'</a>\n  </div>\n  <div class="taxi-runner-container"></div>\n</li>\n';

}
return __p
};

this["taxi"]["templates"]["taxi"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<div class="taxi-header">\n  <h1>Taxi.js - <span class="taxi-title"></span></h1>\n  <div class="taxi-menu">\n    <a href="#">menu</a>\n  </div>\n</div>\n<div class="taxi-view"></div>\n';

}
return __p
};taxi.version = "0.0.1";
})(Backbone.noConflict(), _.noConflict());