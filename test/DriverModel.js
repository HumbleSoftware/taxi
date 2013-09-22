describe('Driver Model', function () {
  describe('Initilization', function () {
    beforeEach(function () {
      this.driverModel = new taxi.DriverModel();
    });
    it('should have an empty key by default', function () {
      expect(this.driverModel.get('key')).to.be.empty;
    });
    it('should have an empty name by default', function () {
      expect(this.driverModel.get('name')).to.be.empty;
    });
  });
  describe('ID Attribute', function () {
    it('should use the key attribute as ID', function () {
      var 
        driverModel = new taxi.DriverModel({ 
          key : '1'
        });
      expect(driverModel.id).to.equal(driverModel.get('key'));
      expect(driverModel.id).to.equal('1');
    });
  });
});