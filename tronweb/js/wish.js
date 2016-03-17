setInterval(function(){
  $( "a" ).each(function(i){if (!this.innerHTML){return} if (this.innerHTML.indexOf('MASTER.')!=-1) {newHTML = this.innerHTML.replace('MASTER.','');} else {newHTML = this.innerHTML.replace('.', ' - ');} newHTML = newHTML.replace(/_/g, ' '); this.innerHTML = newHTML;})
}, 3000);
confirm_job_run = function() {
  if (confirm("Start new cron run now?") == true) {
    $.post(
      "http://tron:8089/api/jobs/"+window.location.hash.substring(5),
      { command: "start" },
      function(data) {
        location.reload();
      }
    );
  }
}

$(document).ready(function(){
  $.ajax({
    url: document.location,
    success: function(data, textStatus, jqXHR) {
      window.timezone = jqXHR.getResponseHeader('X-Time-Zone');
    }
  });
});
