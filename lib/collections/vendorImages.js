// // FS.debug = true;

// var vendorImage = new FS.Store.FileSystem("vendorImages", {path: process.env.PWD + '/public/vendor'}); 

// VendorImg = new FS.Collection("vendorImages", {
//   stores: [vendorImage]
// });

// VendorImg.allow({
//   insert: function() {
//     return true;
//   },
//   update: function() {
//     return true;
//   },
//   remove: function() {
//     return true;
//   },
//   download: function() {
//     return true;
//   }
// });


// VendorImg.deny({
//   insert: function() {
//     return false;
//   },
//   update: function() {
//     return false;
//   },
//   remove: function() {
//     return false;
//   },
//   download: function() {
//     return false;
//   }
// });

// if (Meteor.isServer) {

// Meteor.publish('vendorImages', function() {
//   return VendorImg.find({}, { limit: 0 });
// });
// }