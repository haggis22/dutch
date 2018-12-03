(function (app) {

    "use strict";

    app.constant('dutch.constants', (function () {

        let constants =
            {

                STORAGE_KEY_SCORES: 'dutch.scores',

                MODES:
                {
                    ALL: 'All',
                    VERBS: 'Verbs',
                    NOUNS: 'Nouns',
                    ADJECTIVES: 'Adjectives',
                    ADVERBS: 'Adverbs',
                    PREPOSITIONS: 'Prepositions',
                    PHRASES: 'Phrases'
                },

                TENSES:
                {
                    PRESENT: 'Present',
                    SIMPLE_PAST: 'Simple Past',
                    PAST_PERFECT: 'Past Perfect'
                },

                PERIODS:
                {
                    TODAY: "today",
                    ALLTIME: "alltime"
                }


            };

        return constants;


    })());


})(angular.module('DutchApp'));