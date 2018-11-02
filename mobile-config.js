App.info({
  name: 'Rightnxt Vendor',
  version: "1.10.0", 
});

App.setPreference('loadUrlTimeoutValue', '700000', 'android');
App.accessRule('*://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/*');
App.accessRule('*');
App.accessRule('https://*.googleapis.com/*');
App.accessRule('https://*.google.com/*');
App.accessRule('https://*.gstatic.com/*');
App.accessRule('blob:*',{type: 'intent'});
App.accessRule('polyblob:*',{type: 'intent'});
// App.launchScreens({
//   'android_mdpi_portrait': 'splashscreen/320.png',
// });
// App.icons({
//   'android_mdpi': 'splashscreen/48.png',
//   'android_hdpi': 'splashscreen/72.png',
//   'android_xhdpi': 'splashscreen/96.png',
//   'android_xxhdpi': 'splashscreen/144.png',
//   'android_xxxhdpi': 'splashscreen/192.png',
// });