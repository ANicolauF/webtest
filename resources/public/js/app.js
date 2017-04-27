/*global require, alert, document, window, requirejs, console*/
require.config({
    baseUrl: 'js/',
    waitSeconds: 5,
    paths: {
        jquery: '../lib/jquery.min'
    },
    shim: {
    }
});

require(['jquery'], function ($) {
    "use strict";
    var sessionToken;
    function makeRequest(method, url, data, onSuccess, onError) {
        var headers = sessionToken ? {
            "Authorization": "Token " + sessionToken,
            "x-session": sessionToken
        } : {};

        $.ajax({
            type: method,
            url: url,
            dataType: 'json',
            headers: headers,
            data: data,
            contentType:"application/json; charset=utf-8",
            success: onSuccess,
            error: onError
        });
    }

    function saveUser (event) {
        var
        name = $('#name').val(),
        data = JSON.stringify({
            "name": name
        });
        makeRequest("POST", "/user", data,
                    function (result) {
                        console.info(result);
                    },
                    function (err) {
                        console.error(err);
                    });
    }

    $('#submeter').click(saveUser);
});

requirejs.onError = function (err) {
    'use strict';
    if (err.requireType === 'timeout') {
        window.alert("App loading is taking too long, will reload in 30 seconds");
        window.setTimeout(function () {
            window.location.reload();
        }, 30000);
    }
};
