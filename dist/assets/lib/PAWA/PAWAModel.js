define(["PAWA","backbone"],function(e,i){var n=e.PAWAModel=i.Model.extend({initialize:function(e){this.init.apply(this,arguments),this.__recordLog__()},init:function(e){}});return n.shareModels={_shareList:{},add:function(e,i){n.shareModels._shareList[e]=i},get:function(e){return n.shareModels._shareList[e]},remove:function(e){var i=n.shareModels._shareList;i[e]=null,delete i[e]}},n});
//# sourceMappingURL=PAWAModel.js.map