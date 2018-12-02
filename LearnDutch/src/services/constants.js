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


                MODE:
                {
                    RANDOM: 'random',
                    VERBS: 'verbs',
                    NOUNS: 'nouns',
                    ADJECTIVES: 'adjectives',
                    ADVERBS: 'adverbs',
                    PREPOSITIONS: 'prepositions',
                    PHRASES: 'phrases',
                    //                SIMPLE_PAST: 'simple past',
                    //                PAST_PERFECT: 'past perfect',
                }

            };

        return constants;


    })());


})(angular.module('DutchApp'));