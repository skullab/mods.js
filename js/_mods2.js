if (typeof mods_context === 'undefined')
	mods_context = this.window || this;
(function(context) {
	// ---------------------------------------------------------------------------
	var log = function() {
		if (log.enable)
			console.log.apply(console, arguments);
	};
	log.enable = true;
	// ---------------------------------------------------------------------------
	context.mods = {
		root : 'js/libs', // todo change
		baseTime : 'seconds'
	}
	context.mods.create = _create;
	context.mods.require = _require;
	// context.mods.config = _config ;
	// ---------------------------------------------------------------------------
	var modules = [], requireCounter = 0, currentPosition, limbo = [], pendingPack = [];

	function _require(libs, callback) {
		log('require module', libs);
		modules[requireCounter] = new Array(libs.length);
		_append(_pack(libs, callback, requireCounter));
		requireCounter++;
	}
	function _create(module) {
		log('create module', module, 'in position:', currentPosition);
		if (limbo[requireCounter] == undefined) {
			limbo[requireCounter] = [];
		}
		limbo[requireCounter].push(module);
	}

	function _pack(libs, callback, requireCounter) {
		return {
			libs : libs,
			counter : 0,
			callback : callback,
			id : requireCounter
		};
	}

	function _append(pack) {
		var max = pack.libs.length;
		for ( var i in pack.libs) {
			var script = document.createElement('script');
			script.src = context.mods.root + '/' + pack.libs[i] + '.js';
			script.position = i;
			log('append', script.src);
			script.onload = function(e) {
				pack.counter++;
				var position = e.srcElement.position;
				log(e.srcElement, 'is loaded', 'position:',
						e.srcElement.position, pack.counter, max);
				_update(pack, position);
			}
			document.head.appendChild(script);
		}
	}

	function _update(pack, position) {
		currentPosition = position;
		log('module in position', position, 'is loaded', '->',
				pack.libs[position]);
		modules[pack.id][position] = limbo.pop();

		if (pack.counter == pack.libs.length) {
			log('all libs are loaded', pack.libs, 'ID :', pack.id);
			/*
			 * for(var i = 0 ; i < pack.libs.length ; i++){ var module =
			 * modules[pack.id][i] ; for(var m in module){
			 * log('*****',module[m]); } }
			 */

			pendingPack.push(pack);
			log(pendingPack);

			if (pack.id == requireCounter - 1) {
				_execPending();
			}
		}
	}

	function _execPending() {
		log('call pending...');
		if (pendingPack.length > 0) {
			for ( var p = pendingPack.length - 1; p >= 0; p--) {
				var pack = pendingPack[p];
				log('for pack:', pack);
				var args = [], vars = '';
				
				for ( var i = 0; i < pack.libs.length; i++) {
					var module = modules[pack.id][i];
					for ( var m in module) {
						log('*****', module[m]);
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

})(mods_context);
