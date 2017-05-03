/*global require, alert, document, window, requirejs, console*/
define(['jquery', 'dust', 'text!../templates/resultsTemplate.html'], function ($, Dust, resultsHtml) {
    "use strict";
    var sessionToken, module = {}, 
    compiled = Dust.compile(resultsHtml, 'resultsTemplate');
    Dust.loadSource(compiled);

    Dust.compiled

    module.init = function ($content, queryResults) {
        
        Dust.render("resultsTemplate", queryResults, function(err, out) {
            $content.append(out);          
           
        });
        
    }

    return module;
});