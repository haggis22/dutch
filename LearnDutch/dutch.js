(function () {

    "use strict";

    let app = angular.module('DutchApp', []);

})();

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
(function (app) {

    "use strict";

    app.directive('enterAction', [function () {
        return function (scope, element, attrs) {

            element.bind("keydown keypress", function (event) {

                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.enterAction);
                    });

                    event.preventDefault();
                }
            });
        };

    }]);

})(angular.module('DutchApp'));


(function (app) {

    "use strict";

    app.directive('focusMe', ['$timeout', function ($timeout) {
        return {
            link: function (scope, element, attrs) {
                scope.$watch(attrs.focusMe, function (value) {
                    if (value) {
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

                let words = dictionaryService.getWords(mode);

                let options = [];

/*
                let lessonID = parseInt($('#txtLessonID').val(), 10);
                if (!isNaN(lessonID)) {
                    options = options.filter(w => w.lessonID == lessonID);
                }
*/

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
(function (app) {

    "use strict";

    app.constant('dutch.constants', (function () {

        let constants =
            {
                PARTS:
                {
                    VERB: 'verb',
                    NOUN: 'noun',
                    ADJ: 'adjective'
                },


                MODES:
                {
                    ALL: { display: 'All', value: 'all' },
                    VERBS: { display: 'Verbs', value: 'verbs' },
                    NOUNS: { display: 'Nouns', value: 'nouns' },
                    ADJECTIVES: { display: 'Adjectives', value: 'adjectives' },
                    ADVERBS: { display: 'Adverbs', value: 'adverbs' },
                    PREPOSITIONS: { display: 'Prepositions', value: 'prepositions' },
                    PHRASES: { display: 'Phrases', value: 'phrases' },
                }

            };

        return constants;


    })());


})(angular.module('DutchApp'));
(function (app) {

    "use strict";

    app.factory('dutch.dictionaryService', ['dutch.Adjective', 'dutch.Adverb', 'dutch.Noun', 'dutch.Nummer', 'dutch.Phrase', 'dutch.Preposition', 'dutch.Verb', 
                                                'dutch.constants', 'dutch.viewService',

            function (Adjective, Adverb, Noun, Nummer, Phrase, Preposition, Verb,
                        constants, viewService) {

            let service =
            {
                getWords: getWords
            };

            let words = [];

            words.push(new Noun(1, 'de man', 'the man'));
            words.push(new Noun(1, 'de vrouw', 'the woman'));
            words.push(new Noun(1, 'de jongen', 'the boy'));
            words.push(new Noun(1, 'het meisje', 'the girl'));
            words.push(new Noun(1, 'het huis', 'the house'));
            words.push(new Phrase(1, 'hallo', 'hello'));
            words.push(new Phrase(1, 'hoi', 'hi'));
            words.push(new Adjective(1, 'goed', 'good'));
            words.push(new Adjective(1, 'slecht', 'bad'));
            words.push(new Noun(1, 'morgen', 'morning'));
            words.push(new Noun(1, 'morgen', 'tomorrow'));
            words.push(new Phrase(1, 'goedemorgen', 'good morning'));
            words.push(new Noun(1, 'avond', 'evening'));
            words.push(new Phrase(1, 'goedenavond', 'good evening'));
            words.push(new Noun(1, 'dag', 'day'));
            words.push(new Phrase(1, 'goedendag', 'good day !'));
            words.push(new Phrase(1, 'tot ziens', 'see you'));
            words.push(new Preposition(1, 'tot', 'until'));
            words.push(new Phrase(1, 'doei', 'bye'));
            words.push(new Phrase(2, ['alsjeblieft', 'alstublieft'], 'here you are (handing over change)'));
            words.push(new Phrase(2, ['alsjeblieft', 'alstublieft'], 'please'));
            words.push(new Phrase(2, 'dank je wel', 'thank you'));
            words.push(new Phrase(2, 'ja', 'yes'));
            words.push(new Phrase(2, 'nee', 'no'));
            words.push(new Phrase(2, 'niet', 'not'));
            words.push(new Verb(2, 'roken', 'to smoke'));
            words.push(new Adverb(2, 'misschien', 'maybe'));
            words.push(new Adjective(2, 'links', 'left'));
            words.push(new Adjective(2, 'rechts', 'right'));
            words.push(new Verb(3, 'zijn', 'to be'));
            words.push(new Noun(3, 'de leraar', 'the teacher'));
            words.push(new Adjective(3, 'blij', 'happy'));
            words.push(new Adjective(3, 'leuk', 'funny'));
            words.push(new Adjective(3, 'mooi', 'pretty'));
            words.push(new Adjective(3, 'oud', 'old'));
            words.push(new Adjective(3, 'jong', 'young'));
            words.push(new Noun(3, 'de voetballer', 'the football player'));
            words.push(new Noun(3, 'de premier', 'the prime minister'));
            words.push(new Noun(3, 'de student', 'the student'));
            words.push(new Noun(3, 'de leerling', 'the scholar'));
            words.push(new Noun(3, 'de baas', 'the boss'));
            words.push(new Noun(3, 'de bakker', 'the baker'));
            words.push(new Noun(3, 'de slager', 'the butcher'));
            words.push(new Noun(3, 'de boer', 'the farmer'));
            words.push(new Noun(3, 'de visser', 'the fisherman'));
            words.push(new Noun(3, 'de advocaat', 'the lawyer'));
            words.push(new Noun(3, 'de dokter', 'the doctor'));
            words.push(new Noun(3, 'de ober', 'the waiter'));
            words.push(new Noun(3, ['de politieman', 'de agent'], 'the police officer'));
            words.push(new Noun(3, 'de kapper', 'the hairdresser'));
            words.push(new Noun(3, 'de directeur', 'the director'));
            words.push(new Noun(3, 'de boekhouder', 'the accountant'));
            words.push(new Noun(3, 'de verkoper', 'the salesman'));
            words.push(new Noun(3, 'de vertegenwoordiger', 'the representative'));
            words.push(new Noun(4, 'eten', 'food'));
            words.push(new Noun(4, 'drinken', 'drinks'));
            words.push(new Noun(4, 'de groente', 'the vegetables'));
            words.push(new Noun(4, 'het fruit', 'the fruits'));
            words.push(new Noun(4, 'het brood', 'the bread'));
            words.push(new Noun(4, 'de boterham', 'the slice of bread'));
            words.push(new Noun(4, 'de kaas', 'the cheese'));
            words.push(new Noun(4, 'de hagelslag', 'the chocolate sprinkles'));
            words.push(new Noun(4, 'de pindakaas', 'the peanut butter'));
            words.push(new Noun(4, 'de melk', 'the milk'));
            words.push(new Noun(4, 'de koffie', 'the coffee'));
            words.push(new Noun(4, 'de thee', 'the tea'));
            words.push(new Noun(4, 'de aardappel', 'the potato'));
            words.push(new Noun(4, 'de aardappeleter', 'the potato-eater'));
            words.push(new Noun(4, 'het bier', 'the beer'));
            words.push(new Noun(4, 'de wijn', 'the wine'));
            words.push(new Noun(4, 'het water', 'the water'));
            words.push(new Noun(4, 'het vlees', 'the meat'));
            words.push(new Noun(4, 'de kip', 'the chicken'));
            words.push(new Noun(4, 'de friet', 'the French fries'));
            //            words.push(new Noun(4, 'frietje met', 'French fries with mayonnaise'));
            words.push(new Noun(4, 'de frikadel', 'Dutch meat sausage'));
            //            words.push(new Noun(4, 'de kroket', 'Dutch fried ragout bar'));
            words.push(new Noun(4, 'de pannenkoek', 'the pancake'));
            words.push(new Noun(4, 'de stroopwafel', 'the syrup waffle'));
            words.push(new Noun(4, 'drop', 'liquorice'));
            words.push(new Noun(4, 'de snoep', 'the sweets'));
            words.push(new Adverb(5, 'terwijl', 'while'));
            words.push(new Adverb(5, 'hoe', 'how'));
            words.push(new Phrase(5, 'zo', 'like this'));
            words.push(new Phrase(5, 'hoeveel', 'how much'));
            words.push(new Noun(5, 'de bloem', 'the flower'));
            words.push(new Adverb(5, 'waarom', 'why'));
            words.push(new Adverb(5, 'daarom', 'that�s why'));
            words.push(new Phrase(5, ['want', 'omdat'], 'because'));
            words.push(new Phrase(5, 'maar', 'but'));
            words.push(new Preposition(5, 'behalve', 'except'));
            words.push(new Noun(5, 'de fiets', 'the bike'));
            words.push(new Noun(6, 'de straat', 'the street'));
            words.push(new Noun(6, 'de weg', 'the road'));
            words.push(new Noun(6, 'de snelweg', 'the highway'));
            words.push(new Noun(6, 'de auto', 'the car'));
            words.push(new Noun(6, 'de bus', 'the bus'));
            words.push(new Noun(6, 'de trein', 'the train'));
            words.push(new Noun(6, 'de tram', 'the tram'));
            words.push(new Noun(6, 'de halte', 'the stopping place'));
            words.push(new Noun(6, 'de metro', 'the metro'));
            words.push(new Noun(6, 'de boot', 'the boat'));
            words.push(new Noun(6, 'het vliegtuig', 'the airplane'));
            words.push(new Noun(6, 'het vliegveld', 'the airport'));
            words.push(new Noun(6, 'de haven', 'the port'));
            words.push(new Noun(6, 'het station', 'the railway station'));
            words.push(new Noun(6, 'het kantoor', 'the office'));
            words.push(new Noun(6, 'de winkel', 'the shop'));
            words.push(new Noun(6, 'de supermarkt', 'the supermarket'));
            words.push(new Noun(6, 'het ziekenhuis', 'the hospital'));
            words.push(new Noun(6, 'de apotheek', 'the pharmacy'));
            words.push(new Noun(6, 'het zwembad', 'the swimming pool'));
            words.push(new Noun(6, 'de sporthal', 'the sports hall'));
            words.push(new Noun(6, 'het politiebureau', 'the police station'));
            words.push(new Noun(6, 'de bibliotheek', 'the library'));
            words.push(new Noun(6, 'de school', 'the school'));
            words.push(new Noun(6, 'de universiteit', 'the university'));
            words.push(new Nummer(7, 'nul', 'zero'));
            words.push(new Nummer(7, '��n', 'one'));
            words.push(new Nummer(7, 'twee', 'two'));
            words.push(new Nummer(7, 'drie', 'three'));
            words.push(new Nummer(7, 'vier', 'four'));
            words.push(new Nummer(7, 'vijf', 'five'));
            words.push(new Nummer(7, 'zes', 'six'));
            words.push(new Nummer(7, 'zeven', 'seven'));
            words.push(new Nummer(7, 'acht', 'eight'));
            words.push(new Nummer(7, 'negen', 'nine'));
            words.push(new Nummer(7, 'tien', 'ten'));
            words.push(new Nummer(7, 'elf', 'eleven'));
            words.push(new Nummer(7, 'twaalf', 'twelve'));
            words.push(new Nummer(7, 'dertien', 'thirteen'));
            words.push(new Nummer(7, 'veertien', 'fourteen'));
            words.push(new Nummer(7, 'vijftien', 'fifteen'));
            words.push(new Nummer(7, 'twintig', 'twenty'));
            words.push(new Nummer(7, '��nentwintig', 'twenty one'));
            words.push(new Nummer(7, 'dertig', 'thirty'));
            words.push(new Nummer(7, 'veertig', 'forty'));
            words.push(new Nummer(7, 'vijftig', 'fifty'));
            words.push(new Nummer(7, 'honderd', 'hundred'));
            words.push(new Nummer(7, 'tweehonderd', 'two hundred'));
            words.push(new Nummer(7, 'duizend', 'thousand'));
            words.push(new Nummer(7, 'miljoen', 'million'));
            words.push(new Verb(8, 'lopen', 'to walk'));
            words.push(new Verb(8, 'hebben', 'to have'));
            words.push(new Verb(8, 'worden', 'to become'));
            words.push(new Verb(8, 'gaan', 'to go'));
            words.push(new Verb(8, 'vragen', 'to ask'));
            words.push(new Noun(8, 'de vraag', 'the question'));
            words.push(new Verb(8, 'antwoorden', 'to answer'));
            words.push(new Noun(8, 'het antwoord', 'the answer'));
            words.push(new Verb(8, 'kopen', 'to buy'));
            words.push(new Verb(8, 'krijgen', 'to get, to receive'));
            words.push(new Verb(8, 'eten', 'to eat'));
            words.push(new Verb(8, 'drinken', 'to drink'));
            words.push(new Verb(8, 'rijden', 'to drive'));
            words.push(new Verb(8, 'vergeten', 'to forget'));
            words.push(new Verb(8, 'horen', 'to hear'));
            words.push(new Verb(8, 'luisteren', 'to listen'));
            words.push(new Verb(8, 'zien', 'to see'));
            words.push(new Verb(8, 'kijken', 'to look'));
            words.push(new Verb(8, 'weten', 'to know'));
            words.push(new Verb(8, 'leren', 'to learn'));
            words.push(new Verb(8, 'slapen', 'to sleep'));
            words.push(new Verb(8, 'lezen', 'to read'));
            words.push(new Verb(8, 'schrijven', 'to write'));
            words.push(new Verb(8, 'spreken', 'to speak'));
            words.push(new Verb(8, 'praten', 'to talk'));
            words.push(new Verb(8, 'zeggen', 'to say'));
            words.push(new Verb(8, 'denken', 'to think'));
            words.push(new Verb(8, 'werken', 'to work'));
            words.push(new Verb(8, 'wachten', 'to wait'));
            words.push(new Adjective(9, 'groot', 'big'));
            words.push(new Adjective(9, 'klein', 'small'));
            words.push(new Adjective(9, 'lekker', 'tasty'));
            words.push(new Adjective(9, 'vies', 'dirty, disgusting'));
            words.push(new Adjective(9, 'schoon', 'clean'));
            words.push(new Adjective(9, 'mooi', 'beautiful'));
            words.push(new Noun(9, 'de tulp', 'the tulip'));
            words.push(new Adjective(9, 'lelijk', 'ugly'));
            words.push(new Adjective(9, 'interessant', 'interesting'));
            words.push(new Adjective(9, 'saai', 'boring'));
            words.push(new Adjective(9, 'arm', 'poor'));
            words.push(new Adjective(9, 'rijk', 'rich'));
            words.push(new Adjective(9, 'donker', 'dark'));
            words.push(new Adjective(9, 'licht', 'light'));
            words.push(new Adjective(9, 'zwaar', 'heavy'));
            words.push(new Adjective(9, 'hard', 'hard, fast'));
            words.push(new Adjective(9, 'zacht', 'soft, slow'));
            words.push(new Adjective(9, 'snel', 'fast'));
            words.push(new Adjective(9, 'lief', 'lovely, sweet'));
            words.push(new Adjective(9, 'stout', 'naughty'));
            words.push(new Adjective(9, 'koud', 'cold'));
            words.push(new Adjective(9, 'warm', 'warm'));
            words.push(new Adjective(9, 'duur', 'expensive'));
            words.push(new Adjective(9, 'goedkoop', 'cheap'));
            words.push(new Adjective(9, 'hoog', 'high, tall'));
            words.push(new Adjective(9, 'laag', 'low'));
            words.push(new Noun(10, 'winter', 'winter'));
            words.push(new Noun(10, 'lente', 'spring'));
            words.push(new Noun(10, 'zomer', 'summer'));
            words.push(new Noun(10, 'herfst', 'autumn'));
            words.push(new Preposition(11, 'met', 'with'));
            words.push(new Preposition(11, 'van', 'from'));
            words.push(new Preposition(11, 'naar', 'to'));
            words.push(new Preposition(11, 'in', 'in'));
            words.push(new Preposition(11, 'voor', 'in front of'));
            words.push(new Preposition(11, 'achter', 'behind'));
            words.push(new Preposition(11, 'naast', 'next to'));
            words.push(new Preposition(11, 'beneden', 'down, downstairs'));
            words.push(new Preposition(11, 'boven', 'above, up, upstairs'));
            words.push(new Preposition(11, 'onder', 'below'));
            words.push(new Preposition(11, 'op', 'at, on top'));
            words.push(new Preposition(11, 'tussen', 'between'));
            words.push(new Preposition(11, 'het midden', 'the middle'));
            words.push(new Preposition(11, 'over', 'about'));
            words.push(new Preposition(11, 'over', 'over'));
            words.push(new Preposition(11, 'bij', 'at, near'));
            words.push(new Preposition(11, 'binnen', 'inside'));
            words.push(new Preposition(11, 'buiten', 'outside'));
            words.push(new Preposition(11, 'tegen', 'against'));
            words.push(new Preposition(11, 'rond', 'around'));
            words.push(new Preposition(11, 'sinds', 'since'));
            words.push(new Preposition(11, 'zonder', 'without'));
            words.push(new Preposition(11, 'voor', 'before'));
            words.push(new Preposition(11, 'na', 'after'));
            words.push(new Preposition(11, 'om', 'at'));
            words.push(new Noun(13, 'vrije tijd', 'leisure time'));
            words.push(new Noun(13, 'de hobby', 'the hobby'));
            words.push(new Verb(13, 'reizen', 'to travel'));
            words.push(new Noun(13, 'de vakantie', 'the holiday'));
            words.push(new Verb(13, 'kamperen', 'to camp out'));
            words.push(new Noun(13, 'het strand', 'the beach'));
            words.push(new Verb(13, 'zonnen', 'to sunbathe'));
            words.push(new Noun(13, 'het pretpark', 'the theme park'));
            words.push(new Noun(13, 'tuinieren', 'gardening'));
            words.push(new Noun(13, 'de taal', 'the language'));
            words.push(new Verb(13, 'een taal leren', 'to learn a language'));
            words.push(new Verb(13, 'sporten', 'to exercise'));
            words.push(new Verb(13, ['hardlopen', 'rennen'], 'to run'));
            words.push(new Verb(13, 'wandelen', 'to go for a walk'));
            words.push(new Verb(13, 'tennissen', 'to play tennis'));
            words.push(new Verb(13, 'hockeyen', 'to play hockey'));
            words.push(new Verb(13, 'borrelen', 'to have a drink'));
            words.push(new Verb(13, 'uit eten gaan', 'to go out for dinner'));
            words.push(new Verb(13, 'uitgaan', 'to go out'));
            words.push(new Verb(13, 'stappen', 'to go out (and drink)'));
            words.push(new Phrase(13, 'dronken zijn', 'being drunk'));
            words.push(new Verb(13, 'koken', 'to cook'));
            words.push(new Noun(13, 'kunst', 'art'));
            words.push(new Noun(13, 'de verjaardag', 'the birthday'));
            words.push(new Verb(13, 'een verjaardag vieren', 'to celebrate a birthday'));
            words.push(new Phrase(13, 'hij is jarig', 'it�s his birthday'));
            words.push(new Verb(13, 'zingen', 'to sing'));
            words.push(new Verb(13, 'dansen', 'to dance'));
            words.push(new Verb(13, 'winkelen', 'to go shopping'));
            words.push(new Noun(14, 'Amsterdam', 'Amsterdam'));
            words.push(new Noun(14, 'de gracht', 'the canal'));
            //            words.push(new Noun(14, 'het grachtenpand', 'the canal house'));
            words.push(new Noun(14, 'de woonboot', 'the house boat'));
            words.push(new Verb(14, 'wonen', 'to live (in a place)'));
            words.push(new Verb(14, 'leven', 'to live (be alive)'));
            words.push(new Noun(14, 'het paleis', 'the palace'));
            words.push(new Noun(14, 'pont', 'the ferry'));
            //            words.push(new Noun(14, 'de rondvaart', 'the canal cruise'));
            words.push(new Noun(14, 'het museum', 'the museum'));
            words.push(new Noun(14, 'het concert', 'the concert'));
            words.push(new Noun(14, 'het gebouw', 'the building'));
            words.push(new Noun(14, 'het plein', 'the square'));
            words.push(new Noun(14, 'het fietspad', 'the bicycle track'));
            words.push(new Noun(14, 'de brug', 'the bridge'));
            words.push(new Noun(14, 'het eiland', 'the island'));
            words.push(new Noun(14, 'de ring', 'the ring, the ring road'));
            //            words.push(new Noun(14, 'de coffeeshop', 'bar where soft drugs is sold'));
            words.push(new Noun(14, 'het stadion', 'the stadium'));
            words.push(new Noun(14, 'het hoofdkantoor', 'the head office'));
            //            words.push(new Noun(14, 'de wallen', 'the red light district'));
            words.push(new Noun(14, 'de hoer', 'the prostitute'));
            words.push(new Noun(14, 'het park', 'the park'));
            words.push(new Noun(14, 'het bos', 'the forest'));
            words.push(new Noun(15, ['de woning', 'het huis'], 'the house'));
            words.push(new Noun(15, 'de deur', 'the door'));
            words.push(new Noun(15, 'het raam', 'the window'));
            words.push(new Noun(15, 'de stoel', 'the chair'));
            words.push(new Noun(15, 'de kruk', 'the stool'));
            words.push(new Noun(15, 'de tafel', 'the table'));
            words.push(new Noun(15, 'de lamp', 'the lamp'));
            words.push(new Noun(15, 'de televisie', 'the television'));
            words.push(new Noun(15, 'de kast', 'the closet'));
            words.push(new Noun(15, 'de wc', 'the toilet'));
            words.push(new Noun(15, 'de keuken', 'the kitchen'));
            words.push(new Noun(15, 'het fornuis', 'the cooker'));
            words.push(new Noun(15, 'de koelkast', 'the fridge'));
            words.push(new Noun(15, 'de kamer', 'the room'));
            words.push(new Noun(15, 'de woonkamer', 'the living room'));
            words.push(new Noun(15, 'de bank', 'the couch'));
            words.push(new Noun(15, 'de slaapkamer', 'the sleeping room'));
            words.push(new Noun(15, 'het bed', 'the bed'));
            words.push(new Noun(15, 'de badkamer', 'the bathroom'));
            words.push(new Noun(15, 'de douche', 'the shower'));
            words.push(new Noun(15, 'het bad', 'the bath tub'));
            words.push(new Noun(15, 'de bijkeuken', 'the scullery'));
            words.push(new Noun(15, 'de garage', 'the garage'));
            words.push(new Noun(15, 'de tuin', 'the garden'));
            words.push(new Noun(15, 'de zolder', 'the attic'));
            words.push(new Noun(16, ['het lichaam', 'het lijf'], 'the body'));
            words.push(new Noun(16, ['het hoofd', 'de kop'], 'the head'));
            words.push(new Noun(16, 'de mond', 'the mouth'));
            words.push(new Noun(16, 'de tand', 'the tooth'));
            words.push(new Noun(16, 'het oor', 'the ear'));
            words.push(new Noun(16, 'het oog', 'the eye'));
            words.push(new Noun(16, 'de bril', 'the glasses'));
            words.push(new Noun(16, 'de zonnebril', 'the sunglasses'));
            words.push(new Noun(16, 'de neus', 'the nose'));
            words.push(new Noun(16, 'het haar', 'the hair'));
            words.push(new Noun(16, 'de arm', 'the arm'));
            words.push(new Noun(16, 'de elleboog', 'the elbow'));
            words.push(new Noun(16, 'de hand', 'the hand'));
            words.push(new Noun(16, 'de vinger', 'the finger'));
            words.push(new Noun(16, 'het been', 'the leg'));
            words.push(new Noun(16, 'de knie', 'the knee'));
            words.push(new Noun(16, 'de voet', 'the foot'));
            words.push(new Noun(16, 'de teen', 'the toe'));
            words.push(new Noun(16, 'de rug', 'the spine'));
            words.push(new Noun(16, 'de buik', 'the belly, the stomach'));
            words.push(new Noun(16, 'de schouder', 'the shoulder'));
            words.push(new Noun(16, 'de kont', 'the ass'));
            words.push(new Noun(16, 'de borst', 'the chest, the breast'));
            words.push(new Noun(16, 'de baard', 'the beard'));
            words.push(new Noun(16, 'de snor', 'the moustache'));
            words.push(new Noun(16, 'het hart', 'the heart'));
            words.push(new Noun(17, 'de kleren', 'the clothes'));
            words.push(new Noun(17, 'de kleding', 'the clothing'));
            words.push(new Noun(17, 'de kledingwinkel', 'the clothes shop'));
            words.push(new Noun(17, 'de broek', 'the pants'));
            words.push(new Noun(17, 'de spijkerbroek', 'the jeans'));
            words.push(new Noun(17, 'de trui', 'the sweater'));
            words.push(new Noun(17, 'de jas', 'the coat'));
            words.push(new Noun(17, 'de rok', 'the skirt'));
            words.push(new Noun(17, 'de jurk', 'the dress'));
            words.push(new Noun(17, 'de sok', 'the sock (short)'));
            words.push(new Noun(17, 'de kous', 'the sock (long)'));
            words.push(new Noun(17, 'de schoen', 'the shoe'));
            words.push(new Noun(17, 'de klomp', 'the wooden shoe'));
            words.push(new Noun(17, 'de riem', 'the belt'));
            words.push(new Noun(17, 'het T-shirt', 'the T-shirt'));
            words.push(new Noun(17, 'het onderhemd', 'the undershirt'));
            words.push(new Noun(17, 'het overhemd', 'the shirt'));
            words.push(new Noun(17, 'de blouse', 'the blouse, the shirt'));
            words.push(new Noun(17, 'het pak', 'the suit'));
            words.push(new Noun(17, ['het colbert', 'de colbert'], 'the suit jacket'));
            words.push(new Noun(17, 'de stropdas', 'the tie'));
            words.push(new Noun(17, 'de strik', 'the bow'));
            words.push(new Noun(17, 'de pyjama', 'the pyjamas'));
            words.push(new Noun(17, 'de onderbroek', 'the undershorts'));
            words.push(new Noun(17, 'de bh', 'the bra'));
            words.push(new Noun(17, 'de hoed', 'the hat'));
            words.push(new Noun(17, 'de das', 'the scarf'));
            words.push(new Verb(18, 'doen', 'to do'));
            words.push(new Verb(18, 'beginnen', 'to begin'));
            words.push(new Verb(18, 'geloven', 'to believe'));
            words.push(new Verb(18, 'brengen', 'to bring'));
            words.push(new Verb(18, 'halen', 'to pick up'));
            words.push(new Verb(18, 'lenen', 'to borrow'));
            words.push(new Verb(18, 'bellen', 'to call'));
            words.push(new Verb(18, 'kunnen', 'to be able to'));
            words.push(new Verb(18, 'sluiten', 'to close'));
            words.push(new Verb(18, 'snijden', 'to cut'));
            words.push(new Verb(18, 'beslissen', 'to decide'));
            words.push(new Verb(18, 'vallen', 'to fall'));
            words.push(new Verb(18, 'voelen', 'to feel, to touch'));
            words.push(new Verb(18, 'volgen', 'to follow'));
            words.push(new Verb(18, 'gebeuren', 'to happen'));
            words.push(new Noun(18, 'iets', 'something'));
            words.push(new Verb(18, 'helpen', 'to help'));
            words.push(new Verb(18, 'houden', 'to hold, to keep'));
            words.push(new Verb(18, 'houden van', 'to love'));
            words.push(new Verb(18, 'weten', 'to know'));
            words.push(new Verb(18, 'kennen', 'to know'));
            words.push(new Verb(18, 'leuk vinden', 'to like'));
            words.push(new Verb(18, 'laten', 'to leave'));
            words.push(new Verb(18, 'verliezen', 'to lose'));
            words.push(new Verb(18, 'winnen', 'to win'));
            words.push(new Verb(18, 'maken', 'to make'));
            words.push(new Verb(19, 'solliciteren', 'to apply for'));
            words.push(new Noun(19, 'de sollicitatie', 'the application'));
            words.push(new Noun(19, 'de vacature', 'the vacancy'));
            words.push(new Noun(19, 'de advertentie', 'the advertisement'));
            words.push(new Noun(19, 'het werk', 'the work'));
            words.push(new Noun(19, 'de baan', 'the job'));
            words.push(new Verb(19, 'veranderen', 'to change'));
            words.push(new Noun(19, 'de brief', 'the letter'));
            //words.push(new Noun(19, 'de sollicitatiebrief', 'the application letter'));
            //            words.push(new Noun(19, 'het cv (curriculum vitae)', 'the resume'));
            words.push(new Noun(19, 'de opleiding', 'the education'));
            words.push(new Noun(19, 'de ervaring', 'the experience'));
            //            words.push(new Noun(19, 'het gesprek', 'the conversation, the interview'));
            //            words.push(new Noun(19, 'het sollicitatiegesprek', 'the job interview'));
            words.push(new Noun(19, ['het bedrijf', 'de zaak'], 'the company'));
            words.push(new Noun(19, 'het salaris', 'the salary'));
            words.push(new Adjective(19, 'bruto', 'gross (money)'));
            words.push(new Adjective(19, 'netto', 'net (money)'));
            words.push(new Noun(19, 'de belasting', 'the tax'));
            //            words.push(new Noun(19, 'het vakantiegeld', 'the vacation bonus'));
            //            words.push(new Noun(19, 'de auto van de zaak', 'the company car'));
            words.push(new Noun(19, 'het pensioen', 'the pension'));
            //            words.push(new Noun(19, 'de reiskosten', 'the travel expenses'));
            words.push(new Noun(19, 'de vergoeding', 'the compensation'));
            //            words.push(new Noun(19, 'de reiskostenvergoeding', 'the compensation for travel expenses'));
            words.push(new Noun(19, 'de collega', 'the colleague'));
            words.push(new Verb(19, 'aannemen', 'to hire'));
            words.push(new Verb(19, 'ontslaan', 'to fire'));
            words.push(new Noun(20, 'de vader', 'the father'));
            words.push(new Noun(20, 'papa', 'dad'));
            words.push(new Noun(20, 'de moeder', 'the mother'));
            words.push(new Noun(20, 'mama', 'mom'));
            words.push(new Noun(20, 'de broer', 'the brother'));
            words.push(new Noun(20, 'de zus', 'the sister'));
            words.push(new Noun(20, ['de opa', 'de grootvader'], 'the grandfather'));
            words.push(new Noun(20, ['de oma', 'de grootmoeder'], 'the grandmother'));
            words.push(new Noun(20, 'de tante', 'the aunt'));
            words.push(new Noun(20, 'de oom', 'the uncle'));
            words.push(new Noun(20, 'de neef', 'the cousin, the nephew'));
            words.push(new Noun(20, 'de nicht', 'the cousin, the niece'));
            words.push(new Noun(20, 'het kind', 'the child'));
            words.push(new Noun(20, 'het kleinkind', 'the grandchild'));
            words.push(new Noun(20, 'de vriend', 'the (boy) friend'));
            words.push(new Noun(20, 'de vriendin', 'the (girl) friend'));
            words.push(new Noun(20, 'de kennis', 'the acquaintance'));
            words.push(new Noun(20, 'de bekende', 'the acquaintance'));
            words.push(new Noun(20, 'de klasgenoot', 'the classmate'));
            words.push(new Noun(20, 'de verkering', 'the relationship (love)'));
            words.push(new Phrase(20, 'verliefd', 'in love'));
            words.push(new Adjective(20, 'verloofd', 'engaged (married)'));
            words.push(new Verb(20, 'trouwen', 'to marry'));
            words.push(new Verb(20, 'scheiden', 'to divorce'));
            words.push(new Phrase(20, 'gescheiden zijn', 'to be divorced'));
            words.push(new Noun(21, 'het dier', 'the animal'));
            words.push(new Noun(21, 'het huisdier', 'the pet'));
            words.push(new Noun(21, 'de hond', 'the dog'));
            words.push(new Noun(21, 'de kat', 'the cat'));
            words.push(new Noun(21, 'de muis', 'the mouse'));
            words.push(new Noun(21, 'het konijn', 'the rabbit'));
            words.push(new Noun(21, 'de haas', 'the hare'));
            words.push(new Noun(21, 'de boerderij', 'the farm'));
            words.push(new Noun(21, 'de koe', 'the cow'));
            words.push(new Noun(21, 'het paard', 'the horse'));
            words.push(new Noun(21, 'het varken', 'the pig'));
            words.push(new Noun(21, 'de ezel', 'the donkey'));
            words.push(new Noun(21, 'de kip', 'the chicken'));
            words.push(new Noun(21, 'de haan', 'the cockerel'));
            words.push(new Noun(21, 'de vogel', 'the bird'));
            words.push(new Noun(21, 'de eend', 'the duck'));
            words.push(new Noun(21, 'de zwaan', 'the swan'));
            words.push(new Noun(21, 'de gans', 'the goose'));
            words.push(new Noun(21, 'de ooievaar', 'the stork'));
            words.push(new Noun(21, 'de mus', 'the sparrow'));
            words.push(new Noun(21, 'de duif', 'the pigeon'));
            words.push(new Noun(21, 'de vis', 'the fish'));
            words.push(new Noun(21, 'het hert', 'the deer'));
            words.push(new Noun(21, 'het insect', 'the insect'));
            words.push(new Noun(21, 'de vlieg', 'the fly'));
            words.push(new Noun(21, 'de bij', 'the bee'));
            words.push(new Noun(21, 'de vlinder', 'the butterfly'));
            words.push(new Noun(21, 'de spin', 'the spider'));
            words.push(new Noun(22, 'de voetbal', 'the football'));
            words.push(new Noun(22, 'het voetbal', 'football (soccer)'));
            words.push(new Noun(22, 'het doel', 'the goal (frame)'));
            words.push(new Noun(22, 'het doelpunt', 'the goal (scored)'));
            words.push(new Noun(22, 'het elftal', 'the football team'));
            words.push(new Adjective(22, 'oranje', 'orange (color)'));
            words.push(new Noun(22, 'oranje', 'the dutch football team'));
            words.push(new Noun(22, 'de spits', 'the striker'));
            words.push(new Noun(22, 'de middenvelder', 'the midfielder'));
            words.push(new Noun(22, 'de verdediger', 'the defender'));
            words.push(new Noun(22, ['de keeper', 'de doelverdediger'], 'the goalkeeper'));
            words.push(new Noun(22, 'de scheidsrechter', 'the referee'));
            words.push(new Noun(22, 'de supporter', 'the fan'));
            words.push(new Noun(22, 'de twaalfde man', 'the fans'));
            words.push(new Noun(22, 'de eerste helft', 'the first half'));
            words.push(new Noun(22, 'de rust', 'half time'));
            words.push(new Noun(22, 'de tweede helft', 'the second half'));
            words.push(new Verb(22, 'schoppen', 'to kick'));
            words.push(new Noun(22, 'het schot', 'the shot'));
            words.push(new Noun(22, 'de redding', 'the save'));
            words.push(new Verb(22, 'redden', 'to save'));
            words.push(new Noun(22, 'de voorzet', 'the assist'));
            words.push(new Noun(22, 'de gele kaart', 'the yellow card'));
            words.push(new Noun(22, 'de rode kaart', 'the red card'));
            words.push(new Noun(22, 'de vrije trap', 'the free kick'));
            words.push(new Noun(22, 'de strafschop', 'the penalty kick'));
            words.push(new Noun(22, 'de hoekschop', 'the corner kick'));
            words.push(new Adjective(22, 'buitenspel', 'offside'));
            words.push(new Noun(22, 'de kampioen', 'the champion'));
            words.push(new Noun(22, 'het wereldkampioenschap', 'the world cup'));
            words.push(new Verb(23, 'nodig hebben', 'to need'));
            words.push(new Verb(23, 'vinden', 'to find, to think (have an opinion)'));
            words.push(new Verb(23, 'bedoelen', 'to mean'));
            words.push(new Verb(23, 'bewegen', 'to move'));
            words.push(new Verb(23, 'nemen', 'to take'));
            words.push(new Verb(23, 'komen', 'to come'));
            words.push(new Verb(23, 'willen', 'to want'));
            words.push(new Verb(23, 'gebruiken', 'to use'));
            words.push(new Verb(23, 'geven', 'to give'));
            words.push(new Verb(23, 'vertellen', 'to tell'));
            words.push(new Verb(23, 'proberen', 'to try'));
            words.push(new Verb(23, 'lijken', 'to seem'));
            words.push(new Verb(23, 'laten zien', 'to show'));
            words.push(new Verb(23, 'spelen', 'to play'));
            words.push(new Verb(23, 'zitten', 'to sit'));
            words.push(new Verb(23, 'staan', 'to stand'));
            words.push(new Verb(23, 'betalen', 'to pay'));
            words.push(new Verb(23, 'ontmoeten', 'to meet'));
            words.push(new Verb(23, 'doorgaan', 'to continue'));
            words.push(new Verb(23, 'uitgeven', 'to spend'));
            words.push(new Verb(23, 'groeien', 'to grow'));
            words.push(new Verb(23, 'aanbieden', 'to offer'));
            words.push(new Verb(23, 'herinneren', 'to remember'));
            words.push(new Verb(23, 'overwegen', 'to consider'));
            words.push(new Verb(23, 'bouwen', 'to build'));
            words.push(new Verb(23, 'blijven', 'to stay'));
            words.push(new Noun(24, 'het weer', 'the weather'));
            words.push(new Phrase(24, ['wat voor weer wordt het?'], ['wat voor weer wordt het'], 'what will be the weather?'));
            words.push(new Noun(24, 'het weerbericht', 'the weather forecast'));
            words.push(new Noun(24, 'het bericht', 'the message'));
            //            words.push(new Phrase(24, 'lekker weer, h�', 'nice weather isn�t it?'));
            words.push(new Phrase(24, 'zeker', '(for) sure'));
            words.push(new Phrase(24, ['mooi weer', 'lekker weer'], 'nice weather'));
            words.push(new Noun(24, 'vandaag', 'today'));
            words.push(new Noun(24, 'de temperatuur', 'the temperature'));
            words.push(new Noun(24, 'de thermometer', 'the thermometer'));
            words.push(new Noun(24, 'graden', 'degrees'));
            words.push(new Noun(24, 'de graad', 'the degree'));
            words.push(new Verb(24, 'schijnen', 'to shine'));
            words.push(new Phrase(24, 'slecht weer', 'bad weather'));
            words.push(new Noun(24, 'de neerslag', 'the precipitation'));
            words.push(new Verb(24, 'regenen', 'to rain'));
            words.push(new Verb(24, 'sneeuwen', 'to snow'));
            words.push(new Verb(24, 'hagelen', 'to hail'));
            words.push(new Noun(24, 'de wind', 'the wind'));
            words.push(new Verb(24, 'waaien', 'to blow'));
            words.push(new Noun(24, 'de storm', 'the storm'));
            words.push(new Noun(24, 'het onweer', 'the thunderstorm'));
            words.push(new Noun(24, 'de bliksem', 'the lightning'));
            words.push(new Noun(24, 'de donder', 'the thunder'));
            words.push(new Noun(24, 'de wolk', 'the cloud'));
            words.push(new Adjective(24, 'bewolkt', 'cloudy'));
            words.push(new Verb(24, 'vriezen', 'to freeze'));
            words.push(new Noun(24, 'het ijs', 'the ice'));
            words.push(new Adjective(25, 'ander', 'other'));
            words.push(new Adjective(25, 'kort', 'short'));
            words.push(new Adjective(25, 'lang', 'long'));
            words.push(new Adjective(25, 'belangrijk', 'important'));
            words.push(new Adjective(25, 'beter', 'better'));
            words.push(new Adjective(25, 'best', 'best'));
            words.push(new Adjective(25, 'enige', 'only'));
            words.push(new Adjective(25, 'enkel', 'single'));
            words.push(new Adjective(25, 'dubbel', 'double'));
            words.push(new Adjective(25, 'vroeg', 'early'));
            words.push(new Adjective(25, 'laat', 'late'));
            words.push(new Adjective(25, 'vrij', 'free'));
            words.push(new Adjective(25, 'heel', 'whole, very'));
            words.push(new Adjective(25, 'echt', 'real'));
            words.push(new Adjective(25, 'vol', 'full'));
            words.push(new Adjective(25, 'leeg', 'empty'));
            words.push(new Adjective(25, 'speciaal', 'special'));
            words.push(new Adjective(25, 'duidelijk', 'clear'));
            words.push(new Adjective(25, 'onduidelijk', 'unclear'));
            words.push(new Adjective(25, 'beschikbaar', 'available'));
            words.push(new Adjective(25, 'waarschijnlijk', 'probable'));
            words.push(new Adjective(25, 'mogelijk', 'possible'));
            words.push(new Adjective(25, 'huidig', 'current'));
            words.push(new Adjective(25, 'verkeerd', 'wrong'));
            words.push(new Adjective(25, 'juist', 'correct'));
            words.push(new Adjective(25, 'klaar', 'ready'));


            function getWords(mode) {

                switch (mode) {

                    case constants.MODES.ALL.value:
                        return words;

                    case constants.MODES.VERBS.value:
                        return words.filter(w => w instanceof Verb);

                    case constants.MODES.NOUNS.value:
                        return words.filter(w => w instanceof Noun);

                    case constants.MODES.ADJECTIVES.value:
                        return words.filter(w => w instanceof Adjective);

                    case constants.MODES.ADVERBS.value:
                        return words.filter(w => w instanceof Adverb);

                    case constants.MODES.PREPOSITIONS.value:
                        return words.filter(w => w instanceof Preposition);

                    case constants.MODES.PHRASES.value:
                        return words.filter(w => w instanceof Phrase);
/*
                    case constants.MODES.SIMPLE_PAST.value:
                        return words.filter(w => w instanceof Verb && w.simplePast && w.simplePast.length > 0)

                    case constants.MODES.PAST_PERFECT.value:
                        return words.filter(w => w instanceof Verb && w.pastPerfect);
*/
                }

                return [];

            }  // getWords


            return service;


        }

    ]);


})(angular.module('DutchApp'));
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
(function (app) {

    "use strict";

    app.factory('dutch.Adjective', ['dutch.Word',

        function (Word) {

            class Adjective extends Word {
                constructor(lessonID, dutch, english) {
                    super(lessonID, dutch, english);
                }

                getPart() {
                    return "adj";
                }

            }

            return Adjective;


        }  // outer function

    ]);

})(angular.module('DutchApp'));



(function (app) {

    "use strict";

    app.factory('dutch.Adverb', ['dutch.Word',

        function (Word) {

            class Adverb extends Word {
                constructor(lessonID, dutch, english) {
                    super(lessonID, dutch, english);
                }

                getPart() {
                    return "adv";
                }

            }

            return Adverb;


        }  // outer function

    ]);

})(angular.module('DutchApp'));



(function (app) {

    "use strict";

    app.factory('dutch.Noun', ['dutch.Word',

        function (Word) {

            class Noun extends Word {
                constructor(lessonID, dutch, english) {
                    super(lessonID, dutch, english);
                }

                getPart() {
                    return "n";
                }

            }

            return Noun;


        }  // outer function

    ]);

})(angular.module('DutchApp'));



(function (app) {

    "use strict";

    app.factory('dutch.Nummer', ['dutch.Word',

        function (Word) {

            class Nummer extends Word {
                constructor(lessonID, dutch, english) {
                    super(lessonID, dutch, english);
                }

                getPart() {
                    return "number";
                }

            }

            return Nummer;


        }  // outer function

    ]);

})(angular.module('DutchApp'));



(function (app) {

    "use strict";

    app.factory('dutch.Phrase', ['dutch.Word',

        function (Word) {

            class Phrase extends Word {
                constructor(lessonID, dutch, english) {
                    super(lessonID, dutch, english);
                }

                getPart() {
                    return "phrase";
                }

            }

            return Phrase;


        }  // outer function

    ]);

})(angular.module('DutchApp'));



(function (app) {

    "use strict";

    app.factory('dutch.Preposition', ['dutch.Word',

        function (Word) {

            class Preposition extends Word {
                constructor(lessonID, dutch, english) {
                    super(lessonID, dutch, english);
                }

                getPart() {
                    return "prep";
                }

            }

            return Preposition;


        }  // outer function

    ]);

})(angular.module('DutchApp'));



(function (app) {

    "use strict";

    app.factory('dutch.Verb', ['dutch.Word',

        function (Word) {

            class Verb extends Word {
                constructor(lessonID, dutch, english, simplePast, pastPerfect) {
                    super(lessonID, dutch, english);
                    this.simplePast = simplePast;
                    this.pastPerfect = pastPerfect;
                }

                getPart() {
                    return "v";
                }
            }

            return Verb;


        }  // outer function

    ]);

})(angular.module('DutchApp'));



(function (app) {

    "use strict";

    app.factory('dutch.Word', [ 

        function() {

            class Word {
                    constructor(lessonID, dutch, english) {
                        this.lessonID = lessonID;
                        this.dutch = dutch;
                        this.english = english;
                        this.numWrong = 0;
                        this.numRight = 0;
                    }

                }  // Word class

            return Word;

        }  // outer function

    ]);


})(angular.module('DutchApp'));

