(function (app) {

    "use strict";

    app.factory('dutch.scoreService', [ 'dutch.constants',

        function (constants) {

            const REGULAR = "regular";

            return {

                scores: loadScores(),
                markCorrect: markCorrect,
                markWrong: markWrong,
                getScore: getScore

            };

            function loadScores()
            {
                // it's stored as a string, so convert it back to a JavaScript object
                let savedScores = JSON.parse(localStorage.getItem(constants.STORAGE_KEY_SCORES));

                if (savedScores != null)
                {
                    delete savedScores[constants.PERIODS.TODAY];
                }
                else
                {
                    savedScores = {};

                }  // scores were not already saved

                return savedScores;

            }  // loadScores


            function saveScores()
            {

                // we need to stringify the JSON or it will just store "[Object object]"
                localStorage.setItem(constants.STORAGE_KEY_SCORES, JSON.stringify(this.scores));

            }  // saveScores


            function determineScoreSection(search)
            {
                if (search.mode == constants.MODES.VERBS)
                {
                    switch (search.tense) {
                        case constants.TENSES.SIMPLE_PAST:
                        case constants.TENSES.PAST_PERFECT:
                            return search.tense;
                    }
                }

                // we want to treat PRESENT tense verbs the same as any other words so that they would be grouped
                // together on a general quiz
                return REGULAR;
            }

            function findWordScore(search, forceCreate)
            {
                let section = determineScoreSection(search);

                if (!this.scores.hasOwnProperty(search.period))
                {
                    if (!forceCreate)
                    {
                        return null;
                    }

                    this.scores[search.period] = {};
                }

                if (!this.scores[search.period].hasOwnProperty(section)) {

                    if (!forceCreate)
                    {
                        return null;
                    }

                    this.scores[search.period][section] = {};
                }

                if (!this.scores[search.period][section].hasOwnProperty(search.word.english)) {

                    if (!forceCreate)
                    {
                        return null;
                    }

                    this.scores[search.period][section][search.word.english] =
                        {
                            numRight: 0,
                            numWrong: 0
                        };
                }

                return this.scores[search.period][section][search.word.english];
            }


            function markCorrect(word, mode, tense)
            {
                let todayScore = findWordScore.call(this, { period: constants.PERIODS.TODAY, word: word, mode: mode, tense: tense }, true);
                todayScore.numRight++;

                let allTimeScore = findWordScore.call(this, { period: constants.PERIODS.ALLTIME, word: word, mode: mode, tense: tense }, true);
                allTimeScore.numRight++;

                saveScores.call(this);

            }  // markCorrect


            function markWrong(word, mode, tense) {

                let todayScore = findWordScore.call(this, { period: constants.PERIODS.TODAY, word: word, mode: mode, tense: tense }, true);
                todayScore.numWrong++;

                let allTimeScore = findWordScore.call(this, { period: constants.PERIODS.ALLTIME, word: word, mode: mode, tense: tense }, true);
                allTimeScore.numWrong++;

                saveScores.call(this);

            }  // markWrong


            // search = object with keys period, mode, tense, word
            function getScore(search)
            {
                return findWordScore.call(this, search, false);

            }  // getScore

        }

    ]);

})(angular.module('DutchApp'));