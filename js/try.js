mods.config({
	root:'js/libs',
	baseTime:'milliseconds'
});

mods.require(['test2'],function(test2){
  console.log(test2);
  console.log('test2.js say :',test2.getFoobar());
  console.log('loading time ',arguments[1]);
  
});