const path = require('path');
const fs = require('fs');
const del = require('del');
const { series, src, dest, watch } = require('gulp');
const plugins = require('gulp-load-plugins')({ camelize: true });
const config = require('./gulpconfig.js');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const through = require('through2');
const postcssPresetEnv = require('postcss-preset-env');
const postcssObjectFitImages = require('postcss-object-fit-images');
const exec = require('child_process').exec;
const jsonMerger = require('json-merger');
const merge = require('gulp-merge-json');

function buildScss() {
  const postcssPlugins = [
    autoprefixer(),
    postcssObjectFitImages(),
    postcssPresetEnv({
      stage: 0,
    }),
    cssnano(),
  ];
  return (
    src(config.src.scss)
      .pipe(plugins.sassGlobImport())
      .pipe(plugins.sass())
      // Dangerous when using global styles like body { ... };
      // .pipe(
      // 	plugins.purgecss({
      // 		content: ['src/**/*.html']
      // 	})
      // )
      .pipe(plugins.postcss(postcssPlugins))
      .pipe(dest(config.dest.scss))
  );
}

function buildModules() {
  console.log('Syncing files to portal');
  return src([
    'src/modules/**/*',
    '!src/modules/**/fields.local.json',
    '!src/modules/**/fields.global.json',
    '!src/modules/**/meta.global.json',
    '!src/modules/**/meta.local.json',
    '!src/modules/**/fields/*', //exclude
  ]).pipe(dest(config.dest.modules));
}

function buildIcons() {
  return src(config.src.icons)
    .pipe(
      plugins.svgmin({
        plugins: [
          {
            removeViewBox: false,
          },
        ],
      }),
    )
    .pipe(
      plugins.svgstore({
        inlineSvg: true,
        cleanup: true,
      }),
    )
    .pipe(
      plugins.cheerio(function ($) {
        $('svg').attr('style', 'display:none');
      }),
    )
    .pipe(dest(config.dest.icons));
}

function cleanIcons() {
  return del(['src/modules/kopexpo_icons.module/module.html']);
}

function copyIcons() {
  return src('src/icons/icons.svg')
    .pipe(plugins.extReplace('.html'))
    .pipe(plugins.rename({ basename: 'module' }))
    .pipe(dest(`src/modules/${config.project}_icons.module/`));
}

async function buildModuleFields(file) {
  return new Promise((resolve, reject) => {
    // Skip if file doesn't exist...
    if (!fs.existsSync(file)) reject();
    console.log(`Building fields for ${file}`);
    let fieldsFile = path.join(__dirname, file);
    // Config file that lists all .json files
    const fields = require(fieldsFile);
    const filePath = file.replace('/fields/fields.js', '');
    delete require.cache[require.resolve(fieldsFile)];

    console.log(fields.config());
    // Merge all .json files into fields.local.json
    src(fields.config())
      .pipe(plugins.concat('fields.local.json', { newLine: ',\n' }))
      .pipe(plugins.header('['))
      .pipe(plugins.footer(']'))
      .pipe(dest(filePath));

    resolve();
  });
}

function buildMacros() {
  return src(config.src.macros).pipe(dest(config.dest.macros));
}

const fetchMeta = async (file) => {
  return new Promise((resolve, reject) => {
    console.log('Fetching meta.json from portal');
    src(file).pipe(
      through.obj((file, enc, cb) => {
        const dir = /modules\/(.+\.module)/gm.exec(file.path)[1];
        const localPath = file.path.replace('local.json', 'global.json');

        exec(
          `yarn hs fetch --portal=production bright/modules/${dir}/meta.json ${localPath} --overwrite`,
          (err, stdout, stderr) => {
            console.log(stdout);
            resolve();
            cb(err);
          },
        );
      }),
    );
  });
};

