mods.config({
  root:'js/libs',
  baseTime:mods.SECONDS,
  other:true,
  create:function(){}
});
mods.require(['test6'],mods.SYNC);
console.log('-----------------> '+TEST6);

mods.require(['test','test2','test3','test4'],function(test,test2,time){
  console.log('CALLBACK');
  console.log('---------------> '+test);
  console.log('---------------> '+test2.foo);
  console.log('---------------> TIME TO LOAD',time);
  console.log('TIME : ',mods.getLoadedTime(arguments));
});
console.log('other operations');
console.log('other operations');
console.log('other operations');
console.log('other operations');
console.log('other operations');
console.log('other operations');
console.log('other operations');
