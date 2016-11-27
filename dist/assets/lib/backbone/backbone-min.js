!function(t,e){"undefined"!=typeof exports?e(t,exports,require("underscore")):"function"==typeof define&&define.amd?define(["underscore","jquery","exports"],function(i,s,n){t.Backbone=e(t,n,i,s)}):t.Backbone=e(t,{},t._,t.jQuery||t.Zepto||t.ender)}(this,function(t,e,i,s){var n=t.Backbone,r=Array.prototype.slice,o=Array.prototype.splice;e.VERSION="0.9.2",e.setDomLibrary=function(t){s=t},e.noConflict=function(){return t.Backbone=n,e},e.emulateHTTP=!1,e.emulateJSON=!1;var a=/\s+/,h=e.Events={on:function(t,e,i){var s,n,r,o,h;if(!e)return this;for(t=t.split(a),s=this._callbacks||(this._callbacks={});n=t.shift();)r=(h=s[n])?h.tail:{},r.next=o={},r.context=i,r.callback=e,s[n]={tail:o,next:h?h.next:r};return this},off:function(t,e,s){var n,r,o,h,c,u;if(r=this._callbacks){if(!t&&!e&&!s)return delete this._callbacks,this;for(t=t?t.split(a):i.keys(r);n=t.shift();)if(o=r[n],delete r[n],o&&(e||s))for(h=o.tail;(o=o.next)!==h;)c=o.callback,u=o.context,(e&&c!==e||s&&u!==s)&&this.on(n,c,u);return this}},trigger:function(t){var e,i,s,n,o,h;if(!(s=this._callbacks))return this;for(o=s.all,t=t.split(a),h=r.call(arguments,1);e=t.shift();){if(i=s[e])for(n=i.tail;(i=i.next)!==n;)i.callback.apply(i.context||this,h);if(i=o)for(n=i.tail,e=[e].concat(h);(i=i.next)!==n;)i.callback.apply(i.context||this,e)}return this}};h.bind=h.on,h.unbind=h.off;var c=e.Model=function(t,e){var s;t||(t={}),e&&e.parse&&(t=this.parse(t)),(s=k(this,"defaults"))&&(t=i.extend({},s,t)),e&&e.collection&&(this.collection=e.collection),this.attributes={},this._escapedAttributes={},this.cid=i.uniqueId("c"),this.changed={},this._silent={},this._pending={},this.set(t,{silent:!0}),this.changed={},this._silent={},this._pending={},this._previousAttributes=i.clone(this.attributes),this.initialize.apply(this,arguments)};i.extend(c.prototype,h,{changed:null,_silent:null,_pending:null,idAttribute:"id",initialize:function(){},toJSON:function(){return i.clone(this.attributes)},get:function(t){return this.attributes[t]},escape:function(t){var e;return(e=this._escapedAttributes[t])?e:(e=this.get(t),this._escapedAttributes[t]=i.escape(null==e?"":""+e))},has:function(t){return null!=this.get(t)},set:function(t,e,s){var n,r;if(i.isObject(t)||null==t?(n=t,s=e):(n={},n[t]=e),s||(s={}),!n)return this;if(n instanceof c&&(n=n.attributes),s.unset)for(r in n)n[r]=void 0;if(!this._validate(n,s))return!1;this.idAttribute in n&&(this.id=n[this.idAttribute]);var e=s.changes={},o=this.attributes,a=this._escapedAttributes,h=this._previousAttributes||{};for(r in n)t=n[r],(!i.isEqual(o[r],t)||s.unset&&i.has(o,r))&&(delete a[r],(s.silent?this._silent:e)[r]=!0),s.unset?delete o[r]:o[r]=t,i.isEqual(h[r],t)&&i.has(o,r)==i.has(h,r)?(delete this.changed[r],delete this._pending[r]):(this.changed[r]=t,s.silent||(this._pending[r]=!0));return s.silent||this.change(s),this},unset:function(t,e){return(e||(e={})).unset=!0,this.set(t,null,e)},clear:function(t){return(t||(t={})).unset=!0,this.set(i.clone(this.attributes),t)},fetch:function(t){var t=t?i.clone(t):{},s=this,n=t.success;return t.success=function(e,i,r){return!!s.set(s.parse(e,r),t)&&void(n&&n(s,e))},t.error=e.wrapError(t.error,s,t),(this.sync||e.sync).call(this,"read",this,t)},save:function(t,s,n){var r,o;if(i.isObject(t)||null==t?(r=t,n=s):(r={},r[t]=s),n=n?i.clone(n):{},n.wait){if(!this._validate(r,n))return!1;o=i.clone(this.attributes)}if(t=i.extend({},n,{silent:!0}),r&&!this.set(r,n.wait?t:n))return!1;var a=this,h=n.success;return n.success=function(t,e,s){return e=a.parse(t,s),n.wait&&(delete n.wait,e=i.extend(r||{},e)),!!a.set(e,n)&&void(h?h(a,t):a.trigger("sync",a,t,n))},n.error=e.wrapError(n.error,a,n),s=this.isNew()?"create":"update",s=(this.sync||e.sync).call(this,s,this,n),n.wait&&this.set(o,t),s},destroy:function(t){var t=t?i.clone(t):{},s=this,n=t.success,r=function(){s.trigger("destroy",s,s.collection,t)};if(this.isNew())return r(),!1;t.success=function(e){t.wait&&r(),n?n(s,e):s.trigger("sync",s,e,t)},t.error=e.wrapError(t.error,s,t);var o=(this.sync||e.sync).call(this,"delete",this,t);return t.wait||r(),o},url:function(){var t=k(this,"urlRoot")||k(this.collection,"url")||S();return this.isNew()?t:t+("/"==t.charAt(t.length-1)?"":"/")+encodeURIComponent(this.id)},parse:function(t){return t},clone:function(){return new this.constructor(this.attributes)},isNew:function(){return null==this.id},change:function(t){t||(t={});var e=this._changing;this._changing=!0;for(var s in this._silent)this._pending[s]=!0;var n=i.extend({},t.changes,this._silent);this._silent={};for(s in n)this.trigger("change:"+s,this,this.get(s),t);if(e)return this;for(;!i.isEmpty(this._pending);){this._pending={},this.trigger("change",this,t);for(s in this.changed)!this._pending[s]&&!this._silent[s]&&delete this.changed[s];this._previousAttributes=i.clone(this.attributes)}return this._changing=!1,this},hasChanged:function(t){return arguments.length?i.has(this.changed,t):!i.isEmpty(this.changed)},changedAttributes:function(t){if(!t)return!!this.hasChanged()&&i.clone(this.changed);var e,s,n=!1,r=this._previousAttributes;for(s in t)i.isEqual(r[s],e=t[s])||((n||(n={}))[s]=e);return n},previous:function(t){return arguments.length&&this._previousAttributes?this._previousAttributes[t]:null},previousAttributes:function(){return i.clone(this._previousAttributes)},isValid:function(){return!this.validate(this.attributes)},_validate:function(t,e){if(e.silent||!this.validate)return!0;var t=i.extend({},this.attributes,t),s=this.validate(t,e);return!s||(e&&e.error?e.error(this,s,e):this.trigger("error",this,s,e),!1)}});var u=e.Collection=function(t,e){e||(e={}),e.model&&(this.model=e.model),e.comparator&&(this.comparator=e.comparator),this._reset(),this.initialize.apply(this,arguments),t&&this.reset(t,{silent:!0,parse:e.parse})};i.extend(u.prototype,h,{model:c,initialize:function(){},toJSON:function(t){return this.map(function(e){return e.toJSON(t)})},add:function(t,e){var s,n,r,a,h,c={},u={},l=[];for(e||(e={}),t=i.isArray(t)?t.slice():[t],s=0,n=t.length;s<n;s++){if(!(r=t[s]=this._prepareModel(t[s],e)))throw Error("Can't add an invalid model to a collection");a=r.cid,h=r.id,c[a]||this._byCid[a]||null!=h&&(u[h]||this._byId[h])?l.push(s):c[a]=u[h]=r}for(s=l.length;s--;)t.splice(l[s],1);for(s=0,n=t.length;s<n;s++)(r=t[s]).on("all",this._onModelEvent,this),this._byCid[r.cid]=r,null!=r.id&&(this._byId[r.id]=r);if(this.length+=n,o.apply(this.models,[null!=e.at?e.at:this.models.length,0].concat(t)),this.comparator&&this.sort({silent:!0}),e.silent)return this;for(s=0,n=this.models.length;s<n;s++)c[(r=this.models[s]).cid]&&(e.index=s,r.trigger("add",r,this,e));return this},remove:function(t,e){var s,n,r,o;for(e||(e={}),t=i.isArray(t)?t.slice():[t],s=0,n=t.length;s<n;s++)(o=this.getByCid(t[s])||this.get(t[s]))&&(delete this._byId[o.id],delete this._byCid[o.cid],r=this.indexOf(o),this.models.splice(r,1),this.length--,e.silent||(e.index=r,o.trigger("remove",o,this,e)),this._removeReference(o));return this},push:function(t,e){return t=this._prepareModel(t,e),this.add(t,e),t},pop:function(t){var e=this.at(this.length-1);return this.remove(e,t),e},unshift:function(t,e){return t=this._prepareModel(t,e),this.add(t,i.extend({at:0},e)),t},shift:function(t){var e=this.at(0);return this.remove(e,t),e},get:function(t){return null==t?void 0:this._byId[null!=t.id?t.id:t]},getByCid:function(t){return t&&this._byCid[t.cid||t]},at:function(t){return this.models[t]},where:function(t){return i.isEmpty(t)?[]:this.filter(function(e){for(var i in t)if(t[i]!==e.get(i))return!1;return!0})},sort:function(t){if(t||(t={}),!this.comparator)throw Error("Cannot sort a set without a comparator");var e=i.bind(this.comparator,this);return 1==this.comparator.length?this.models=this.sortBy(e):this.models.sort(e),t.silent||this.trigger("reset",this,t),this},pluck:function(t){return i.map(this.models,function(e){return e.get(t)})},reset:function(t,e){t||(t=[]),e||(e={});for(var s=0,n=this.models.length;s<n;s++)this._removeReference(this.models[s]);return this._reset(),this.add(t,i.extend({silent:!0},e)),e.silent||this.trigger("reset",this,e),this},fetch:function(t){t=t?i.clone(t):{},void 0===t.parse&&(t.parse=!0);var s=this,n=t.success;return t.success=function(e,i,r){s[t.add?"add":"reset"](s.parse(e,r),t),n&&n(s,e)},t.error=e.wrapError(t.error,s,t),(this.sync||e.sync).call(this,"read",this,t)},create:function(t,e){var s=this,e=e?i.clone(e):{},t=this._prepareModel(t,e);if(!t)return!1;e.wait||s.add(t,e);var n=e.success;return e.success=function(i,r){e.wait&&s.add(i,e),n?n(i,r):i.trigger("sync",t,r,e)},t.save(null,e),t},parse:function(t){return t},chain:function(){return i(this.models).chain()},_reset:function(){this.length=0,this.models=[],this._byId={},this._byCid={}},_prepareModel:function(t,e){if(e||(e={}),t instanceof c)t.collection||(t.collection=this);else{e.collection=this,t=new this.model(t,e),t._validate(t.attributes,e)||(t=!1)}return t},_removeReference:function(t){this==t.collection&&delete t.collection,t.off("all",this._onModelEvent,this)},_onModelEvent:function(t,e,i,s){("add"==t||"remove"==t)&&i!=this||("destroy"==t&&this.remove(e,s),e&&t==="change:"+e.idAttribute&&(delete this._byId[e.previous(e.idAttribute)],this._byId[e.id]=e),this.trigger.apply(this,arguments))}}),i.each("forEach,each,map,reduce,reduceRight,find,detect,filter,select,reject,every,all,some,any,include,contains,invoke,max,min,sortBy,sortedIndex,toArray,size,first,initial,rest,last,without,indexOf,shuffle,lastIndexOf,isEmpty,groupBy".split(","),function(t){u.prototype[t]=function(){return i[t].apply(i,[this.models].concat(i.toArray(arguments)))}});var l=e.Router=function(t){t||(t={}),t.routes&&(this.routes=t.routes),this._bindRoutes(),this.initialize.apply(this,arguments)},d=/:\w+/g,f=/\*\w+/g,p=/[-[\]{}()+?.,\\^$|#\s]/g;i.extend(l.prototype,h,{initialize:function(){},route:function(t,s,n){return e.history||(e.history=new g),i.isRegExp(t)||(t=this._routeToRegExp(t)),n||(n=this[s]),e.history.route(t,i.bind(function(i){i=this._extractParameters(t,i),n&&n.apply(this,i),this.trigger.apply(this,["route:"+s].concat(i)),e.history.trigger("route",this,s,i)},this)),this},navigate:function(t,i){e.history.navigate(t,i)},_bindRoutes:function(){if(this.routes){var t,e=[];for(t in this.routes)e.unshift([t,this.routes[t]]);t=0;for(var i=e.length;t<i;t++)this.route(e[t][0],e[t][1],this[e[t][1]])}},_routeToRegExp:function(t){return t=t.replace(p,"\\$&").replace(d,"([^/]+)").replace(f,"(.*?)"),RegExp("^"+t+"$")},_extractParameters:function(t,e){return t.exec(e).slice(1)}});var g=e.History=function(){this.handlers=[],i.bindAll(this,"checkUrl")},v=/^[#\/]/,m=/msie [\w.]+/;g.started=!1,i.extend(g.prototype,h,{interval:50,getHash:function(t){return(t=(t?t.location:window.location).href.match(/#(.*)$/))?t[1]:""},getFragment:function(t,e){if(null==t)if(this._hasPushState||e){var t=window.location.pathname,i=window.location.search;i&&(t+=i)}else t=this.getHash();return t.indexOf(this.options.root)||(t=t.substr(this.options.root.length)),t.replace(v,"")},start:function(t){if(g.started)throw Error("Backbone.history has already been started");g.started=!0,this.options=i.extend({},{root:"/"},this.options,t),this._wantsHashChange=this.options.hashChange!==!1,this._wantsPushState=!!this.options.pushState,this._hasPushState=!(!this.options.pushState||!window.history||!window.history.pushState);var t=this.getFragment(),e=document.documentMode;return(e=m.exec(navigator.userAgent.toLowerCase())&&(!e||e<=7))&&(this.iframe=s('<iframe src="javascript:0" tabindex="-1" />').hide().appendTo("body")[0].contentWindow,this.navigate(t)),this._hasPushState?s(window).bind("popstate",this.checkUrl):this._wantsHashChange&&"onhashchange"in window&&!e?s(window).bind("hashchange",this.checkUrl):this._wantsHashChange&&(this._checkUrlInterval=setInterval(this.checkUrl,this.interval)),this.fragment=t,t=window.location,e=t.pathname==this.options.root,this._wantsHashChange&&this._wantsPushState&&!this._hasPushState&&!e?(this.fragment=this.getFragment(null,!0),window.location.replace(this.options.root+"#"+this.fragment),!0):(this._wantsPushState&&this._hasPushState&&e&&t.hash&&(this.fragment=this.getHash().replace(v,""),window.history.replaceState({},document.title,t.protocol+"//"+t.host+this.options.root+this.fragment)),this.options.silent?void 0:this.loadUrl())},stop:function(){s(window).unbind("popstate",this.checkUrl).unbind("hashchange",this.checkUrl),clearInterval(this._checkUrlInterval),g.started=!1},route:function(t,e){this.handlers.unshift({route:t,callback:e})},checkUrl:function(){var t=this.getFragment();return t==this.fragment&&this.iframe&&(t=this.getFragment(this.getHash(this.iframe))),t!=this.fragment&&(this.iframe&&this.navigate(t),void(this.loadUrl()||this.loadUrl(this.getHash())))},loadUrl:function(t){var e=this.fragment=this.getFragment(t);return i.any(this.handlers,function(t){if(t.route.test(e))return t.callback(e),!0})},navigate:function(t,e){if(!g.started)return!1;e&&e!==!0||(e={trigger:e});var i=(t||"").replace(v,"");this.fragment!=i&&(this._hasPushState?(0!=i.indexOf(this.options.root)&&(i=this.options.root+i),this.fragment=i,window.history[e.replace?"replaceState":"pushState"]({},document.title,i)):this._wantsHashChange?(this.fragment=i,this._updateHash(window.location,i,e.replace),this.iframe&&i!=this.getFragment(this.getHash(this.iframe))&&(e.replace||this.iframe.document.open().close(),this._updateHash(this.iframe.location,i,e.replace))):window.location.assign(this.options.root+t),e.trigger&&this.loadUrl(t))},_updateHash:function(t,e,i){i?t.replace(t.toString().replace(/(javascript:|#).*$/,"")+"#"+e):t.hash=e}});var _=e.View=function(t){this.cid=i.uniqueId("view"),this._configure(t||{}),this._ensureElement(),this.initialize.apply(this,arguments),this.delegateEvents()},y=/^(\S+)\s*(.*)$/,b="model,collection,el,id,attributes,className,tagName".split(",");i.extend(_.prototype,h,{tagName:"div",$:function(t){return this.$el.find(t)},initialize:function(){},render:function(){return this},remove:function(){return this.$el.remove(),this},make:function(t,e,i){return t=document.createElement(t),e&&s(t).attr(e),null!=i&&s(t).html(i),t},setElement:function(t,e){return this.$el&&this.undelegateEvents(),this.$el=t instanceof s?t:s(t),this.el=this.$el[0],e!==!1&&this.delegateEvents(),this},delegateEvents:function(t){if(t||(t=k(this,"events"))){this.undelegateEvents();for(var e in t){var s=t[e];if(i.isFunction(s)||(s=this[t[e]]),!s)throw Error('Method "'+t[e]+'" does not exist');var n=e.match(y),r=n[1],n=n[2],s=i.bind(s,this);r+=".delegateEvents"+this.cid,""===n?this.$el.bind(r,s):this.$el.delegate(n,r,s)}}},undelegateEvents:function(){this.$el.unbind(".delegateEvents"+this.cid)},_configure:function(t){this.options&&(t=i.extend({},this.options,t));for(var e=0,s=b.length;e<s;e++){var n=b[e];t[n]&&(this[n]=t[n])}this.options=t},_ensureElement:function(){if(this.el)this.setElement(this.el,!1);else{var t=k(this,"attributes")||{};this.id&&(t.id=this.id),this.className&&(t.class=this.className),this.setElement(this.make(this.tagName,t),!1)}}}),c.extend=u.extend=l.extend=_.extend=function(t,e){var i=E(this,t,e);return i.extend=this.extend,i};var w={create:"POST",update:"PUT",delete:"DELETE",read:"GET"};e.sync=function(t,n,r){var o=w[t];r||(r={});var a={type:o,dataType:"json"};return r.url||(a.url=k(n,"url")||S()),r.data||!n||"create"!=t&&"update"!=t||(a.contentType="application/json",a.data=JSON.stringify(n.toJSON())),e.emulateJSON&&(a.contentType="application/x-www-form-urlencoded",a.data=a.data?{model:a.data}:{}),!e.emulateHTTP||"PUT"!==o&&"DELETE"!==o||(e.emulateJSON&&(a.data._method=o),a.type="POST",a.beforeSend=function(t){t.setRequestHeader("X-HTTP-Method-Override",o)}),"GET"===a.type||e.emulateJSON||(a.processData=!1),s.ajax(i.extend(a,r))},e.wrapError=function(t,e,i){return function(s,n){n=s===e?n:s,t?t(e,n,i):e.trigger("error",e,n,i)}};var x=function(){},E=function(t,e,s){var n;return n=e&&e.hasOwnProperty("constructor")?e.constructor:function(){t.apply(this,arguments)},i.extend(n,t),x.prototype=t.prototype,n.prototype=new x,e&&i.extend(n.prototype,e),s&&i.extend(n,s),n.prototype.constructor=n,n.__super__=t.prototype,n},k=function(t,e){return t&&t[e]?i.isFunction(t[e])?t[e]():t[e]:null},S=function(){throw Error('A "url" property or function must be specified')};return e});
//# sourceMappingURL=backbone-min.js.map