define(["PAWA","backbone"],function(t,i){var n=t.PAWAController=function(t){this.initialize.apply(this,arguments)};return _.extend(n.prototype,i.Events,{initialize:function(i){var n=this.actions;if(n){var e=t.router,r=[],o=null,s=this.module+"/"+this.name;for(var a in n)r.unshift([a,this[n[a]]]);for(var h=0,l=r.length;h<l;h++)o=r[h],e.route(s+(""===o[0]?"":"/"+o[0]),"",_.bind(o[1],this))}this.__recordLog__(),this.init.apply(this,arguments)},module:"",name:"",actions:null,init:function(t){},destroy:function(){var i=this.actions;if(i){var n=t.router,e=t.history.handlers,r=null,o=this.module+"/"+this.name+"/";for(var s in i)for(var a=n._routeToRegExp(o+s).toString(),h=0,l=e.length;h<l;h++)if(r=e[h],r.route.toString()==a){e.splice(h,1);break}}}}),n.extend=function(i,n){var e=t.PAWAModel.extend.call(this,i,n);return e.getInstance=function(t){return this._instance||(this._instance=new this(t)),this._instance},e},n});
//# sourceMappingURL=PAWAController.js.map