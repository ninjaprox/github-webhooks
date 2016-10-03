'use strict';

/*global angular*/
(function() {
    var app = angular.module('github-webhooks', []);

    app.run(["$rootScope", function($rootScope) {
        $rootScope.$on("$locationChangeSuccess", function() {
            console.log("$locationChangeSuccess");
        });
    }]);
})();