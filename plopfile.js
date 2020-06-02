const config = require('./gulpconfig.js');

module.exports = function (plop) {
  // create your generators here
  plop.setGenerator('module', {
    description: 'Generate HubSpot module',
    prompts: [
      {
        type: 'input',
        name: 'project',
        message: 'What is your project name?',
        default: config.project,
        validate: function (value) {
          if (/.+/.test(value)) {
            return true;
          }
          return 'project is required';
        },
      },
      {
        type: 'input',
        name: 'name',
        message: 'What is your module name?',
        validate: function (value) {
          if (/.+/.test(value)) {
            return true;
          }
          return 'name is required';
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: `${config.dirs.modules}/{{project}}_{{dashCase name}}.module/meta.local.json`,
        templateFile: 'templates/module/meta.local.json',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${config.dirs.modules}/{{project}}_{{dashCase name}}.module/meta.global.json`,
        templateFile: 'templates/module/meta.global.json',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${config.dirs.modules}/{{project}}_{{dashCase name}}.module/module.html`,
        templateFile: 'templates/module/module.html',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${config.dirs.modules}/{{project}}_{{dashCase name}}.module/fields/fields.js`,
        templateFile: 'templates/module/fields/fields.js',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${config.dirs.modules}/{{project}}_{{dashCase name}}.module/fields.local.json`,
        templateFile: 'templates/module/fields.local.json',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${config.dirs.modules}/{{project}}_{{dashCase name}}.module/fields.global.json`,
        templateFile: 'templates/module/fields.global.json',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${config.dirs.modules}/{{project}}_{{dashCase name}}.module/fields.json`,
        templateFile: 'templates/module/fields.json',
        abortOnFail: true,
      },
      {
        type: 'add',
        path: `${config.dirs.scss}/components/_c-{{dashCase name}}.scss`,
        templateFile: 'templates/module/module.scss',
        abortOnFail: true,
      },
    ],
  });
};
