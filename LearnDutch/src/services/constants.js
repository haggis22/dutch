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