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


