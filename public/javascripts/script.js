$(document).ready(function(){
  var counter = 0;
  $('#bao').hover(
    function(){
      $('#bao').html('bao for the lulz');
      counter += 1;
      if(counter >= 10){
        $('#unicorn').html('you\'re riding the unicorn!');
      }
      if(counter >= 100){
        $('#stop').html('the unicorn\'s rectum is tired, why not take a break?');
      }
    },
    function(){
      $('#bao').html('ao for the lulz');
      if(counter >= 10){
        $('#unicorn').html('you\'re riding the unicorn!');
      }
      if(counter >= 100){
        $('#stop').html('the unicorn\'s rectum is tired, why not take a break?');
      }
    }
  );
});