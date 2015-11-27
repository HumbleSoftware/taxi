taxi.ControlsView = Backbone.View.extend({
  tagName: 'span',
  className: 'taxi-runner-controls',
  events: {
    'click .taxi-control': 'onControl'
  },
  initialize: function () {
    this.collection = new Backbone.Collection();
  },
  addControl: function (name, callback) {
    this.collection.push({
      name: name,
      callback: callback
    });
  },
  render: function () {
    var html = '';
    this.collection.each(function (model, i) {
      html += '<button class="taxi-control" data-index="'+i+'">' + model.get('name') + '</button>';
    });
    this.$el.html(html);
  },
  onControl: function (e) {
    var index = this.$(e.currentTarget).data('index');;
    var model = this.collection.at(index);
    if (model) {
      model.get('callback')();
    }
  }
});
