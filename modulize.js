/*******************************************************************************
 * Copyright (c) 2013 Modulize.js
 * http://skullab.com author : [ivan.maruca[at]gmail.com]
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
  
  context.modulize = {
            version:'0.0.1',
            revision:'20/12/12',
  }
  
  context.modulize.define = _define ;
  context.modulize.require = _require ;
  context.modulize.importScript = _import ;
  
  /** Define a module
   *  Array require : an Array that contains other dependencies *optional*
   *  Function module : the definition of module
   **/        
  function _define(require,module){
    require = require.constructor == Array && arguments.length > 1 ? require : null ;
       
  }
  
  /** Require modules
   *  Array libs : an Array that contains the modules to load
   *  Function callback : a function that fired when modules are completely load
   **/        
  function _require(libs,callback){}
  
  /** Import files
   *  Array files : an Array that contains files to load
   *  This function load files in sync way
   **/      
  function _import(files){
    var xml = new XMLHttpRequest()
    xml.open('GET',files,false);
    xml.send('');
    var response = xml.response ;
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.text = response ;
    document.head.appendChild(script);
  }
  
})(context);