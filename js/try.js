mods.config({
	root:'js/libs',
  baseTime:'milliseconds'
}); 
mods.require(['test','test2','test3','test4'],function(test,test2,test3,test4,time){
  console.log(test,test2,test3,test4);
  console.log(time);
});
