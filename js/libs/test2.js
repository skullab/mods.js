mods.create(['test'],function(test){
	console.log(test);
	var foobar = test.getFoo() + 'bar' ; 
	return {
		getFoobar:function(){
			return foobar ;
		}
	}
});