const mergeMeta = (file) => {
  return new Promise((resolve, reject) => {
    src(file).pipe(
      through.obj((file, enc, cb) => {
        const localFile = file.path.replace('.global.json', '.local.json');
        const rootFile = file.path.replace('.global.json', '.json');
        console.log(`Merging ${localFile} with ${file.path} in ${rootFile}`);
        try {
          const rootJson = JSON.parse(fs.readFileSync(file.path).toString('utf8'));
          const localJson = JSON.parse(fs.readFileSync(localFile).toString('utf8'));
          console.log(rootJson.module_id);
          // retrieve module_id from portal and set in global file
          localJson.module_id = rootJson.module_id;

          if (rootJson.status !== 'error') {
            fs.writeFileSync(rootFile, JSON.stringify(localJson, null, 2));
            console.log('Succesfully merged meta.json');
            resolve();
          } else {
            fs.writeFileSync(rootFile, fs.readFileSync(localFile).toString('utf8'));
            resolve();
          }
        } catch (error) {
          console.log('Module is not yet defined.');
          fs.writeFileSync(rootFile, fs.readFileSync(localFile).toString('utf8'));
          reject();
        }
        cb();
      }),
    );
  });
};

const fetchFields = (file) => {
  console.log('Fetching fields.json from portal');
  return new Promise((resolve, reject) => {
    src(file).pipe(
      through.obj((file, enc, cb) => {
        const dir = /modules\/(.+\.module)/gm.exec(file.path)[1];

        exec(
          `yarn hs fetch --portal=production bright/modules/${dir}/fields.json ${file.path} --overwrite`,
          (err, stdout, stderr) => {
            console.log(stdout);
            resolve();

            cb(err);
          },
        );
      }),
    );
  });
};

const mergeFields = async (file) => {
  return new Promise(async (resolve, reject) => {
    console.log('Starting to merge fields');
    const localFile = file.replace('.global.json', '.local.json');
    const rootFile = file.replace('.global.json', '.json');

    try {
      const globalJson = JSON.parse(fs.readFileSync(file).toString('utf8'));
      const localJson = JSON.parse(fs.readFileSync(localFile).toString('utf8'));

      // Loop through global JSON and set ID and default in local file
      if (globalJson.length > 0) {
        for (i = 0; i < globalJson.length; i++) {
          const localIndex = await localJson.findIndex((localField) => localField.name === globalJson[i].name);

          if (localIndex !== -1) {
            localJson[localIndex].id = globalJson[i].id;
            localJson[localIndex].default = globalJson[i].default;
          }

          if (i === globalJson.length - 1) {
            if (globalJson.status !== 'error' && localJson.status !== 'error') {
              fs.writeFileSync(rootFile, JSON.stringify(localJson, null, 2));
              console.log('Succesfully merged fields.json');
              resolve();
            } else {
              fs.writeFileSync(rootFile, fs.readFileSync(localFile).toString('utf8'));
              resolve();
            }
          }
        }
      } else {
        console.log('Module does not exist in portal yet. Syncing local content');
        fs.writeFileSync(rootFile, fs.readFileSync(localFile).toString('utf8'));
        resolve();
      }
    } catch (error) {
      console.log(error);
      console.log('Module is not yet defined.');
      fs.writeFileSync(rootFile, fs.readFileSync(localFile).toString('utf8'));
      reject();
    }
  });
};

const Build = series(buildScss, buildMacros, buildModules);

const BuildIcons = series(buildIcons, cleanIcons, copyIcons);

// const GenerateFields = series(fetchFields, buildModuleFields, mergeFields, buildModules);

const GenerateMeta = series(fetchMeta, mergeMeta, buildModules);

const Watch = function () {
  watch(['src/icons/*.svg'], BuildIcons);
  watch(['src/modules/**/fields/fields.js']).on('change', async (file) => {
    const globalFile = file.replace('/fields/fields.js', '/fields.global.json');

    await fetchFields(globalFile);
    await buildModuleFields(file);
    await mergeFields(globalFile);
    buildModules();
  });
  watch(['src/**/*.scss', 'src/**/*.html', 'src/**/*.js', '!src/modules/**/fields/fields.js'], Build);

  watch(['src/modules/**/meta.local.json']).on('change', async (file) => {
    const globalFile = file.replace('local.json', 'global.json');
    await fetchMeta(file);
    await mergeMeta(globalFile);
    buildModules();
  });
};

exports.watch = Watch;
exports.build = Build;
exports['build-icons'] = BuildIcons;
// exports['generate-fields'] = GenerateFields;
