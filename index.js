driver('Component One', function () {
  passenger('One Default', function (options) {
    var
      $container = options.$container;
    $container.html('hello world');
  });
  passenger('One Special', function (options) {
    var
      $container = options.$container;
    $container.html('hello world');
  });
});
driver('Component Two', function () {
  beforeEach(function (options) {
    options.$container.append('<p>some common html</p>');
  });
  passenger('Default Content', function () {});
  passenger('Special Content', function (options) {
    options.$container.append('<p>extra special content</p>');
  });
});
driver('Error Component', function () {
  passenger('native error', function () {
    var
      object = {};
    object.test();
  });
  passenger('custom error', function () {
    throw new Error('error');
  });
  passenger('no error', function (options) {
    options.$container.text('no error!');
  });
});
