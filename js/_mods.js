if(typeof mods_context === 'undefined')mods_context = this.window || this ;
(function(context){
//---------------------------------------------------------------------------
  var log = function(){if(log.enable)console.log.apply(console,arguments);};
  log.enable = true ;
//--------------------------------------------------------------------------- 
  context.mods = {
    root:'',
    baseTime:'seconds'
  }
  context.mods.create = _create ;
  context.mods.require = _require ;
  context.mods.config = _config ;
//--------------------------------------------------------------------------- 
  var modules = [] ,
      pendingPack = [] , 
      counterRequire = 0 ,
      counterModule = 0 ,
      timeInit , timeLoad ;
  
  function _require(libs,callback){
    timeInit = (new Date()).getTime();
    var pack = {} ;
    pack.libs = libs ;
    pack.maxStack = libs.length ;
    pack.counter = 0 ;
    pack.callback = callback ;
    _pendingRequire(pack);
    counterRequire++ ;     
  }
  
  function _create(require,module){
    if(!(isArray(require) && arguments.length > 1)){
      module = require ;
      require = null ;
    }  
    log('create module',require,module);
    
    if(require != null){
      this.require(require,module);
    }
    
    _pendingModule(module);
    counterModule++;
  }
  
  function _pendingRequire(pack){
    pendingPack[counterRequire] = pack ;
    log('pending',pendingPack);
    _append(pack,counterRequire);
  }
  
  function _append(pack,group){
    for(var i in pack.libs){
      var script = document.createElement('script');
      script.src = context.mods.root + '/' + pack.libs[i] + '.js' ;
      var oneShot = true ;
      script.onload = function(){
        log(script.src,'is loaded',pack.counter);
        if(oneShot)pack.counter++;
        var check = _update(group);
        if(!check){
          log(pack,'is pending...');
          oneShot = false ;
          setTimeout(arguments.callee,1000);
        }
      }
      document.head.appendChild(script);
    }
  }
  
  function _update(group){
    log(group,counterRequire-1);
    if(group != counterRequire-1)return false ;
    var pack = pendingPack[group] ;
    if(pack.counter == pack.maxStack){
      log('fire callback of',pack,group);
      var args = [] , vars = '' ;
      
      for(var i = pack.maxStack - 1 ; i >= 0 ; i--){
        args[i] = modules[group]();
        log('pop module',args[i]);
      }
      
      for(var i = 0 ; i < args.length ; i++){
    	  vars += 'a['+i+'],' ;
      }
      
      timeLoad = (new Date()).getTime();
      var time = context.mods.baseTime == 'milliseconds' ? (timeLoad-timeInit) : (timeLoad-timeInit)/1000 ;
      args.push( time + ' ' + context.mods.baseTime);
      vars += 'a['+i+']' ;
      
      var h = new Function('a','return '+pack.callback+'('+vars+')');
      handlerContent = h(args);
      log('end callback');
      counterRequire--;
      return true ;  
    }
    return false;
  }
  
  function _pendingModule(module){
    modules[counterModule] = module ;
  }
  
  function _config(obj){
	  for(var option in obj){
		  if(context.mods[option] != 'undefined'){
			  context.mods[option] = obj[option] ;
		  }
	  }
  }
  
  function isArray(a){return (a.constructor === Array);}
  function isFunction(f){return (typeof f === 'function');}
  
})(mods_context);
