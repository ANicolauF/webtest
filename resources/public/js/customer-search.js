/*global require, alert, document, window, requirejs, console*/
define(['jquery', 'dust', 'text!../templates/customerSearch.html', 'text!../templates/resultsTemplate.html'], function ($, Dust, customerSearchHtml, resultsHtml) {
    "use strict";
    var sessionToken, module = {},
    compiled = Dust.compile(customerSearchHtml, 'customerSearch'),
    compile2 = Dust.compile(resultsHtml, 'resultsTemplate');

    Dust.register('customerSearch', compiled);    
    //Dust.loadSource(compiled2);
    

    module.init = function ($content, onFinalize) {
        var $resultTable = $('#result-table');

        Dust.render("customerSearch", {}, function(err, out) {
            $content.append(out); 

            $('#search-btn').click (function () {
                var queryResult = {
                    customers:[{name: "javier"}]
                };

                Dust.render("resultsTemplate", queryResult, function(err, out) {
                    $resultTable.append(out);          
           
                 });                
            });
            $('#close-btn').click (function () {
                onFinalize();
            });
        });
        
    }

    return module;
});