define(["PAWAAll","underscore","text!demoTemplate/indexTemplate.html"],function(e,t,n){return e.PAWAView.extend({tagName:"div",init:function(e){console.log("indexView init."),this.render(e)},render:function(e){var i=t.template(n);this.$el.html(i())}})});
//# sourceMappingURL=indexView.js.map
