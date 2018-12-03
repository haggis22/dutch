(function (app) {

    "use strict";

    app.directive('focusMe', ['$timeout', function ($timeout) {
        return {
            link: function (scope, element, attrs) {

                // this will trigger if ANY of the comma-separated values are true
                scope.$watchGroup(attrs.focusMe.split(','), function (valueArray) {

                    // if any element in the array evaluates to true, then focus
                    if (valueArray.some(v => v))
                    {
                        // the timeout will give any container time to appear
                        $timeout(function () {
                            element[0].focus();
                        }, 10);

                    }

                });
            }
        };

    }]);

})(angular.module('DutchApp'));

