define([
    'PAWAAll'
], function (PAWA) {
    return PAWA.PAWAView.extend({
        el: 'body',
        init: function (opts) {
            console.log("wrapView init...");
        },
        setBody: function(View, Opts){
            var bodyView = new View(Opts);
            this.$el.html(bodyView.el);
        }
    });
});