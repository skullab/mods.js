/*mods.config({
  root:'js/libs'
});
<<<<<<< HEAD
mods.require(['test'],function(test){
  console.log('call callback ok',test);
}); */
mods.require(['test','test2','test3','test4'],function(){
  console.log('>>>>>>>>>>>> ok <<<<<<<<<<<<<<');
=======
mods.require(['test','test3'],function(test,test3){
  console.log('file test.js say',test.getFoo());
  var result = test3.sum(50,30);
  console.log(result);
>>>>>>> 4.1
});