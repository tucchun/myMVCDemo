require.config({
    baseUrl: "",
    shim: {
        jquery: {
            export: "jQuery"
        },
        underscore: {
            exports: "_"
        },
        backbone: {
            deps: ['text', 'jquery', 'underscore'],
            exports: 'Backbone'
        },
        'backbone.localStorage': {
            deps: ["backbone"],
            exports: "localStorage"
        }
    },
    paths: {
        text: '../../assets/lib/require/text-2.0.5',
        jquery: '../../assets/lib/jquery/jquery-1.9.1',
        underscore: '../../assets/lib/underscore/underscore-min',
        'backbone': '../../assets/lib/backbone/backbone-1.0',
        'backbone.localStorage': '../../assets/lib/backbone/backbone.localStorage',
        PAWA: '../../assets/lib/PAWA/PAWA',
        PAWAModel: '../../assets/lib/PAWA/PAWAModel',
        PAWACollection: '../../assets/lib/PAWA/PAWACollection',
        PAWAView: '../../assets/lib/PAWA/PAWAView',
        PAWARouter: '../../assets/lib/PAWA/PAWARouter',
        PAWAHistory: '../../assets/lib/PAWA/PAWAHistory',
        PAWAController: '../../assets/lib/PAWA/PAWAController',
        PAWARequest: '../../assets/lib/PAWA/PAWARequest',
        PAWAAll: '../../assets/lib/PAWA/PAWAAll',
        PAWALoggerAdapter: '../../assets/lib/PAWA/PAWALoggerAdapter'
    }
});
define(['PAWAAll', 'PAWALoggerAdapter'], function (PAWA) {
    "use strict";
    return function (main) {
        PAWA.init({
            isSPA: true,
            main: main
        });
    };
});