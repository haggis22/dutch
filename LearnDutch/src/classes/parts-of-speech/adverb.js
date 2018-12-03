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


