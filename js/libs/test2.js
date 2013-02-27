console.log('test2.js append');
mods.create({foo:'I\'m a property of an object in test2.js'});
mods.require(['test5'],function(test5){
	console.log('callback: test5 loaded');
});

/*mods.create(function(){
	return pack2 ;
});    */