define(['PAWAAll'], function(PAWA){
    return PAWA.PAWAController.extend({
        module: "demo",
        name: "apply",
        init: function(opts){
            console.log("applyController init.")

        },
        actions: {
            "": "doIndex",
            index: "doIndex",
            applyInfo: "applyInfo"
        },
        doIndex: function(){
            var self = this;
            require([
                'demoView/indexView',
                'demoModel/demoModel'
            ], function (IndexView, DemoModel) {
                wrapView.setBody(IndexView, {
                    model: new DemoModel(),
                    controller: self
                });
            });
        },
        applyInfo: function(){
            var self = this;
            require([
                'demoView/applyInfoView',
                'demoModel/demoModel'
            ], function (ApplyInfoView, DemoModel) {
                wrapView.setBody(ApplyInfoView, {
                    model: new DemoModel(),
                    controller: self
                });
            });
        },
    });
});