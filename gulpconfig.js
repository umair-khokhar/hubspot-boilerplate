/**
 * Gulp configuration
 */

const config = {
  project: 'boilerplate',
  dest: {
    scss: 'dist/css',
    modules: 'dist/modules',
    icons: 'src/icons',
    macros: 'dist/macros',
  },
  dirs: {
    scss: 'src/scss/',
    modules: 'src/modules/',
  },
  src: {
    scss: 'src/scss/main.scss',
    modules: 'src/modules/**/*',
    icons: 'src/icons/*.svg',
    macros: 'src/macros/*',
  },
};

module.exports = config;
