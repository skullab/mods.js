<<<<<<< HEAD
mods.create(function(){
  var test3 ;
});
=======
mods.require(['test2'],function(test2){
	console.log(test2.getFoobar());
});
mods.create(function(){
	var sum = function(a,b){
		return a+b ;
	};
	return {
		sum:sum
	};
});
>>>>>>> 4.1
