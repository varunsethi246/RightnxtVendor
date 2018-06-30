Package.describe({
  name: 'initialinject',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.6.0.1');
  api.use('ecmascript');
  api.use('meteorhacks:inject-initial', ['server']);

  api.addAssets('initial-loading.html', 'server');
  api.addFiles('initialinject.js', ['server', 'client']);
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('initialinject');
  api.mainModule('initialinject-tests.js');
});
