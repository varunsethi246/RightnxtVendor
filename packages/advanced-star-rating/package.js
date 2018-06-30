Package.describe({
  name: 'iassureit:advanced-star-rating',
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
  api.versionsFrom('1.4.4.3');
  api.use('ecmascript');
  api.use('twbs:bootstrap');
  api.use('jquery');

  api.mainModule('advanced-star-rating.js');

  // api.addFiles('css/star-rating.css', 'client');
  // api.addFiles('themes/krajee-svg/theme.css', 'client');
  // api.addFiles('themes/krajee-svg/theme.js', 'client');
  // api.addFiles('js/star-rating.js', 'client');


});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('iassureit:advanced-star-rating');
  api.mainModule('advanced-star-rating-tests.js');
});
