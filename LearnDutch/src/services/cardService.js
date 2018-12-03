(function (app) {

    "use strict";

    app.factory('dutch.cardService', [ 'dutch.constants', 'dutch.viewService', 'dutch.dictionaryService',

        function (constants, viewService, dictionaryService) {

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
                    // give me extra work on ones I have missed already
                    // If numWrong == numRight, then it will get added once
                    // If numWrong = 1 and numRight = 0, then it will get added 3 times
                    for (let count = 0; count <= 2 * (word.numWrong - word.numRight); count++)
                    {
                        options.push(word);
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
                    viewService.word.numRight++;

                }
                else {

                    answer.isWrong = true;
                    viewService.word.numWrong++;

                }

                answer.score = viewService.word.numRight - viewService.word.numWrong;

                viewService.answer = answer;

            }  // checkAnswer


        }

    ]);


})(angular.module('DutchApp'));