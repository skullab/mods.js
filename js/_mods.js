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
      pendingOnLoad = [],
      counterRequire = 0 ,
      counterModule = 0 ,
      handlerContent = [] ,
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
      pack.counter++
      script.onload = function(){
        log(script.src,'is loaded',pack.counter);
        var check = _update(group,arguments.callee);
        if(!check){
          log(pack,'is pending...');
        }
      }
      document.head.appendChild(script);
    }
  }
  
  function _update(group,caller){
    log(group,counterRequire-1);
    var pack = pendingPack[group] ;
    if(group != counterRequire-1){
    	pendingOnLoad[group] = caller ;
    	return false ;
    }
    if(pack.counter == pack.maxStack){
      log('fire callback ->',pack.callback,group,modules);
      var args = [] , vars = '' ;
      
      for(var i = pack.maxStack - 1 ; i >= 0 ; i--){
        try{args[i] = modules.pop()();}catch(e){
        	log('ERROR',handlerContent,e);
        	args[i] = handlerContent.pop();
        }
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
      log(args,h);
      handlerContent.push((h(args)));
      log('end callback',handlerContent);
      counterRequire--;
      if(pendingOnLoad.length > 0){
    	  log('fire pending onload');
    	  var fn = pendingOnLoad.pop() ;
    	  log(fn);
    	  fn();
      }
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
