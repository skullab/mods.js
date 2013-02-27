/*******************************************************************************
 * Copyright (c) 2012-2013 mods.js
 * http://skullab.com author : [ivan.maruca[at]gmail.com]
 * 
 * mods.js is under MIT LICENSE                      
 *                      _        _     
 *  _ __ ___   ___   __| |___   (_)___ 
 * | '_ ` _ \ / _ \ / _` / __|  | / __|
 * | | | | | | (_) | (_| \__ \_ | \__ \
 * |_| |_| |_|\___/ \__,_|___(_)/ |___/
 *                           |__/     
 * T I N Y  M O D U L A R  L O A D E R                            
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

/** 
 *  This is the context where it will be loaded MODS.JS
 *  to edit, assign a different object to the variable "mods_context" 
 *  before loading the script mods.js 
 * 
 * 	Example :
 *  <script> mods_context = MyContext = {} ;</script>
 *  <script src="path/to/lib/mods.js"></script>
 */
if (typeof MODS_CONTEXT === 'undefined'){ MODS_CONTEXT = this.window || this ; }

(function(context) {
/*+--------------------------------------------------------------------------+
 *| MODS : DEBUG                                                             |
 *+--------------------------------------------------------------------------+
 *| NOTE : Debug functions                                                    |
 *+--------------------------------------------------------------------------+ 
 */
	var log = function() {
    if(log.enable){
    	 //console.log.apply(console,arguments);
      if(typeof console != 'undefined' && console.log.apply){
        console.log.apply(console,arguments);
      }else if(typeof console != 'undefined'){
        var l = Function.prototype.bind.call(console.log, console);
			  l.apply(console, arguments);
      }
    }
	};
  
  log.d = function(){
    if(log.enable){
      var msg = '' ;
      for(var i=0 ; i < arguments.length ; i++){
        msg += arguments[i] + ' ' ;
      }
      var now = new Date();
      var timestamp = now.getFullYear() + '-' + now.getMonth() + '-'
			+ now.getDate() + ' ' + now.getHours() + ':' + now.getMinutes()
			+ ':' + now.getSeconds() + ':' + now.getMilliseconds();
      msg = console.log.apply ? arguments : msg ;
      console.log(timestamp,' MODS : ',msg);
    }
  }
//*****CHANGE THIS TO FALSE BEFORE RELEASE*****
	log.enable = true ;
/*+--------------------------------------------------------------------------+
 *| MODS : MAIN FLE                                                          |
 *+--------------------------------------------------------------------------+
 *| NOTE : The name of this file                                             |
 *+--------------------------------------------------------------------------+ 
 */
  var MODS_FILENAME = 'mods_ver-9.2.1'
/*+--------------------------------------------------------------------------+
 *| MODS : VERSIONING                                                        |
 *+--------------------------------------------------------------------------+
 *| NOTE : Versioning of the software, major, minor and revision             |
 *+--------------------------------------------------------------------------+
 */
  var VER_MAJOR = 9 ;
  var VER_MINOR = 2 ;
  var VER_REVISION = 1 ;
/*+--------------------------------------------------------------------------+
 *| MODS : ACCESIBILITY                                                      |
 *+--------------------------------------------------------------------------+
 *| NOTE : Accessibility by config function                                  |
 *+--------------------------------------------------------------------------+
 */
  var MODS_CONFIG_ACCESS = {root:0,baseTime:1} ;
/*+--------------------------------------------------------------------------+
 *| MODS : MAIN MODULE                                                       |
 *+--------------------------------------------------------------------------+
 *| NOTE : The main module of MODS                                           |
 *+--------------------------------------------------------------------------+
 */
  /** The main MODS object
   * see API for documentation
   **/      
	context.mods = {
    version: VER_MAJOR + '.' + VER_MINOR + '.' + VER_REVISION ,
    filename: MODS_FILENAME + '.js' ,
		root : '.' , 
		baseTime : 'seconds'
	};
  /** Create a module
	 *  Array require : an Array that contains other dependencies *optional*
	 *  Function module : the definition of module
	 **/   
	context.mods.create = _create;
  /** Require modules
	 *  Array libs : an Array that contains the modules to load
	 *  Function callback : a function that fired when modules are completely load
	 **/ 
	context.mods.require = _require;
  /** Configuration
	 *  Allow to configure your own module
	 *  Object obj : an Object that contains configuration    
	 **/     
	context.mods.config = _config ;
  /** Get the loaded time
   *  Arguments : the 'arguments' object of the callback function  
   **/     
  context.mods.getLoadedTime = _getLoadedTime ;
  /** Constants **/  
  context.mods.SECONDS = 'seconds' ;
  context.mods.MILLISECONDS = 'milliseconds' ;
  context.mods.SYNC = 'sync' ;
  context.mods.ASYNC = 'async' ;
/*+--------------------------------------------------------------------------+
 *| MODS : INTERNAL FUNCTIONS                                                |
 *+--------------------------------------------------------------------------+
 *| NOTE : The main functions of MODS with private scope                     |
 *+--------------------------------------------------------------------------+
 */ 
  // Variables
	var modules = [] , 
      requireCounter = 0 ,
      updateCounter = 0 , 
      currentPosition , 
      limbo = [] , 
      pendingPack = [] ,
      timeStart ,
      timeEnd ,
      timeDivider = 1000 ;  // for baseTime : default 'seconds'
      
	//Configuration
	function _config(obj){
	  for(var option in obj){
		  if(context.mods[option] != 'undefined' && option in MODS_CONFIG_ACCESS){
        log.d(option,' : is a valid option !');
			  context.mods[option] = obj[option] ;
		  }else{
        log.d(option,' : is a BAD option !');
      }
	  }
    timeDivider = context.mods.baseTime == context.mods.MILLISECONDS ? 1 : 1000 ;
	}
	// Require a module    
	function _require(libs, callback) {
    timeStart = (new Date()).getTime() ;
		log.d('require module', libs);
		modules[requireCounter] = new Array(libs.length);
    
    if(callback == context.mods.SYNC){
      _appendSync(_pack(libs,null,requireCounter))
    }else{
		  _append(_pack(libs, callback, requireCounter));
    }
    
		requireCounter++;
	}
	// Create a module  
	function _create(module) {
		log.d('create module', module, 'in position:', currentPosition);
		if (limbo[requireCounter] == undefined) {
			limbo[requireCounter] = [];
		}
		limbo[requireCounter].push(module);
	}
	// Package the modules / libraries
	function _pack(libs, callback, requireCounter) {
		return {
			libs : libs,
			counter : 0,
			callback : callback,
			id : requireCounter
		};
	}
  
/* -------------------------------------------------------------------------- 
                                   ASYNC WAY
   -------------------------------------------------------------------------- */
   
	// Create <script> and append it to HEAD !
	function _append(pack) {
		var max = pack.libs.length;
    var head = document.getElementsByTagName('head')[0] ;
		for ( var i in pack.libs) {
			var script = document.createElement('script');
			script.src = context.mods.root + '/' + pack.libs[i] + '.js';
			script.position = i;
			log.d('append', script.src);   
			script.onload = script.onreadystatechange = function(){
        if(!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete'){
				  pack.counter++;
			    var position = this.position;
          log.d('--------------------------> '+position);
				  log.d(this, 'is loaded', 'position:',position, pack.counter, max);
				  _update(pack, position);
        }
			}
      
			head.appendChild(script);
		}
	}
/* -------------------------------------------------------------------------- 
                                   SYNC WAY
   -------------------------------------------------------------------------- */
     
  function _appendSync(pack){
    var head = document.getElementsByTagName('head')[0] ;
    var xml = new XMLHttpRequest();
    for ( var i in pack.libs) {
      var script = document.createElement('script');
      script.type = 'text/javascript';
      
      var src = context.mods.root + '/' + pack.libs[i] + '.js';
      xml.open('GET',src,false);
      xml.send('');

      script.text = xml.response ;
      head.appendChild(script);
    }
  }
   
	// Main function callback for on load script
	function _update(pack, position) {
		currentPosition = position;
		log.d('module in position', position, 'is loaded', '->',
				pack.libs[position]);
		modules[pack.id][position] = limbo.pop();

		if (pack.counter == pack.libs.length) {
			log.d('all libs are loaded', pack.libs, 'ID :', pack.id,'requires :',requireCounter);
      updateCounter++;
      
			pendingPack.push(pack);
			log.d('UP COUNTER:',updateCounter,pendingPack);

			if (updateCounter == requireCounter) {
				_execPending();
			}
		}
	}
	// Executes the callback functions in succession
	function _execPending() {
		log.d('call pending...');
		if (pendingPack.length > 0) {
      pendingPack = _ord(pendingPack);
			for ( var p = pendingPack.length - 1; p >= 0; p--) {
				var pack = pendingPack[p];
				log.d('for pack:', pack);
				var args = [], vars = '';
				
				for ( var i = 0; i < pack.libs.length; i++) {
					var module = modules[pack.id][i];
					for ( var m in module) {
						log.d('---->', module[m],'is ',typeof(module[m]));
            if(typeof module[m] == 'function'){
              args.push(module[m]());
            }else if(typeof module[m] == 'string' || typeof module[m] == 'object'){
              args.push(module[m]);
            }
					}
				}

				for(var i = 0 ; i < args.length ; i++){
					vars += 'a['+i+'],' ;
				}  
        
				//vars = vars.replace(/]a/g,'],a');
        vars += 'a['+i+']' ; // add time here !
				log.d(args,vars);
				
				if(pack.callback != undefined){
					var h = new Function('a','return '+pack.callback+'('+vars+')');
          timeEnd = ((new Date()).getTime() - timeStart)/timeDivider ;
          args.push(timeEnd);
					h(args);
				}
				
			}
		}
	}
  // Reorders the pendingPack
  function _ord(o){
    var r = new Array(o.length);
    for(var i = 0 ; i < o.length ; i++){
      log.d('ord:',o[i].id);
      r[o[i].id] = o[i] ;
    }
    log.d('before ord:',o,'ord result:',r);
    return r ;
  }
  
  // Get the Loaded Time
  function _getLoadedTime(a){
    if(a != null && a.length != 'undefined'){
      var last = a.length - 1 ;
      if(last >= 0){
        return a[last] ;
      }
    }
    return false ;
  }

})(MODS_CONTEXT);