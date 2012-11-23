taxi.bdd = function bdd () {

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
