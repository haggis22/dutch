(function (app) {

    "use strict";

    app.constant('dutch.constants', (function () {

        let constants =
            {

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
                }

            };

        return constants;


    })());


})(angular.module('DutchApp'));