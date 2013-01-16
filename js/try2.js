mods.config({
  root:'js/libs',
  baseTime:mods.MILLISECONDS
});
mods.require(['test','test2','test3','test4'],function(test,test2){
  console.log('all libs are loaded');
  console.log('---------------> '+test);
  console.log('---------------> '+test2.foo);
  console.log('TIME : ',mods.getLoadedTime(arguments));
});
console.log('other operations');
console.log('other operations');
console.log('other operations');
console.log('other operations');
console.log('other operations');
console.log('other operations');
console.log('other operations');
