taxi.PassengerView = Backbone.View.extend({  
  tagName : 'li',
  className : 'taxi-passenger',
  emptyFunction : 'function (options) {\n}',
  events : {
    'click .tab' : 'switchTabs'
  },
  switchTabs : function (event) {
    var 
      $lastSelected = this.$tabs.children('.selected'),
      lastSelectedId = $lastSelected.attr('id'),
      $selected = this.$(event.currentTarget),
      selectedId = $selected.attr('id');
      
    $lastSelected.removeClass('selected');
    $selected.addClass('selected');    

    this.$('.' + lastSelectedId).hide();
    this.$('.' + selectedId).show();    
    if (selectedId === 'taxi-passenger-container') {
      this.before = eval('(' + this.editors['before-editor'].getValue() + ')');
      this.model.callback = eval('(' + this.editors['callback-editor'].getValue() + ')');
      this.after = eval('(' + this.editors['after-editor'].getValue() + ')');
      this.render();
    } else {
      this.editors[selectedId].refresh();
    }
  },
  initialize : function (options) {
    this.driverKey = options.driverKey;
    this.before = options.before;
    this.after = options.after;    
    this.editors = [];
    this.context = {};
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
    this.$tabs = this.$('.tabs');  
    this.createEditors();    
    this.executeCallbacks();
    return this;
  },
  createEditors : function () {    
    this.editors['before-editor'] = this.createEditor('.before-editor', this.before || this.emptyFunction);
    this.editors['callback-editor'] = this.createEditor('.callback-editor', this.model.callback || this.emptyFunction);
    this.editors['after-editor'] = this.createEditor('.after-editor', this.after || this.emptyFunction);
  },
  createEditor : function (classSelector, value) {
    return CodeMirror(this.$(classSelector)[0], { 
      value: value.toString(),
      mode: 'text/javascript',
      lineNumbers: true,
      tabSize: 2,
      lineWrapping: true,
      viewportMargin: Infinity,
      autofocus: true
    }); 
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