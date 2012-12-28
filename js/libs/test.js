<<<<<<< HEAD
mods.create(function(){
  var test ;
=======
mods.create(['test2'],function(test2){
  var foo = test2.getFoobar() + 'foo' ;
  console.log('test.js say ',foo);
  return {
    getFoo:function(){
      return foo ;
    }
  };
>>>>>>> 4.1
});
