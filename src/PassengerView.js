taxi.PassengerView = Backbone.View.extend({  
  tagName : 'li',
  className : 'taxi-passenger',
  emptyFunction : 'function (options) {\n}',
  events : {
    'click .tab' : 'onTab'
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
    this.editors['callback-editor'] = this.createEditor('.callback-editor', 
      this.model.callback || this.emptyFunction);
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
  },
  onTab : function (event) {
    var 
      $lastActive = this.$tabs.children('.active'),
      lastActiveClassName = $lastActive.data('control'),
      $active = this.$(event.currentTarget),
      activeClassName = $active.data('control');
      
    $lastActive.removeClass('active');
    $active.addClass('active');    

    this.$('.' + lastActiveClassName).hide();
    this.$('.' + activeClassName).show();    
    if (activeClassName === 'taxi-passenger-container') {
      this.model.callback = eval('(' + this.editors['callback-editor'].getValue() + ')');
      this.render();
    } else {
      this.editors[activeClassName].refresh();
    }
  }
});