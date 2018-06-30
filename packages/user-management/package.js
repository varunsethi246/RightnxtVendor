// Package.describe({
//   name: 'iassureit:user-management',
//   version: '0.0.1',
//   // Brief, one-line summary of the package.
//   summary: 'This is a comprehensive user management package to handle large number of users in a large meteor based application. It uses alanning:roles package to support User roles and related permissions.',
//   // URL to the Git repository containing the source code for this package.
//   git: '',
//   // By default, Meteor will default to using README.md for documentation.
//   // To avoid submitting documentation, set this field to null.
//   documentation: 'README.md'
// });

// Package.onUse(function(api) {
//   api.versionsFrom('1.4.1.2');
//   api.use('ecmascript');
//   api.use('twbs:bootstrap');
//   api.use('mizzao:user-status');
//   api.use('momentjs:moment');
//   api.use('alanning:roles');
//   api.use('accounts-password');
//   api.use('accounts-base');
//   api.use('patrickml:swal');
//   api.use('session');
//   api.use('kadira:flow-router');
//   api.use('kadira:blaze-layout');
//   api.use('email');
//   api.use('themeteorchef:bert');
  
//   api.export('signUpSettings');
//   // api.use('juliancwirko:s-alert');



//   api.mainModule('user-management.js');

//   api.use('templating','client');
//   api.use(['kadira:flow-router', 'templating'], 'client');
//   api.addFiles('clientside/templates/UMsignup.html', 'client');
//   api.addFiles('clientside/templates/UMeditProfile.html', 'client');
//   api.addFiles('clientside/templates/UMeditMyProfile.html', 'client');
//   api.addFiles('clientside/templates/UMlistOfUsers.html', 'client');
//   api.addFiles('clientside/templates/UMlogin.html', 'client');
//   api.addFiles('clientside/templates/UMsettings.html', 'client');
//   api.addFiles('clientside/templates/UMtest.html', 'client');
//   api.addFiles('clientside/templates/UMmainLayout.html', 'client');
//   api.addFiles('clientside/templates/UMhomeLayout.html', 'client');
//   api.addFiles('clientside/templates/UMheader.html', 'client');
//   api.addFiles('clientside/templates/UMaddRoleList.html', 'client');
//   api.addFiles('clientside/templates/UMeditRoles.html', 'client');
//   api.addFiles('clientside/templates/UMaddRoles.html', 'client');
//   api.addFiles('clientside/templates/UMdeleteUserConfirm.html', 'client');
//   api.addFiles('clientside/templates/UMUnauthorizedUser.html', 'client');
//   api.addFiles('clientside/templates/UMChecklistElements.html', 'client');
//   api.addFiles('clientside/templates/UMregister.html', 'client');
//   api.addFiles('clientside/templates/ResetPassword.html', 'client');
//   api.addFiles('clientside/templates/UMresetPassword.html', 'client');
//   api.addFiles('clientside/templates/UMverifyEmail.html', 'client');
//   api.addFiles('clientside/templates/blockedProfile.html', 'client');
//   api.addFiles('clientside/templates/createUser.html', 'client');
//   api.addFiles('clientside/jsfiles/UMresetPassword.js', 'client');
//   api.addFiles('clientside/jsfiles/UMregister.js', 'client');
//   api.addFiles('clientside/jsfiles/UMChecklistElements.js', 'client');
//   api.addFiles('router/UMrouter.js', 'client');
//   api.addFiles('clientside/jsfiles/accounts-config.js', 'client');
//   api.addFiles('clientside/jsfiles/UMheader.js', 'client');
//   api.addFiles('clientside/jsfiles/UMsignup.js', 'client');
//   api.addFiles('clientside/jsfiles/UMeditProfile.js', 'client');
//   api.addFiles('clientside/jsfiles/UMeditMyProfile.js', 'client');
//   api.addFiles('clientside/jsfiles/UMlistOfUsers.js', 'client');
//   api.addFiles('clientside/jsfiles/UMlogin.js', 'client');
//   api.addFiles('clientside/jsfiles/UMsettings.js', 'client');
//   api.addFiles('clientside/jsfiles/UMhomeLayout.js', 'client');
//   api.addFiles('clientside/jsfiles/UMaddRoleList.js', 'client');
//   api.addFiles('clientside/jsfiles/UMeditRoles.js', 'client');
//   api.addFiles('clientside/jsfiles/UMaddRoles.js', 'client');
//   api.addFiles('clientside/jsfiles/UMverifyEmail.js', 'client');
//   api.addFiles('clientside/jsfiles/blockedProfile.js', 'client');
//   api.addFiles('clientside/jsfiles/createUser.js', 'client');
//   api.addFiles('clientside/jsfiles/default-account-settings.js', 'client');
//   api.addFiles('clientside/api/checklist.js', 'client');
//   api.addFiles('serverside/main.js', 'server');
//   api.addFiles('clientside/css/hover.css', 'client');
//   api.addFiles('clientside/css/user-management.css', 'client');
//   api.addFiles('clientside/css/header.css', 'client', 'server');

// });

// Package.onTest(function(api) {
//   api.use('ecmascript');
//   api.use('tinytest');
//   // api.use('iassureit:user-management');
//   api.mainModule('user-management-tests.js');
// });
