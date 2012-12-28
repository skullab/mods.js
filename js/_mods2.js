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

/** This is the context where it will be loaded MODS.JS
 *  to edit, assign a different object to the variable "mods_context" 
 *  before loading the script mods.js 
 * 
 * 	Example :
 *  <script> mods_context = MyContext = {} ;</script>
 *  <script src="path/to/lib/mods.js"></script>
 */
if (typeof mods_context === 'undefined'){ mods_context = this.window || this ; }

(function(context) {
// -------------------------ONLY FOR DEBUG------------------------------------
	var log = function() {
    if(log.enable){
      if(typeof console != 'undefined' && console.log.apply){
        console.log.apply(console,arguments);
      }else if(typeof console != 'undefined'){
        var l = Function.prototype.bind.call(console.log, console);
			  l.apply(console, arguments);
      }else{
        for(var i = 0 ; i < arguments.length ; i++)
          document.write(arguments[i]+'<br>');
      }
    }
	};
	log.enable = true;
// -------------------------PUBBLIC ACCESS------------------------------------
	context.mods = {
		root : '', 
		baseTime : 'seconds'
	};
	context.mods.create = _create;
	context.mods.require = _require;
	context.mods.config = _config ;
// ---------------------------------------------------------------------------
	var modules = [] , 
      requireCounter = 0 ,
      updateCounter = 0 , 
      currentPosition , 
      limbo = [] , 
      pendingPack = [] ;
	
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
	/** Require modules
	 *  Array libs : an Array that contains the modules to load
	 *  Function callback : a function that fired when modules are completely load
	 **/        
	function _require(libs, callback) {
		log('require module', libs);
		modules[requireCounter] = new Array(libs.length);
		_append(_pack(libs, callback, requireCounter));
		requireCounter++;
	}
	/** Create a module
	 *  Array require : an Array that contains other dependencies *optional*
	 *  Function module : the definition of module
	 **/   
	function _create(module) {
		log('create module', module, 'in position:', currentPosition);
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
	// Create <script> and append it to HEAD !
	function _append(pack) {
		var max = pack.libs.length;
    var head = document.getElementsByTagName('head')[0] ;
		for ( var i in pack.libs) {
			var script = document.createElement('script');
			script.src = context.mods.root + '/' + pack.libs[i] + '.js';
			script.position = i;
			log('append', script.src);
      
      /*if(script.attachEvent)
      script.attachEvent('onload',new function(){
        pack.counter++;
				var position = script.position;
				log(script, 'is loaded', 'position:',
						position, pack.counter, max);
				_update(pack, position);
      });*/
      
			script.onload = function(e) {
				pack.counter++;
				var element = e.target || e.srcElement ;
				var position = element.position;
				log(element, 'is loaded', 'position:',
						position, pack.counter, max);
				_update(pack, position);
			}
      
			head.appendChild(script);
		}
	}
	// Main function callback for on load script
	function _update(pack, position) {
		currentPosition = position;
		log('module in position', position, 'is loaded', '->',
				pack.libs[position]);
		modules[pack.id][position] = limbo.pop();

		if (pack.counter == pack.libs.length) {
			log('all libs are loaded', pack.libs, 'ID :', pack.id,'requires :',requireCounter);
      updateCounter++;
      
			pendingPack.push(pack);
			log('UP COUNTER:',updateCounter,pendingPack);

			if (updateCounter == requireCounter) {
				_execPending();
			}
		}
	}
	// Executes the callback functions in succession
	function _execPending() {
		log('call pending...');
		if (pendingPack.length > 0) {
      pendingPack = _ord(pendingPack);
			for ( var p = pendingPack.length - 1; p >= 0; p--) {
				var pack = pendingPack[p];
				log('for pack:', pack);
				var args = [], vars = '';
				
				for ( var i = 0; i < pack.libs.length; i++) {
					var module = modules[pack.id][i];
					for ( var m in module) {
						log('---->', module[m]);
						args.push(module[m]());
					}
				}
				for(var i = 0 ; i < args.length ; i++){
					vars += 'a['+i+']' ;
				}
				vars = vars.replace(/]a/g,'],a');
				log(args,vars);
				
				if(pack.callback != undefined){
					var h = new Function('a','return '+pack.callback+'('+vars+')');
					h(args);
				}
				
			}
		}
	}
  // Reorders the pendingPack
  function _ord(o){
    var r = new Array(o.length);
    for(var i = 0 ; i < o.length ; i++){
      log('ord:',o[i].id);
      r[o[i].id] = o[i] ;
    }
    log('before ord:',o,'ord result:',r);
    return r ;
  }

})(mods_context);
