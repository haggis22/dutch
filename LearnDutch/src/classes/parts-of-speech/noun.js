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


