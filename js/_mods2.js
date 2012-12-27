if(typeof mods_context === 'undefined')mods_context = this.window || this ;
(function(context){
//---------------------------------------------------------------------------
  var log = function(){if(log.enable)console.log.apply(console,arguments);};
  log.enable = true ;
//---------------------------------------------------------------------------
  context.mods = {
    root:'js/libs',  //todo change
    baseTime:'seconds'
  }
  context.mods.create = _create ;
  context.mods.require = _require ;
  //context.mods.config = _config ;
//---------------------------------------------------------------------------
var modules = [] , requireCounter = 0 ,currentPosition , limbo = [] , pendingPack = [] ;

  function _require(libs,callback){
    log('require module',libs);
    modules[requireCounter] = new Array(libs.length) ;
    _append(_pack(libs,callback,requireCounter));
    requireCounter++ ;
  }
  function _create(module){
    log('create module',module,'in position:',currentPosition);
    if(limbo[requireCounter] == undefined){
      limbo[requireCounter] = [] ;
    }
    limbo[requireCounter].push(module);
  }
  
  function _pack(libs,callback,requireCounter){
    return {
      libs:libs,
      counter:0,
      callback:callback,
      id:requireCounter
    };
  }
  
  function _append(pack){
    var max = pack.libs.length ;
    for(var i in pack.libs){
      var script = document.createElement('script');
      script.src = context.mods.root + '/' + pack.libs[i] + '.js' ;
      script.position = i ;
      log('append',script.src);
      script.onload = function(e){
        pack.counter++ ;
        var position = e.srcElement.position ; 
        log(e.srcElement,'is loaded','position:',e.srcElement.position,pack.counter,max);
        _update(pack,position);
      }
      document.head.appendChild(script);
    }
  }
  
  function _update(pack,position){
    currentPosition = position ;
    log('module in position',position,'is loaded','->',pack.libs[position]);
    modules[pack.id][position] = limbo.pop() ;
    
    if(pack.counter == pack.libs.length){
      log('all libs are loaded',pack.libs,'ID :',pack.id);
      for(var i = 0 ; i < pack.libs.length ; i++){
        var module = modules[pack.id][i] ;
        for(var m in module){
          log('*****',module[m]);
        }
      }
      
      if(pack.id == requireCounter - 1){
        log('correct pack !',pack.id,requireCounter,'current position : ',currentPosition);
        if(pack.callback != undefined){
          log('fire callback...');
        }
        
        /*if(pendingPack.length > 0){
          log('have pending pack !',pendingPack);
          _execPending(pendingPack.pop(),modules[pack.id]);
        }else{
          log('no pending pack');
        }*/
        _execPending();
      }else {
        //log('pending pack...');
        pendingPack[pack.id] = pack ;
      } 
    }
  }
  
  function _execPending(){
    log('call pending...');
    if(pendingPack.length > 0){
       var pack = pendingPack.pop();
       log('execute pending...',pack);
       _execPending();
    }else{
      log('no pending ! STOP');
    }
  }
  
   
})(mods_context);
