// require("path").basename(__dirname)
let project_folder = 'dist';
let source_folder = "#src";

// let fs = require('fs');

let path = {
    build: {
        html: project_folder + "/",
        css: project_folder + "/css/",
        js: project_folder + "/js/",
        img: project_folder + "/img/",
        fonts: project_folder + "/fonts/"
    },
    src: {
        pug: source_folder + "/pug/*.pug",
        css: source_folder + "/scss/style.scss",
        js: source_folder + "/js/script.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder + "/fonts/*.+(ttf|woff|woff2)"
    },
    watch: {
        html: source_folder + "/dist/**/*.html",
        css: source_folder + "/scss/**/*.scss",
        js: source_folder + "/js/**/*.js",
        img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
        fonts: source_folder + "/fonts/*.+(ttf|woff|woff2)"
    },
    clean: "./" + project_folder + "/"
}

let {src, dest } = require('gulp'),
    gulp = require('gulp'),
    browsersync = require("browser-sync").create(),
    fileinclude = require("gulp-file-include"),
    del = require("del"),
    scss = require("gulp-sass")(require("sass")),
    autoprefixer = require("gulp-autoprefixer"),
    group_media = require("gulp-group-css-media-queries"),
    clean_css = require("gulp-clean-css"),
    rename = require("gulp-rename"),
    uglify = require("gulp-uglify-es").default,
    imagemin = require("gulp-imagemin"),
    webp = require("gulp-webp"),
    // webphtml = require("gulp-webp-html"),
    // webpcss = require("gulp-webpcss"),
    svgSprite = require("gulp-svg-sprite"),
    // sprite = require("gulp-spritesmith"),
    // ttf2woff = require("gulp-ttf2woff"),
    // ttf2woff2 = require("gulp-ttf2woff2"),
    // fonter = require("gulp-fonter");
    // imagemin = require("imagemin");
    // webp = require("gulp-webp");
    pugs = require("gulp-pug"),
    sourcemaps = require("gulp-sourcemaps"),
    concat = require("gulp-concat");
    

function browserSync() {
    browsersync.init({
        server:{
            port: 3000,
            baseDir: "./" + project_folder + "/"
        },
        notify: false
    });
    // gulp.watch('#src/**/*').on('change', browsersync.reload);
};

function pug() {
    return src(path.src.pug)
    .pipe(
        pugs({
            pretty:true,
        })
    )
    // .pipe(fileinclude())
    // .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function css(){
    return src(path.src.css)
    .pipe(
        scss({
            outputStyle: "expanded"
        })
    )
    .pipe(
        group_media()
    )
    .pipe(
        autoprefixer({
            overrideBrowserlist: ["last 5 versions"],
            cascade:true
        })
    )
    // .pipe(webpcss())
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(
        rename({
            extname: ".min.css"
        })
    )
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}





function js(){
    return src(path.src.js)
        .pipe(fileinclude())
        .pipe(dest(path.build.js))
        .pipe(sourcemaps.init())
        .pipe(concat('script.js'))
        .pipe(
            uglify()
        )
        .pipe(
            rename({
                extname: ".min.js"
            })
        )
        .pipe(dest(path.build.js))
        .pipe(browsersync.stream())
}


function images() {
    return src(path.src.img)
        .pipe(
            webp({
                quality: 70
            })
        )
        .pipe(dest(path.build.img))
        .pipe(src(path.src.img))
        .pipe(
            imagemin({
                progressive: true,
                plugins: [{removeViewBox: true}],
                interlaced: true,
                optimizationLevel: 3
            })
        )
        .pipe(dest(path.build.img))
        .pipe(browsersync.stream())
}

// function fonts(){
//     src(path.src.fonts)
//         .pipe(ttf2woff())
//         .pipe(dest(path.build.fonts));
//     return src(path.src.fonts)
//         .pipe(ttf2woff2())
//         .pipe(dest(path.build.fonts));
// }

// gulp.task('otf2ttf', function(){
//     return src([source_folder + '/fonts/*.otf'])
//         .pipe(fonter({
//             formats: ['ttf']
//         }))
//         .pipe(dest(source_folder + '/fonts/'));
// })

gulp.task('svgSprite', function(){
    return gulp.src([source_folder + '/icons/*.svg'])
        .pipe(svgSprite({
            mode: {
                stack:{
                    sprite: "../icons/icons.svg",
                    example: true
                }
            },
        }
        ))
        .pipe(dest(path.build.img))
})

// function sPrite() {
//     return spriteData = gulp.src([source_folder + 'img/icons/*.png']).pipe(sprite({
//         imgName: 'sprite.png',
//         imgPath: '../icons/sprite.png',
//         cssName: 'sprite.css'
//     })),
//     spriteData.img.pipe(gulp.dest('dist/img/icons')),
//     spriteData.css.pipe(gulp.dest('#src/styles.scss/scss/'))
// };

// function fontsStyle(params){
//     let file_content = fs.readFileSync(source_folder + '/scss/fonts.scss');
//     if (file_content== ''){
//         fs.writeFile(source_folder + '/scss/fonts.scss', '', cb);
//         return fs.readdir(path.build.fonts, function (err, items){
//             if (items){
//                 let c_fontname;
//                 for(let i = 0; i<items.length; i++){
//                     let fontname = items[i].split('.');
//                     fontname = fontname[0];
//                     if(c_fontname != fontname){
//                         fs.appendFile(source_folder + '/scss/fonts.scss', '@include font("' + fontname + '", "' + fontname +'");
//                     }
//                     c_fontname = fontname;
//                 }
//             }
//         })
//     }
    
// }

// function cb(){

// }

function watchFiles(){
    gulp.watch([path.watch.html], pug);
    gulp.watch([path.watch.css], css);
    gulp.watch([path.watch.js], js);
    gulp.watch([path.watch.img], images);
}

function clean () {
    return del(path.clean);
}


let build = gulp.series(clean, gulp.parallel(js, css, pug, images, svgSprite));  //svgSprite sPrite
let watch = gulp.parallel(build, watchFiles, browserSync);

// exports.fonts = fonts;
// exports.sPrite = sPrite;
exports.svgSprite = svgSprite;
exports.images = images;
exports.js = js;
exports.css = css;
exports.pug = pug;
exports.build = build;
exports.watch = watch;
exports.default = watch;