require.config({
    paths: {
        demoController: "./controller",
        demoModel     : "./model",
        demoView      : "./view",
        demoTemplate  : "./template"
    }
});

require([
    '../../main',
    'demoController/applyController',
    'demoView/wrapView'
], function (main, ApplyController, WrapView) {
    "use strict";
    window.wrapView = new WrapView();

    PAWA.request.param("index", "demo/apply");
    main(function () {
        ApplyController.getInstance();
    });

});
