﻿(function (app) {

    "use strict";

    app.factory('dutch.Preposition', ['dutch.Word',

        function (Word) {

            class Preposition extends Word {
                constructor(lessonID, dutch, english) {
                    super(lessonID, dutch, english);
                }

                getPart() {
                    return "prep";
                }

            }

            return Preposition;


        }  // outer function

    ]);

})(angular.module('DutchApp'));


