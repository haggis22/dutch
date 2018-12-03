(function (app) {

    "use strict";

    app.factory('dutch.Word', [ 

        function() {

            class Word {
                    constructor(lessonID, dutch, english) {
                        this.lessonID = lessonID;
                        this.dutch = Array.isArray(dutch) ? dutch : [dutch]
                        this.english = english;
                    }

                }  // Word class

            return Word;

        }  // outer function

    ]);


})(angular.module('DutchApp'));


