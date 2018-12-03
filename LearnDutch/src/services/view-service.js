(function (app) {

    "use strict";

    app.factory('dutch.viewService', [ 'dutch.constants',

        function (constants) {

            let view =
                {
                    mode: constants.MODES.ALL,
                    modeOptions: []

                };

            for (let modeKey in constants.MODES)
            {
                view.modeOptions.push(constants.MODES[modeKey]);
            }


            return view;


        }

    ]);

})(angular.module('DutchApp'));