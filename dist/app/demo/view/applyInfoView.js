define(["PAWAAll","underscore","text!demoTemplate/applyInfoTemplate.html"],function(e,t,n){return e.PAWAView.extend({tagName:"div",init:function(e){console.log("applyInfoView.js init."),this.render(e)},render:function(e){var i=t.template(n);this.$el.html(i())}})});
//# sourceMappingURL=applyInfoView.js.map
