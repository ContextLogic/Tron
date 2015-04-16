setInterval(function(){
  $( "a" ).each(function(i){if (!this.innerHTML){return} if (this.innerHTML.indexOf('MASTER.')!=-1) {newHTML = this.innerHTML.replace('MASTER.','');} else {newHTML = this.innerHTML.replace('.', ' - ');} newHTML = newHTML.replace(/_/g, ' '); this.innerHTML = newHTML;})
}, 3000);
