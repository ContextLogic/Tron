setInterval(function(){
  $( "a" ).each(function(i){if (this.innerHTML.indexOf('MASTER.')!=-1) {newHTML = this.innerHTML.replace('MASTER.',''); newHTML = newHTML.replace(/_/g, ' '); this.innerHTML = newHTML;}})
}, 3000);
