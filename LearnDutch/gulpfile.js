var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var merge = require('merge-stream');
var sortStream = require('sort-stream');


function alphabetically(a, b) {
    return (a.path < b.path) ? -1 : 1;
}


gulp.task('build', [], function () {

    // combines all the Angular code from /src along with the dual Angular/Node code from /js
    let app = gulp.src(['src/app/app.js', 'src/classes/word.js', 'src/**/*.js'])
        .pipe(concat('dutch.js'))
        .pipe(gulp.dest('.'));

    var css = gulp.src(['src/**/*.scss'])
        .pipe(sortStream(alphabetically))
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('dutch.css'))
        .pipe(gulp.dest('.'));

    return merge(app, css);

});

gulp.task('default', ['build']);
