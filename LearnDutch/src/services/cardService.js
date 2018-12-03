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


            function testMe(mode) {

                // Clear any guesses and the previous answer, if any
                viewService.guess = viewService.answer = null;

                viewService.justStarted = false;

                let words = dictionaryService.getWords(mode);

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
                    console.log('Out of words');
                    return;
                }

                let ix = Math.floor(Math.random() * options.length);

                viewService.word = options[ix];

                switch (mode) {

                    /*
                    case MODE.SIMPLE_PAST:
                        currentWord.correctAnswers = currentWord.simplePast.slice();
                        break;

                    case MODE.PAST_PERFECT:
                        currentWord.correctAnswers = [currentWord.pastPerfect];
                        break;
                    */

                    default:
                        viewService.word.correctAnswers = Array.isArray(viewService.word.dutch) ? viewService.word.dutch : [viewService.word.dutch];
                        break;

                }

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