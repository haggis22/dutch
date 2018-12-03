(function (app) {

    "use strict";

    app.controller("DutchCtrl", ['$scope',
                                    'dutch.constants', 'dutch.cardService', 'dutch.viewService',

        function ($scope,
                    constants, cardService, viewService) {

            $scope.constants = constants;
            $scope.viewService = viewService;
            $scope.cardService = cardService;

            $scope.testMe = function () {

                cardService.testMe(viewService.mode.value);

            };


        }  // outer function

    ])

})(angular.module('DutchApp'));