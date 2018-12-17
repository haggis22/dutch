(function (app) {

    "use strict";

    app.factory('dutch.viewService', [ 'dutch.constants',

        function (constants) {

            let view =
                {
                    justStarted: true,

                    // keep an incrementing question number - whenever this changes, then we know we need to prompt the user to answer
                    wordCount: 0,

                    mode: constants.MODES.ALL,
                    modeOptions: Object.keys(constants.MODES).map(m => constants.MODES[m]),

                    tense: constants.TENSES.PRESENT,
                    tenseOptions: Object.keys(constants.TENSES).map(t => constants.TENSES[t]),

                    setWord: setWord

                };

            return view;


            function setWord(word)
            {
                this.word = word;
                this.wordCount++;
            }

        }

    ]);

})(angular.module('DutchApp'));