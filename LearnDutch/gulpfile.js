var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var sass = require('gulp-sass');


gulp.task('build', ['clean'], function () {

    // combines all the Angular code from /src along with the dual Angular/Node code from /js
    return gulp.src(['src/app/app.js', 'src/**/*.js'])
        .pipe(concat('dutch.js'));
//        .pipe(gulp.dest('build/client/js'));

});

gulp.task('default', ['build']);
