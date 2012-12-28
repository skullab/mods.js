var pack = {} ;


mods.require(['test6'],function(test6,test62){
	console.log(test6,test62);
	pack.one = test6 ;
	pack.two = test62 ;
	console.log(pack);
	
});

mods.create(function(){
	return pack ;
});

