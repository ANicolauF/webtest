/*global require, alert, document, window, requirejs, console*/
require.config({
    baseUrl: 'js/',
    waitSeconds: 5,
    paths: {
        jquery: '../lib/jquery.min',
        stripe: 'https://js.stripe.com/v1/?1',
        card: '../lib/card',
        jquerycard: '../lib/jquery.card'
    },
    shim: {
        stripe: {
            exports: 'Stripe'
        },
        card: {
            exports: 'card',
            deps: ['jquery']
        },
        jquerycard: {
            exports: 'jquerycard',
            deps: ['jquery', 'card']
        }
    }
});

require(['jquery', 'stripe', 'card'], function ($, Stripe, Card, Dust, plansHtml) {
    "use strict";
    var stripeCustomerId, sessionToken,
        cardPlastic,
        $cardNum = $('#card-num'),
        $cardFullName = $('#card-fullname'),
        $cardExpiry = $('#card-expiry'),
        $cardCVC = $('#card-cvc'),
        $userEmail = $('#user-email'),
        $userUsername= $('#user-username'),
        $userPassword = $('#user-password');

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

    function getUser () {
        var username = $userUsername.val();
        makeRequest("GET", "/user/" + username, null,
                    function (user) {
                        var plan = user.subscriptions[0].plan,
                        card = user.cards[0], expiry, cardNumber;
                        stripeCustomerId = user.id;
                        $('input[id=' + plan.id + ']')
                            .prop("checked", true);
                        if (card) {
                            expiry = card["expiration-month"] + "/" +
                                ("" + card["expiration-year"]).substring(2, 4);
                            cardNumber = "0000 0000 0000 " + card["last-4-digits"];
                            $cardNum.val(cardNumber);
                            $cardFullName.val(card.name);
                            $cardExpiry.val(expiry);
                            $cardCVC.val(card.cvc);
                        }
                        console.info(user);
                        cardPlastic = new Card({
                            form: $('.form-container').get(0),
                            container: '.card-wrapper',
                            placeholders: {
                                number: 'XXXX XXXX XXXX XXXX',
                                name: 'Full Name',
                                expiry: 'XX/XX',
                                cvc: 'XXX'
                            },
                        });


                    },
                    function (err) {
                        console.error(err);
                    });
    }

    Stripe.setPublishableKey('pk_test_QeaFAcQ50zhF6FPzWdiADuu1');

    $('#get-user').click(getUser);

    $('#log-in').click(function( event ) {
        var username = $userUsername.val(),
        password = $userPassword.val(),
        data = JSON.stringify({
            "username": username,
            "password" : password
        });

        makeRequest("POST", "/session", data,
            function (result) {
                sessionToken = result.token;
                $("#log-in-div").hide();
                $("#panel").show();
                getUser();
            },
            function (err) {
                console.error(err);
            });
    });


    $('#save-user').click(function( event ) {
        var email = $userEmail.val(),
        username = $userUsername.val(),
        password = $userPassword.val(),
        data = JSON.stringify({
            "username": username,
            "password" : password,
            "email": email
        });
        makeRequest("POST", "/user", data,
            function (result) {
                console.info(result);
            },
            function (err) {
                console.error(err);
            });
    });

    $('#save-card').click(function( event ) {
        event.preventDefault();
        var cardNum = $cardNum.val(),
        cardFullName = $cardFullName.val(),
        cardExpiry = $cardExpiry.val(),
        cardCVC = $cardCVC.val();

        var cardExpiryArray = cardExpiry.split("/");
        var cardMonth = cardExpiryArray[0];
        var cardYear = cardExpiryArray[1];

        Stripe.card.createToken({
            number: cardNum.trim(),
            exp_month: cardMonth.trim(),
            exp_year: cardYear.trim(),
            cvc: cardCVC.trim(),
            name: cardFullName.trim()
        }, function(status, response) {
            if (response.error) {
                return response.error.message;
            } else {
                var data = JSON.stringify({
                    "stripe-token": response.id,
                    "session-token" : sessionToken,
                    "stripe-customer-id": stripeCustomerId
                });

                makeRequest("POST", "/card", data,
                    function (result) {
                        console.info(result);
                    },
                    function (err) {
                        console.error(err);
                    });
            }
        });
        return false;
    });

    $('#delete-user').click(function( event ) {
        var username = $userUsername.val();
        event.preventDefault();
        var data = JSON.stringify({
            "stripe-customer-id": stripeCustomerId
        });

        makeRequest("DELETE", "/user/" + username, data,
            function (result) {
                console.info(result);
            },
            function (err) {
                console.error(err);
            });
        return false;
    });

    $('#update-plan').click(function( event ) {
        var plan = $('input[name=plan]:checked').val(),
        data = JSON.stringify({
            plan: plan
        });
        makeRequest("PUT", "/plan/" + stripeCustomerId, data,
            function (result) {
                console.info(result);
            },
            function (err) {
                console.error(err);
            });
    });
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
