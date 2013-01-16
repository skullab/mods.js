console.log('test2.js append');
mods.create(function(){
  return {
    foo:'ooooooooooooook'
  } ;
})
mods.require(['test5'],function(test5){
	console.log('callback: test5 loaded');
});

/*mods.create(function(){
	return pack2 ;
});    */