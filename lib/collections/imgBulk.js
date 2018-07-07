// // FS.debug = true;
 
// var businessImage = new FS.Store.FileSystem("bizImg", 
//                         {path: process.env.PWD + '/public/businessImages'});

// BusinessImage = new FS.Collection("bizImg", { stores: [businessImage] });


// BusinessImage.allow({
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


// BusinessImage.deny({
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

// Meteor.publish('bizImg', function() {
//   return BusinessImage.find({}, { limit: 0 });
// });
// }