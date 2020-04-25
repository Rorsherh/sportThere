const gulp = require('gulp');  // Подключяем Gulp
const browserSync = require('browser-sync').create();// локальный сервер
const watch = require('gulp-watch');// слежение за файлами
const sass = require('gulp-sass');// компилятор SCSS
const autoprefixer = require('gulp-autoprefixer');// автопрефиксы
const sourcemaps = require('gulp-sourcemaps');// карты
const notify = require('gulp-notify');// выводит сообщения об ошибках
const plumber = require('gulp-plumber');// отслеживает и обрабатывает ошибки
const fileinclude = require('gulp-file-include'); // сшивает файлы из разбитых частей

// собираем HTML файлы
gulp.task('html', function(callback){
    return gulp.src('./app/html/*.html')
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
                return {
                    title: 'HTML include',
                    sound: false,
                    message: err.message
                }
            })
        }))
        .pipe(fileinclude({ prefix: '@@'}))
        .pipe(gulp.dest('./app/'));
        callback();
});

// компиляция SCSS
gulp.task('scss', function(callback) {
    return gulp.src('./app/scss/main.scss')
        .pipe(plumber({
            errorHandler: notify.onError(function(err){
				return {
					title: 'Styles',
			        sound: false,
			        message: err.message
				}
			})
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 4 versions']
        }))
        .pipe(sourcemaps.write())
        .pipe( gulp.dest('./app/css/') );

    callback();
})

// слежение за HTML и CSS файлами и обновление браузера
gulp.task('watch', function() {
    // слежение за HTML и CSS и обновление браузера
    watch(['./app/*.html', './app/css/**/*.css'], gulp.parallel(browserSync.reload));

    // Слежениее за SCSS и компиляция в CSS
    watch('./app/scss/**/*.scss', gulp.parallel('scss'));

    // Слежениее за SCSS и компиляция в CSS с задержкой 0,25с
    // при возникновении ошибки file to import not found or unreadable
    // watch('./app/scss/**/*.scss', function(){
    //     setTimeout(gulp.parallel('scss'), 250);
    // });

    // Слежение за HTML и сборка страниц и шаблонов
    watch('./app/html/**/*.html', gulp.parallel('html'));
});

// Задача для старта сервера
gulp.task('server', function() {
    browserSync.init({
        server: {
            baseDir: "./app/"
        }
    });
});

gulp.task('default', gulp.parallel('server', 'watch','html', 'scss'));