/*global require, alert, document, window, requirejs, console*/
define(['jquery', 'dust', 'text!../templates/customerAbm.html'], function ($, Dust, customerAbmHtml) {
    "use strict";
    var sessionToken, module = {}, 
    compiled = Dust.compile(customerAbmHtml, 'customerAbm');
    Dust.loadSource(compiled);

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
        birthDate = $('#birthdate').val(),
        birthLocal = $('#birthlocal').val(),
        city = $('#city').val(),
        country = $('#country').val(),
        address = $('#address').val(),
        data = JSON.stringify({
            "name": name,
            "birthdate": birthDate,
            "birthplace": birthLocal,
            "city": city,
            "country": country,
            "address": address
        });
        makeRequest("POST", "/user", data,
                    function (result) {
                        console.info(result);
                    },
                    function (err) {
                        console.error(err);
                    });
    }

    module.init = function ($content, onFinalize) {
        var user = {
            name: "Javier",
            email: "javierdallamore@gmail.com"
        };
        Dust.render("customerAbm", user, function(err, out) {
            $content.append(out);
            $('#submit').click (function () {
                saveUser();
                onFinalize();
            });
        });
        
    }

    return module;
});
