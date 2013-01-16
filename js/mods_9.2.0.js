if(typeof mods_context === 'undefined'){mods_context = this.window || this ;} 
(function(context){
    
    context.mods = {
      version:'9.2.0',
      root:'js/libs'
    }
    
    context.mods.require = require ;
//------------------------------------
  var _id = 0 ;
       
    function require(lib,callback){
        if(!isArray(lib))throw new Error('Error Require : lib is not Array');
        var pack = {
          id:++_id,
          lib:lib,
          counter:0,
          callback:callback
        }
        load(pack);
    }
    
    function load(pack){
      for(i=0;i<pack.lib.length;i++){
        var script = createScript();
        script.src = context.mods.root + '/' + pack.lib[i] + '.js' ;
        script.onload = script.onreadystatechange = function(){
          if(!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete'){
            console.log('pack id : '+pack.id+' - '+this.src+' loaded');
            update(pack);
          }
        };
        document.getElementsByTagName('head')[0].appendChild(script);     
      }
    }
    
    function update(pack){
      //console.log(pack.counter++);
      if(++pack.counter == pack.lib.length){
        pack.callback();
      }
      console.log('counter',pack.counter);
    }
    
    function createScript(){
      return document.createElement('script') ;
    }
     
    function isArray(obj) {
      return obj.constructor == Array;
    }
})(mods_context);
