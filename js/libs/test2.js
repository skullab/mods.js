var pack2 ;

mods.require(['test5'],function(test5){
	console.log(test5);
	pack2 = test5 ;
});

mods.create(function(){
	return pack2 ;
});