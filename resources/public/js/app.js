/*global require, alert, document, window, requirejs, console*/
require.config({
    baseUrl: 'js/',
    waitSeconds: 5,
    paths: {
        jquery: '../lib/jquery.min',
        dust: '../lib/dust',
        text: '../lib/text'
    },
    shim: {
        dust: {
            exports: 'dust'
        }
    }
});

require(['jquery', 'customer-abm', 'customer-search'], function ($, customerAbm, customerSearch) {
    "use strict";
    var $content = $('#content');
    
    function currentMode(mode) {
        if (mode === "main") {
            $('#initial-options').show();
            $content.html("");
        } else{
            $('#initial-options').hide();
        }
    }

    function onReturn() {
        currentMode("main");
    }

    function newUser (event) {
        currentMode("new-user");
        customerAbm.init($content, onReturn);
    }

    function search (event) {
        currentMode("search");
        customerSearch.init($content, onReturn);
    }

    $('#newuser').click(newUser);
    $('#search').click(search);

    currentMode('main');

});

requirejs.onError = function (err) {
    'use strict';
    if (err.requireType === 'timeout') {
        window.alert("App loading is taking too long, will reload in 30 seconds");
        window.setTimeout(function () {
            window.location.reload();
        }, 300);
    }
};
