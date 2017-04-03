const del           = require("del");
const gulp          = require("gulp");
const sass          = require("gulp-sass");
const babel         = require("gulp-babel");
const concat        = require("gulp-concat");
const srcMap        = require("gulp-sourcemaps");
const rigger        = require("gulp-rigger");
const notify        = require("gulp-notify");
const minify        = require("gulp-minify");
const minHtml       = require("gulp-minify-html");
const browser       = require("browser-sync");
const cleacCss      = require("gulp-clean-css");
const autoprefixer  = require("gulp-autoprefixer");


//BUILD FILES
gulp.task("html", () => {
    gulp.src("src/index.html")
        .pipe(rigger())
        .pipe(minHtml())
        .pipe(gulp.dest("dest/"));

    return gulp.src("src/body/view/**/**.html")
        .pipe(minHtml())
        .pipe(gulp.dest("dest/view/"));
});

gulp.task("css", () => {
    return gulp.src("src/**/**.sass")
        .pipe(srcMap.init())
        .pipe(sass().on("error", notify.onError({
            message: "<%= error.message %>",
            title  : "Sass Error!"
        })).on("error", () => {console.log("err")}))
        .pipe(autoprefixer())
        .pipe(srcMap.write(""))
        .pipe(concat("app.css"))
        .pipe(gulp.dest("dest/styles"));
});

gulp.task("js", () => {
    return gulp.src("src/**/**.js")
        .pipe(babel({presets: ["es2015"]}).on("error", notify.onError({
            message: "<%= error.message %>",
            title  : "JS Babel Error!"
        })).on("error", () => {console.log("err")}))
        .pipe(concat("app.js"))
        .pipe(gulp.dest("dest/js"));
});


//REMOVING FILES
gulp.task("del", () => {
    return del("dest/**/**.html", "dest/style/app.css", "dest/js/app.js");
});

gulp.task("del-html", () => {
    return del("dest/**/**.html");
});

gulp.task("del-css", () => {
    return del("dest/style/app.css");
});

gulp.task("del-js", () => {
    return del("dest/js/app.js");
});


//WATCHER
gulp.task("watch", () => {
    gulp.watch("src/**/**.html", gulp.series("del-html", "html"));
    gulp.watch("src/**/**.sass", gulp.series("del-css", "css"));
    gulp.watch("src/**/**.js", gulp.series("del-js", "js"));

    gulp.watch("dest/**/*").on("change", browser.reload);
});


//SERVER
gulp.task("server", (call) => {
     browser.init({
        startPath:"dest/",
        server: "./"
    });

    call();
});


//
gulp.task("start", gulp.series("del", gulp.parallel("html", "css", "js"), "server", "watch"));