(function() {
  var isInputField, module, setFocusBinds;
  window.modules = window.modules || {};
  module = window.modules.keybinds = {};
  isInputField = function(event) {
    var _ref;
    return (_ref = event.target.tagName.toLowerCase()) === 'input' || _ref === 'textarea';
  };
  setFocusBinds = function(el) {
    return el.bind('keydown', function(event) {
      if (isInputField(event)) {
        return;
      }
      switch (event.keyCode) {
        case 17:
          window.find();
          break;
        case 70:
          $('#view-full-screen').click();
          break;
        case 78: // 'n' to start new run for job pages
          if ($('.jobruns').length > 0) {
            $.post(
              "http://tron:8089/api/jobs/"+window.location.hash.substring(5),
              { command: "start" },
              function(data) {
                alert("Scheduled new run");
                location.reload();
              }
            );
          }
        case 82:
          $('.refresh-view .btn').click();
          break;
        case 83:
          $('.search-query').focus();
          break;
        default:
          return;
      }
      //return event.preventDefault();
    });
  };
  $(document).ready(function() {
    return setFocusBinds($(document));
  });
}).call(this);
