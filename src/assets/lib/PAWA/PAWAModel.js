/**
 * 重载Backbone.Model
 */
define(['PAWA', 'backbone'], function(PAWA, Backbone) {
    var PAWAModel = PAWA.PAWAModel = Backbone.Model.extend({
        initialize : function(options) {
            this.init.apply(this, arguments);
            this.__recordLog__();
        },
        init : function(options) {
        
        }
    });

    // 用于存放应用中共享的模型对象
    PAWAModel.shareModels = {
        // @private
        _shareList : {},
        /**
         * 添加共享的模型
         */
        add : function(name, model) {
            PAWAModel.shareModels._shareList[name] = model;
        },
        /**
         * 获取共享的模型
         */
        get : function(name) {
            return PAWAModel.shareModels._shareList[name];
        },
        /**
         * 移除模型
         */
        remove : function(name) {
            var shareList = PAWAModel.shareModels._shareList;
            shareList[name] = null;
            delete shareList[name];
        }
    }

    return PAWAModel;
});
