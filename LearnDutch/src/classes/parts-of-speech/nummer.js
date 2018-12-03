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


