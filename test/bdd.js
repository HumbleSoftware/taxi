describe('bdd', function () {
  var
    HELPERS = [
      'driver',
      'passenger',
      'beforeEach',
      'afterEach'
    ];

  beforeEach(function () {
    this.bdd = taxi.bdd();
  });

  it('instantiates', function () {});

  // driver()
  describe('driver()', function () {
    it('adds a driver', function () {
      var
        driver = this.bdd.driver('test', function () {});
      expect(driver.key).to.be.ok;
      expect(driver.name).to.equal('test');
      expect(driver.passengers).to.be.an('array');
    });
    it('adds two drivers', function () {
      var
        a = this.bdd.driver('a', function () {}),
        b = this.bdd.driver('b', function () {});
      expect(a.name).to.equal('a');
      expect(b.name).to.equal('b');
    });
    it('creates unique keys', function () {
      var
        a = this.bdd.driver('test', function () {}),
        b = this.bdd.driver('test', function () {});
      expect(a.key).to.equal('test');
      expect(b.name).to.equal('test');
      expect(b.key).to.equal('test_1');
    });
    it('invokes the driver callback', function (done) {
      this.bdd.driver('test', function () { done(); });
    });
    it('throws an error for invalid name', function () {
      var
        bdd = this.bdd;
      function test () {
        bdd.driver(null, '1234');
      }
      expect(test).to.throws('invalid driver name');
    });
    it('throws an error for invalid callback', function () {
      var
        bdd = this.bdd;
      function test () {
        bdd.driver('test');
      }
      expect(test).to.throws('invalid driver callback');
    });
    it('throws an error when driving a driver', function () {
      var
        bdd = this.bdd;
      function test () {
        bdd.driver('test', function () {
          bdd.driver('test 2', function () {});
        });
      }
      expect(test).to.throws('already driving');
    });
  });

  // passenger()
  describe('passenger()', function () {
    it('adds a passenger', function () {
      var
        bdd = this.bdd;
      bdd.driver('test', function () {
        var
          callback = function () {},
          data = bdd.passenger('a', callback);
        expect(data.key).to.equal('a');
        expect(data.name).to.equal('a');
        expect(data.callback).to.equal(callback);
      });
    });
    it('adds two passengers', function () {
      var
        bdd = this.bdd;
      bdd.driver('test', function () {
        var
          a = bdd.passenger('a', function () {}),
          b = bdd.passenger('b', function () {});
        expect(a.name).to.equal('a');
        expect(b.name).to.equal('b');
      });
    });
    it('creates unique keys', function () {
      var
        bdd = this.bdd;
      bdd.driver('test', function () {
        var
          a = bdd.passenger('a', function () {}),
          b = bdd.passenger('a', function () {});
        expect(a.key).to.equal('a');
        expect(b.name).to.equal('a');
        expect(b.key).to.equal('a_1');
      });
    });
    it('throws an error for invalid name', function () {
      var
        bdd = this.bdd;
      function test () {
        bdd.driver('test', function () {
          bdd.passenger(null);
        });
      }
      expect(test).to.throws('invalid passenger name');
    });
    it('throws an error for invalid callback', function () {
      var
        bdd = this.bdd;
      function test () {
        bdd.driver('test', function () {
          bdd.passenger('a');
        });
      }
      expect(test).to.throws('invalid passenger callback');
    });
    it('throws an error without a driver', function () {
      var
        bdd = this.bdd;
      function test () {
        bdd.passenger('test', function () {});
      }
      expect(test).to.throws('no driver');
    });
  });

  // beforeEach()
  describe('beforeEach()', function () {
    it('adds a before callback', function () {
      this.bdd.beforeEach(function () {});
    });
    it('adds a before callback in driver', function () {
      var
        bdd = this.bdd;
      bdd.driver('test', function () {
        bdd.beforeEach(function () {});
      });
    });
  });

  // afterEach()
  describe('afterEach()', function () {
    it('adds an after callback', function () {
      this.bdd.afterEach(function () {});
    });
    it('adds a after callback in driver', function () {
      var
        bdd = this.bdd;
      bdd.driver('test', function () {
        bdd.afterEach(function () {});
      });
    });
  });

  // data()
  describe('data()', function () {
    it('returns config data', function () {
      var
        data = this.bdd.data();
      expect(data).to.be.an('object');
      expect(data.drivers).to.be.an('array');
    });
    it('returns array of drivers', function () {
      var
        a = this.bdd.driver('a', function () {}),
        b = this.bdd.driver('b', function () {}),
        data = this.bdd.data(),
        drivers = data.drivers;
      expect(drivers.length).to.equal(2);
      expect(drivers[0]).to.equal(a);
      expect(drivers[1]).to.equal(b);
    });
    it('adds passengers to a driver', function () {
      var
        bdd = this.bdd,
        driver, a, b;
      driver = bdd.driver('test', function () {
        a = bdd.passenger('a', function () {}),
        b = bdd.passenger('b', function () {});
      });
      expect(driver.passengers.length).to.equal(2);
      expect(driver.passengers[0]).to.equal(a);
      expect(driver.passengers[1]).to.equal(b);
    });
  });

  // inject()
  describe('inject()', function () {
    it('adds helpers to context object', function () {
      var
        context = {};
      this.bdd.inject(context);
      expect(context).to.have.keys(HELPERS);
    });
    it('does nothing with non-object context', function () {
      this.bdd.inject();
    });
  });
});
