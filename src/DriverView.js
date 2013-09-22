taxi.DriverView = Backbone.View.extend({
  className : 'taxi-driver',
  initialize : function (options) {
    this.passenger = options.passenger;
    this.passengerViews = [];
  },
  remove : function () {
    _.invoke(this.passengerViews, 'remove');
    this.passengerViews = [];
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

    this.passengerViews.push(passengerView);
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
