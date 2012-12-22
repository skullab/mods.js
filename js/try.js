mods.config({
  root:'js/libs'
});
mods.require(['test'],function(test){
  console.log('call callback ok',test);
});