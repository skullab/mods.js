/*******************************************************************************
 * Copyright (c) 2013 mods.js
 * http://skullab.com author : [ivan.maruca[at]gmail.com]
 * 
 * mods.js is under MIT LICENSE                      
 *                      _        _     
 *  _ __ ___   ___   __| |___   (_)___ 
 * | '_ ` _ \ / _ \ / _` / __|  | / __|
 * | | | | | | (_) | (_| \__ \_ | \__ \
 * |_| |_| |_|\___/ \__,_|___(_)/ |___/
 *                           |__/     
 * T Y N Y  M O D U L A R  L I B R A R Y                           
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED
 * "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
 * LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 ******************************************************************************/
 
if(typeof mods_context === 'undefined')mods_context = this.window || this ;
 
(function(context){
  
  context.mods = {
            version:'0.0.1',
            revision:'20/12/12',
            //------------------
            modules:[], // modules container
            //configuration
            root:'', // the root url to load files
            baseTime:'seconds' // set this to 'milliseconds' to display milliseconds
            
  };
  
  context.mods.create = _create ;
  context.mods.require = _require ;
  context.mods.importScript = _import ;
  context.mods.config = _config ;
  context.mods.quest = _quest ;
  context.mods.caps = _caps ;
//---------------------------------------------------------------------------
<<<<<<< HEAD
  var log , stack , maxStack , handler , handlerContent , timeInit , timeLoad ,
  _synchronized ;
=======
  var _sync = false ,  
  stack , 
  maxStack , 
  _libs = [] ,
  _requireCounter = 0 ,
  handler , 
  handlerContent , 
  timeInit , 
  timeLoad ;
>>>>>>> 2.1
//---------------------------------------------------------------------------
  log = function(){if(log.enable)console.log.apply(console,arguments);};
  log.enable = true ;
//---------------------------------------------------------------------------  
  /** Create a module
   *  Array require : an Array that contains other dependencies *optional*
   *  Function module : the definition of module
   **/        
  function _create(require,module){
    if(!(require.constructor == Array && arguments.length > 1 )){
      module = require ;
      require = null ;
    }
    
<<<<<<< HEAD
    log('create a module :',require,module);
    
    this.modules.push(module);
    
    if(require != null){
      log('need sync');
    	//this.require(require,module,true);
=======
    if(module != null){
    	this.modules.push(module);
    }
    
    if(require != null){
    	_sync = true ;
    	this.require(require,module);
>>>>>>> 2.1
    }
          
  }
  
<<<<<<< HEAD
=======
  function _hookModule(module){
	  console.log('hook',module);
	  context.mods.module.push(module);
  }
  
>>>>>>> 2.1
  /** Require modules
   *  Array libs : an Array that contains the modules to load
   *  Function callback : a function that fired when modules are completely load
   **/        
  function _require(libs,callback,sync){
    sync = sync || false ;
	  timeInit = (new Date()).getTime();
    maxStack = libs.length ;
    stack = 0 ;
    _requireCounter++ ;
    _libs.push({req:libs,call:callback}) ;
    handler = callback ;
    _synchronized = sync ;
    for(var i in libs){
<<<<<<< HEAD
       setTimeout(_req(libs[i],sync),0);
    }
  }
  
  function _update(){
    log('update');
=======
    	_req(libs[i]);
	}
  }
  
  function _asyncOnLoad(){
	  stack++;
	  if(stack == maxStack)console.log(_libs.pop());
	  _update();
  }
  
  function _syncOnLoad(){
	  console.log('sync');
	  if(stack == maxStack)console.log(_libs.pop());
  }
  
  function _update(){
	console.log('update',stack,maxStack);
>>>>>>> 2.1
    if(stack == maxStack){
      log('fire callback');
      var args = [] , vars = '' ;
      
      for(var i = maxStack - 1 ; i >= 0 ; i--){
        args[i] = context.mods.modules.pop()();
        log('pop module',args[i]);
      }
      
      for(var i = 0 ; i < args.length ; i++){
    	  vars += 'a['+i+'],' ;
      }
      
      timeLoad = (new Date()).getTime();
      var time = context.mods.baseTime == 'milliseconds' ? (timeLoad-timeInit) : (timeLoad-timeInit)/1000 ;
      args.push( time + ' ' + context.mods.baseTime);
      vars += 'a['+i+']' ;
      
<<<<<<< HEAD
=======
      console.log('vars',vars);
>>>>>>> 2.1
      var h = new Function('a','return '+handler+'('+vars+')');
      handlerContent = h(args);
      log('end callback');  
    }
  }
  
  function _req(lib,sync){
	  console.log('require :',lib);
    var script = document.createElement('script');
    script.type = 'text/javascript' ;
    script.async = true ;
    script.src = context.mods.root + '/' + lib + '.js' ;
<<<<<<< HEAD
    script.onload = function(){
      stack++;
      log('script '+script.src+' onload',stack,maxStack);
      if(_synchronized){
        
      }
       
      _update();
    }
=======
    script.onload = _sync ? _syncOnLoad : _asyncOnLoad ;
    //script.onload = _syncOnLoad ;
>>>>>>> 2.1
    document.head.appendChild(script);
  }
  /** Import files
   *  Array files : an Array that contains files to load
   *  This function load files in sync way
   **/      
  function _import(files){
    var xml = new XMLHttpRequest();
    for(var i in files){
      var file = files[i] + '.js' ;
      xml.open('GET',this.root + '/' + file,false);
      xml.send('');
      var response = xml.response ;
      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.text = response ;
      document.head.appendChild(script);
    }
  }
  /** Configuration
   *  Allow to configure your own module
   *  Object obj : an Object that contains configuration    
   **/     
  function _config(obj){
	  for(var option in obj){
		  if(context.mods[option] != 'undefined'){
			  context.mods[option] = obj[option] ;
		  }
	  }
  }
  
  /** Quest
   * Solve a condiction and load A is true or B otherwise
   * <condiction> : a condiction to solve
   * a,b : file string or Array to load      
   **/     
  function _quest(condiction,a,b){}
  
  function _caps(){};
  
})(mods_context);
