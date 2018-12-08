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

                    let numInstances = 0;

                    if (scoreToday)
                    {
                        // give me extra work on ones I have missed already
                        // If numRight > numWrong then it won't get added at all
                        // If numWrong == numRight, then it will get added once
                        // If numWrong = 1 and numRight = 0, then it will get added 3 times
                        numInstances += Math.min(scoreToday.numWrong - scoreToday.numRight + 1, 0);

                    }
                    else
                    {
                        // we haven't seen it yet today, so add it once
                        numInstances++;

                    }

                    let scoreAllTime = scoreService.getScore({ period: constants.PERIODS.ALLTIME, mode: viewService.mode, tense: viewService.tense, word: word });

                    if (scoreAllTime) {

                        // give me extra work on ones I have missed in the past
                        numInstances += Math.floor(scoreAllTime.numWrong / 3);

                    }

                    if (viewService.onlyWrong) {

                        if (scoreAllTime && scoreAllTime.numWrong > scoreAllTime.numRight)
                        {
                            // allow the word
                        }
                        else
                        {
                            // I've never had this word, so skip it
                            numInstances = 0;
                        }

                    }


                    for (let i = 0; i < numInstances; i++)
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


            function muricafy(text) 
            {

                return text
                    .trim()
                    .toLowerCase()
                    .replace(/[\xe0\xe1\xe2\xe3\xe4\xe5]/g, "a")
                    .replace(/[\xe7]/g, "c")
                    .replace(/[\xe8\xe9\xea\xeb]/g, "e")
                    .replace(/[\xec\xed\xee\xef]/g, "i")
                    .replace(/[\xf2\xf3\xf4\xf5\xf6\xf7\xf8]/g, "o")
                    .replace(/[\xf9\xfa\xfb\xfc]/g, "u")
                    .replace(/[^a-z ]/g, "")                // Nothing but letters and spaces
                    .replace('/\s\s+/g', ' ');              // any time it finds more than one whitespace character, it turns them all into a single space

            }  // muricafy


            function checkAnswer() {

                if (!viewService.guess || !viewService.guess.trim()) 
                {
                    // nothing to check
                    return;
                }

                let myAnswer = muricafy(viewService.guess.trim().toLowerCase());

                let answer =
                    {
                        word: viewService.word.correctAnswers.join(","),
                        score: 0
                    };

                if (viewService.word.correctAnswers.find(a => muricafy(a) == myAnswer)) {

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