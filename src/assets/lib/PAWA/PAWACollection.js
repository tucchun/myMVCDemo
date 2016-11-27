/**
 * 重载Backbone.Collection
 */
define(['PAWA', 'backbone'], function(PAWA, Backbone) {
    var PAWACollection = PAWA.PAWACollection = Backbone.Collection.extend({
        initialize : function(options) {
            this.init.apply(this, arguments);
            this.__recordLog__();
        },
        init : function(options) {
        }
    });

    return PAWACollection;
});
