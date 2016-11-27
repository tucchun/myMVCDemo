define([
    'PAWAAll',
    'underscore',
    'text!demoTemplate/applyInfoTemplate.html'
], function (PAWA, _, ApplyInfoTemplate) {
    return PAWA.PAWAView.extend({
        tagName: "div",
        init: function (opts) {
            console.log("applyInfoView.js init.");
            this.render(opts);
        },
        render: function(opts){
            var tmp = _.template(ApplyInfoTemplate);
            this.$el.html(tmp());
        }
    });
});