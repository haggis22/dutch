(function (app) {

    "use strict";

    app.factory('dutch.Verb', ['dutch.Word',

        function (Word) {

            class Verb extends Word {
                constructor(lessonID, dutch, english, simplePast, pastPerfect) {
                    super(lessonID, dutch, english);
                    this.simplePast = simplePast ? (Array.isArray(simplePast) ? simplePast : [simplePast]) : null;
                    this.pastPerfect = pastPerfect ? (Array.isArray(pastPerfect) ? pastPerfect : [pastPerfect]) : null;
                }

                getPart() {
                    return "v";
                }
            }

            return Verb;


        }  // outer function

    ]);

})(angular.module('DutchApp'));


