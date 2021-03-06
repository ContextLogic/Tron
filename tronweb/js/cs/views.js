// Generated by CoffeeScript 1.9.3
(function() {
  var module,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  window.modules = window.modules || {};

  window.modules.views = module = {};

  window.dateFromNow = function(string, defaultString) {
    var delta, formatted, label_template, moment_offset, template, tz, user_tz;
    if (defaultString == null) {
      defaultString = 'never';
    }
    template = _.template("<span title=\"<%= formatted %>\" class=\"tt-enable\" data-placement=\"top\">\n    <%= delta %>\n</span>");
    label_template = _.template("<span class=\"label label-<%= type %>\"><%= delta %></span>");
    tz = window.timezone || 'UTC';
    user_tz = moment.tz.guess();
    moment_offset = moment.tz(string, tz).tz(user_tz);
    if (string) {
      formatted = moment_offset.format('MMM, Do YYYY, h:mm:ss a');
      delta = label_template({
        delta: moment_offset.fromNow(),
        type: "clear"
      });
    } else {
      formatted = defaultString;
      delta = label_template({
        delta: defaultString,
        type: "important"
      });
    }
    return template({
      formatted: formatted,
      delta: delta
    });
  };

  window.getDuration = function(time) {
    var hours, minutes, ms, ref, ref1, seconds;
    ref = time.split('.'), time = ref[0], ms = ref[1];
    ref1 = time.split(':'), hours = ref1[0], minutes = ref1[1], seconds = ref1[2];
    return moment.duration({
      hours: parseInt(hours),
      minutes: parseInt(minutes),
      seconds: parseInt(seconds)
    });
  };

  window.formatDuration = function(duration) {
    var humanize, template;
    template = _.template("<span class=\"label label-clear tt-enable\" title=\"<%= duration %>\">\n  <%= humanized %>\n</span>");
    humanize = getDuration(duration).humanize();
    return template({
      duration: duration,
      humanized: humanize
    });
  };

  window.isSelected = function(current, value) {
    if (current === value) {
      return "selected";
    } else {
      return "";
    }
  };

  window.makeTooltips = function(root) {
    return root.find('.tt-enable').tooltip();
  };

  window.formatName = (function(_this) {
    return function(name) {
      return name.replace(/\./g, '.<wbr/>').replace(/_/g, '_<wbr/>');
    };
  })(this);

  window.formatState = (function(_this) {
    return function(state) {
      return "<span class=\"label " + state + "\">" + state + "</span>";
    };
  })(this);

  module.makeHeaderToggle = function(root) {
    var headers;
    headers = root.find('.outline-block h2');
    headers.click(function(event) {
      return $(event.target).nextAll().slideToggle();
    });
    return headers.addClass('clickable');
  };

  window.FilterView = (function(superClass) {
    extend(FilterView, superClass);

    function FilterView() {
      this.selectFilterChange = bind(this.selectFilterChange, this);
      this.filterChange = bind(this.filterChange, this);
      this.getFilterFromEvent = bind(this.getFilterFromEvent, this);
      this.render = bind(this.render, this);
      this.renderFilters = bind(this.renderFilters, this);
      this.getFilterTemplate = bind(this.getFilterTemplate, this);
      return FilterView.__super__.constructor.apply(this, arguments);
    }

    FilterView.prototype.tagName = "div";

    FilterView.prototype.className = "";

    FilterView.prototype.defaultIcon = "icon-filter";

    FilterView.prototype.filterIcons = {
      name: "icon-filter",
      node_pool: "icon-connected",
      state: "icon-switchon",
      status: "icon-switchon"
    };

    FilterView.prototype.filterTemplate = _.template("<div class=\"input-prepend\">\n  <input type=\"text\" id=\"filter-<%= filterName %>\"\n         value=\"<%= defaultValue %>\"\n         class=\"input-medium\"\n         autocomplete=\"off\"\n         placeholder=\"<%= _.str.humanize(filterName) %>\"\n         data-filter-name=\"<%= filterName %>Filter\">\n  <i class=\"<%= icon %> icon-grey\"></i>\n</div>");

    FilterView.prototype.template = _.template("<form class=\"filter-form\">\n  <div class=\"control-group outline-block\">\n    <div class=\"controls\">\n    <div class=\"span1 toggle-header\"\n        title=\"Toggle Filters\">Filters</div>\n        <%= filters.join('') %>\n    </div>\n  </div>\n</form>");

    FilterView.prototype.getFilterTemplate = function(filterName) {
      var createName;
      createName = "create" + filterName;
      if (this[createName]) {
        return this[createName];
      } else {
        return this.filterTemplate;
      }
    };

    FilterView.prototype.renderFilters = function() {
      var createFilter, filters, k;
      createFilter = (function(_this) {
        return function(filterName) {
          var template;
          template = _this.getFilterTemplate(filterName);
          return template({
            defaultValue: _this.model.get(filterName + "Filter"),
            filterName: filterName,
            icon: _this.filterIcons[filterName] || _this.defaultIcon
          });
        };
      })(this);
      filters = _.map((function() {
        var results;
        results = [];
        for (k in this.model.filterTypes) {
          results.push(k);
        }
        return results;
      }).call(this), createFilter);
      return this.$el.html(this.template({
        filters: filters
      }));
    };

    FilterView.prototype.render = function() {
      this.renderFilters();
      this.delegateEvents();
      makeTooltips(this.$el);
      return this;
    };

    FilterView.prototype.events = {
      "keyup input": "filterChange",
      "submit": "submit",
      "change input": "filterDone",
      "change select": "selectFilterChange"
    };

    FilterView.prototype.getFilterFromEvent = function(event) {
      var filterEle;
      filterEle = $(event.target);
      return [filterEle.data('filterName'), filterEle.val()];
    };

    FilterView.prototype.filterChange = function(event) {
      var filterName, filterValue, ref;
      ref = this.getFilterFromEvent(event), filterName = ref[0], filterValue = ref[1];
      this.model.set(filterName, filterValue);
      return this.trigger('filter:change', filterName, filterValue);
    };

    FilterView.prototype.filterDone = function(event) {
      var filterName, filterValue, ref;
      ref = this.getFilterFromEvent(event), filterName = ref[0], filterValue = ref[1];
      this.trigger('filter:done', filterName, filterValue);
      return window.modules.routes.updateLocationParam(filterName, filterValue);
    };

    FilterView.prototype.selectFilterChange = function(event) {
      this.filterChange(event);
      return this.filterDone(event);
    };

    FilterView.prototype.submit = function(event) {
      return event.preventDefault();
    };

    return FilterView;

  })(Backbone.View);

  window.RefreshToggleView = (function(superClass) {
    extend(RefreshToggleView, superClass);

    function RefreshToggleView() {
      this.triggerRefresh = bind(this.triggerRefresh, this);
      this.toggle = bind(this.toggle, this);
      this.render = bind(this.render, this);
      return RefreshToggleView.__super__.constructor.apply(this, arguments);
    }

    RefreshToggleView.prototype.initialize = function() {
      this.listenTo(mainView, 'closeView', this.model.disableRefresh);
      return this.listenTo(this.model, 'refresh', this.triggerRefresh);
    };

    RefreshToggleView.prototype.tagName = "div";

    RefreshToggleView.prototype.className = "refresh-view pull-right";

    RefreshToggleView.prototype.attributes = {
      "type": "button",
      "data-toggle": "button"
    };

    RefreshToggleView.prototype.template = _.template("<span class=\"muted\"><%= text %></span>\n<button class=\"btn btn-clear tt-enable <%= active %>\"\n    title=\"Toggle Refresh\"\n    data-placement=\"top\">\n    <i class=\"icon-refresh icon-white\"></i>\n</button>");

    RefreshToggleView.prototype.render = function() {
      var active, text;
      if (this.model.enabled) {
        text = "Refresh " + (this.model.interval / 1000) + "s";
        active = "active";
      } else {
        text = active = "";
      }
      this.$el.html(this.template({
        text: text,
        active: active
      }));
      this.delegateEvents();
      makeTooltips(this.$el);
      return this;
    };

    RefreshToggleView.prototype.events = {
      "click button": "toggle"
    };

    RefreshToggleView.prototype.toggle = function(event) {
      this.model.toggle(event);
      return this.render();
    };

    RefreshToggleView.prototype.triggerRefresh = function() {
      return this.trigger('refreshView');
    };

    return RefreshToggleView;

  })(Backbone.View);

  window.ClickableListEntry = (function(superClass) {
    extend(ClickableListEntry, superClass);

    function ClickableListEntry() {
      this.propogateClick = bind(this.propogateClick, this);
      return ClickableListEntry.__super__.constructor.apply(this, arguments);
    }

    ClickableListEntry.prototype.className = function() {
      return "clickable";
    };

    ClickableListEntry.prototype.events = {
      "click": "propogateClick"
    };

    ClickableListEntry.prototype.propogateClick = function(event) {
      if (event.button === 0) {
        return document.location = this.$('a').first().attr('href');
      }
    };

    return ClickableListEntry;

  })(Backbone.View);

  module.makeSlider = function(root, options) {
    return root.find('.slider-bar').slider(options);
  };

  module.SliderView = (function(superClass) {
    extend(SliderView, superClass);

    function SliderView() {
      this.updateDisplayCount = bind(this.updateDisplayCount, this);
      this.handleSliderMove = bind(this.handleSliderMove, this);
      return SliderView.__super__.constructor.apply(this, arguments);
    }

    SliderView.prototype.initialize = function(options) {
      options = options || {};
      return this.displayCount = options.displayCount || 10;
    };

    SliderView.prototype.tagName = "div";

    SliderView.prototype.className = "list-controls controls-row";

    SliderView.prototype.template = "<div class=\"span1\">\n  <span id=\"display-count\" class=\"label label-inverse\"></span>\n</div>\n<div class=\"slider-bar span10\"></div>";

    SliderView.prototype.handleSliderMove = function(event, ui) {
      this.updateDisplayCount(ui.value);
      return this.trigger('slider:change', ui.value);
    };

    SliderView.prototype.updateDisplayCount = function(count) {
      var content;
      this.displayCount = count;
      content = count + " / " + (this.model.length());
      return this.$('#display-count').html(content);
    };

    SliderView.prototype.render = function() {
      this.$el.html(this.template);
      this.updateDisplayCount(_.min([this.model.length(), this.displayCount]));
      module.makeSlider(this.$el, {
        max: this.model.length(),
        min: 0,
        range: 'min',
        value: this.displayCount,
        slide: this.handleSliderMove
      });
      return this;
    };

    return SliderView;

  })(Backbone.View);

}).call(this);
