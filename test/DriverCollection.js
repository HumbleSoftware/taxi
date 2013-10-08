describe('Driver Collection', function () {
  it('should contain Driver Models', function () {
    var
      driverCollection = new taxi.DriverCollection({
        key: '1'
      });
    expect(driverCollection.get('1')).to.be.an.instanceOf(taxi.DriverModel);
  });
});