(function(){
	var modules = {};
	var initializedModules = {};

	window.require = function require(o,u){
		if(!initializedModules[o]){
			if(!modules[o]){
				//var a=typeof require=="function"&&require;
				//if(!u&&a)return a(o,!0);
				//if(i)return i(o,!0);
				var f=new Error("Cannot find module '"+o+"'");
				throw f.code="MODULE_NOT_FOUND",f
			}
			var l=initializedModules[o]={exports:{}};
			modules[o][0].call(l.exports,function(e){
				var n=modules[o][1][e];
				return require(n?n:e);
			},l,l.exports);
			//},l,l.exports,e,t,n,r);
		}
		return initializedModules[o].exports;
	};
	window.loadBundle = function e(t,n,r){
		for(var property in t) {
			if(!modules[property])
				modules[property] = t[property];
		}
		if(!window.loadBundle.dispatch) {
			for(var o=0;o<r.length;o++)
				require(r[o]);
		} else {
			document.dispatchEvent(new CustomEvent('loaded', { detail: { run: r }}));
		}
	};
	window.loadBundle.dispatch = false;

})();
