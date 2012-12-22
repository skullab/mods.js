mods.create(['test2'],function(test2){
  var foo = test2.getFoobar() + 'foo' ;
  
  return {
    getFoo:function(){
      return foo ;
    }
  }
});
