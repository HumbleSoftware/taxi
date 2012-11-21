taxi.bdd = function bdd () {

  var
    helpers = [
      'driver',
      'passenger',
      'beforeEach',
      'afterEach'
    ],
    drivers = [],
    pointer = null,
    config = {
      drivers : drivers
    },
    object;

  // Methods:
  function driver (name, callback) {
    if (pointer) {
      throw new Error('already driving');
    }
    validate(name, callback, 'driver');
    return addDriver(name, callback);
  }
  function passenger (name, callback) {
    if (!pointer) {
      throw new Error('no driver');
    }
    validate(name, callback, 'passenger');
    return addPassenger(name, callback);
  }
  function beforeEach (callback) {
  }
  function afterEach (callback) {
  }
  function data () {
    return config;
  }
  function inject (context) {
    if (_.isObject(context)) {
      _.each(helpers, function (helper) {
        context[helper] = this[helper];
      }, this);
    }
  }

  // Helpers:
  function addDriver (name, callback) {
    var
      driver = {
        key : driverKey(name),
        name : name,
        passengers : []
      };
    pointer = driver;
    callback.call(this);
    pointer = null;
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
    pointer.passengers.push(passenger);
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
    return uniqueKey(pointer.passengers, nameToKey(name));
  }

  // Class
  object = {
    data : data,
    driver : driver,
    passenger : passenger,
    beforeEach : beforeEach,
    afterEach : afterEach,
    inject : inject
  };

  // Bind helpers to this instance.
  _.each(helpers, function (helper) {
    _.bindAll(object, helper);
  });

  return object;
};
