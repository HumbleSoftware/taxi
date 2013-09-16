/*!
* taxi.js - v0.0.1 - 2013-09-16
* https://github.com/HumbleSoftware/taxi.js
* Copyright (c) 2013 Carl Sutherland; Licensed MIT 
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
      html = taxi.templates.driver_list(this.getRenderData());
    this.$el.html(html);
    return this;
  },
  getRenderData : function () {
    return this.collection.toJSON();
  }
});

taxi.DriverView = Backbone.View.extend({
  className : 'taxi-driver',
  $passengerViews : $(),
  initialize : function (options) {
    this.passenger = options.passenger;
  },
  remove : function () {
    _.invoke(this.$passengerViews, 'remove');
    return Backbone.View.prototype.remove.apply(this, arguments);
  },
  render : function () {
    var
      html = taxi.templates.driver(this.getRenderData());
    this.$el.html(html);
    this.$passengers = this.$('.taxi-driver-passengers');
    this.renderPassengers();
    return this;
  },
  renderPassengers : function () {
    var
      passenger = this.passenger,
      passengers = this.model.get('passengers');
    if (passenger) {
      this.renderPassenger(_.find(passengers, function (config) {
        return config.key === passenger;
      }));
    } else {
      _.each(passengers, this.renderPassenger, this);
    }
  },
  renderPassenger : function (passenger) {
    var
      key = this.model.get('key'),
      beforeEach = this.model.get('beforeEach'),
      afterEach = this.model.get('afterEach'),
      passengerView = new taxi.PassengerView({
        model : passenger,
        driverKey : key,
        before : beforeEach,
        after : afterEach
      });

    this.$passengerViews.append(passengerView);
    this.$passengers.append(passengerView.render().$el);
  },
  getRenderData : function () {
    return this.model.toJSON();
  },
  scroll : function (key) {
    var
      selector = '[data-key="' + key + '"]',
      $passenger = this.$passengers.children().filter(selector),
      position = $passenger.position();
    if (position) {
      this.$el.scrollTop(position.top);
    }
  }
});

taxi.PassengerView = Backbone.View.extend({  
  tagName : 'li',
  className : 'taxi-passenger',
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
    this.$el.html(taxi.templates.passenger({
      passenger : this.model,
      driver_key : this.driverKey
    }));
    this.executeCallbacks();
    return this;
  },
  executeCallbacks : function () {
    var
      $container = this.$('.taxi-passenger-container'),
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

taxi.TaxiView = Backbone.View.extend({
  className : 'taxi',
  view : null,
  initialize : function (options) {
    this.config = options.config;
    this.menu = new taxi.DriverListView({
      collection : this.config.drivers
    });
  },
  remove : function () {
    this.menu.remove();
    return Backbone.View.prototype.remove.apply(this, arguments);
  },
  render : function () {    
    this.$el.html(taxi.templates.taxi());
    this.$content = this.$('.taxi-view');
    this.$title = this.$('.taxi-title');
    this.$('.taxi-menu').append(this.menu.render().$el);
    return this;
  },
  setView : function (view) {
    if (this.view) {
      this.view.remove();
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
__p += '<ul class="taxi-driver-passengers"></ul>\n';

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

this["taxi"]["templates"]["passenger"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape;
with (obj) {
__p += '<li class="taxi-passenger" data-key="' +
__e( passenger.key ) +
'">\n  <div class="taxi-passenger-name">\n    <a href="#driver/' +
__e( driver_key ) +
'/' +
__e( passenger.key ) +
'">' +
__e( passenger.name ) +
'</a>\n  </div>\n  <div class="taxi-passenger-container"></div>\n</li>\n';

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