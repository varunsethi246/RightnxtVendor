// // FS.debug = true;

// var imageStore = new FS.Store.FileSystem("images", {path: process.env.PWD + '/public/users/profile'}); 

// Images = new FS.Collection("images", {
//   stores: [imageStore]
// });

// // Images = new FS.Collection("images", {
// //   stores: [imageStore],
// //   filter: {
// //   maxSize: 3145728,
// //   allow: {
// //     contentTypes: ['image/*'],
// //     extensions: ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG']
// //   }
// //   }
// // });

// Images.allow({
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


// Images.deny({
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

// Meteor.publish('images', function() {
//   return Images.find({}, { limit: 0 });
// });
// }