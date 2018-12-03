(function (app) {

    "use strict";

    app.factory('dutch.Word', [ 

        function() {

            class Word {
                    constructor(lessonID, dutch, english) {
                        this.lessonID = lessonID;
                        this.dutch = dutch;
                        this.english = english;
                        this.numWrong = 0;
                        this.numRight = 0;
                    }

                }  // Word class

            return Word;

        }  // outer function

    ]);


})(angular.module('DutchApp'));


