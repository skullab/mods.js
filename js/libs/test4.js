var pack = {} ;


mods.require(['test6'],function(test6,test62,time){
	console.log(test6,test62);
	pack.one = test6 ;
	pack.two = test62 ;
	console.log(pack);
  console.log(time);
	
});

mods.create(function(){
	return pack ;
});

