mods.create(function(){
  var foo = 'foo' ;
  
  return {
    getFoo:function(){
      return foo ;
    }
  }
});

console.log(mods.modules);
