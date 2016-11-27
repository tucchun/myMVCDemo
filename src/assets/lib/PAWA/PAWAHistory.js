/**
 * 重载Backbone.History
 */
define(['PAWA', 'backbone'], function(PAWA, Backbone) {
    var PAWAHistory = PAWA.PAWAHistory = Backbone.History.extend({
        initialize : function(options) {
            this.init.apply(this, arguments);
        },
        init : function(options) {
        
        }
    });
    return PAWAHistory;
});
