mods.config({
	root:'js/libs'
});
mods.require(['test','test2','test3','test4'],function(test,test2,test3,test4){
  console.log(test,test2,test3,test4);
});
