describe('Config Model', function () {
  it('throws TypeError if drivers are not set', function () {
    function test() {
      var
        configModel = new taxi.ConfigModel();
    }
    expect(test).to.throw(TypeError, /Cannot read property 'drivers'/);
  });
  it('creates a DriverCollection', function () {
    var
      configModel = new taxi.ConfigModel({});
    expect(configModel.drivers).to.be.an.instanceOf(taxi.DriverCollection);
  })
});