define([
    'PAWAAll',
    'underscore',
    'text!demoTemplate/indexTemplate.html'
], function (PAWA, _, IndexTemplate) {
    return PAWA.PAWAView.extend({
        tagName: "div",
        init: function (opts) {
            console.log("indexView init.");
            this.render(opts);
        },
        render: function(opts){
            var tmp = _.template(IndexTemplate);
            this.$el.html(tmp());
        }
    });
});