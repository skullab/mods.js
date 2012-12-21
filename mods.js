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
 
 if(typeof context === 'undefined')context = this.window || this ;
 
(function(context){
  
  context.mods = {
            version:'0.0.1',
            revision:'20/12/12',
            //------------------
            modules:[],
            //configuration
            root:'',
            forceAsync:false
  }
  
  context.mods.create = _create ;
  context.mods.require = _require ;
  context.mods.importScript = _import ;
  context.mods.config = _config ;
  context.mods.quest = _quest ;
  context.mods.caps = _caps ;
//---------------------------------------------------------------------------
  var stack , maxStack , handler ;
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
    this.modules.push(module);       
  }
  
  /** Require modules
   *  Array libs : an Array that contains the modules to load
   *  Function callback : a function that fired when modules are completely load
   **/        
  function _require(libs,callback){
    maxStack = libs.length ;
    stack = 0 ;
    handler = callback ;
    for(var i in libs){
       _req(libs[i]);
    }
  }
  
  function _update(){
    if(stack == maxStack){
      var args = '' ;
      for(var i = maxStack - 1 ; i >= 0 ; i--){
        arguments[i] = context.mods.modules.pop()();
        console.log(i,arguments[i]);
      }
      var h = new Function('a,b,c','console.log(a,b,c);')
      h(1,2,3);
      handler(arguments);  
    }
  }
  
  function _req(lib){
    var script = document.createElement('script');
    script.type = 'text/javascript' ;
    script.async = true ;
    script.src = lib ;
    script.onload = function(){
       stack++;
       _update();
    }
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
      xml.open('GET',file,false);
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
  function _config(obj){}
  
  /** Quest
   * Solve a condiction and load A is true or B otherwise
   * <condiction> : a condiction to solve
   * a,b : file string or Array to load      
   **/     
  function _quest(condiction,a,b){}
  
  function _caps(){};
  
})(context);