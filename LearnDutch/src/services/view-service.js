(function (app) {

    "use strict";

    app.factory('dutch.viewService', [ 'dutch.constants',

        function (constants) {

            let view =
                {
                    justStarted: true,
                    mode: constants.MODES.ALL,
                    modeOptions: Object.keys(constants.MODES).map(m => constants.MODES[m]),

                    tense: constants.TENSES.PRESENT,
                    tenseOptions: Object.keys(constants.TENSES).map(t => constants.TENSES[t])

                };

            return view;


        }

    ]);

})(angular.module('DutchApp'));