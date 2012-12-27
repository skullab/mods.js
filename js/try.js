/*mods.config({
  root:'js/libs'
});
mods.require(['test'],function(test){
  console.log('call callback ok',test);
}); */
mods.require(['test','test2','test3','test4'],function(){
  alert('ok');
});