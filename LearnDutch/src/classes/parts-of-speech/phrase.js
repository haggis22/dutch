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


