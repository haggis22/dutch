(function (app) {

    "use strict";

    app.factory('dutch.cardService', [ 'dutch.constants', 'dutch.viewService', 'dutch.dictionaryService', 'dutch.scoreService',

        function (constants, viewService, dictionaryService, scoreService) {

            let service =
            {
                testMe: testMe,
                checkAnswer: checkAnswer
            };

            return service;


            function testMe() {

                // Clear any guesses and the previous answer, if any
                viewService.guess = viewService.answer = null;

                viewService.noWords = false;

                viewService.justStarted = false;

                let words = dictionaryService.getWords(viewService.mode, viewService.tense);

                let options = [];

                for (let word of words)
                {
                    let scoreToday = scoreService.getScore({ period: constants.PERIODS.TODAY, mode: viewService.mode, tense: viewService.tense, word: word });

                    if (scoreToday)
                    {
                        // give me extra work on ones I have missed already
                        // If numRight > numWrong then it won't get added at all
                        // If numWrong == numRight, then it will get added once
                        // If numWrong = 1 and numRight = 0, then it will get added 3 times
                        for (let count = 0; count <= 2 * (scoreToday.numWrong - scoreToday.numRight); count++) {
                            options.push(word);
                        }

                    }
                    else
                    {
                        // we haven't seen it yet today
                        options.push(word);
                    }

                    let scoreAllTime = scoreService.getScore({ period: constants.PERIODS.ALLTIME, mode: viewService.mode, tense: viewService.tense, word: word });

                    if (scoreAllTime) {

                        // give me extra work on ones I have missed in the past
                        for (let count = 0; count < Math.floor(scoreAllTime.numWrong / 3); count++) {
                            options.push(word);
                        }

                    }


                }

                let lessonID = parseInt(viewService.lessonID, 10);
                if (!isNaN(lessonID))
                {
                    options = options.filter(o => o.lessonID == lessonID);
                }

                if (options.length == 0) {
                    viewService.noWords = true;
                    return;
                }

                let ix = Math.floor(Math.random() * options.length);

                let word = options[ix];

                switch (viewService.mode) {

                    case constants.MODES.VERBS:

                        switch (viewService.tense)
                        {
                            case constants.TENSES.SIMPLE_PAST:
                                word.correctAnswers = word.simplePast;
                                break;

                            case constants.TENSES.PAST_PERFECT:
                                word.correctAnswers = word.pastPerfect;
                                break;

                            case constants.TENSES.PRESENT:
                                word.correctAnswers = word.dutch;
                                break;

                        }  // tense switch

                        break;


                    default:
                        word.correctAnswers = word.dutch;
                        break;

                }

                viewService.word = word;


            }  // testMe


            function checkAnswer() {

                if (!viewService.guess || !viewService.guess.trim()) 
                {
                    // nothing to check
                    return;
                }

                let myAnswer = viewService.guess.trim();

                let answer =
                    {
                        word: viewService.word.correctAnswers.join(","),
                        score: 0
                    };

                if (viewService.word.correctAnswers.find(a => a == myAnswer)) {

                    answer.isCorrect = true;
                    scoreService.markCorrect(viewService.word, viewService.mode, viewService.tense);

                }
                else {

                    answer.isWrong = true;
                    scoreService.markWrong(viewService.word, viewService.mode, viewService.tense);

                }

                answer.scoreToday = scoreService.getScore({ period: constants.PERIODS.TODAY, mode: viewService.mode, tense: viewService.tense, word: viewService.word });
                answer.scoreAllTime = scoreService.getScore({ period: constants.PERIODS.ALLTIME, mode: viewService.mode, tense: viewService.tense, word: viewService.word });

                viewService.answer = answer;

            }  // checkAnswer


        }

    ]);


})(angular.module('DutchApp'));