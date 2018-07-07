// var businessMenuStore = new FS.Store.S3("businessMenu");

// export const BusinessMenuUpload = new FS.Collection("businessMenu", {
//   stores: [businessMenuStore],
//   filter: {
//     allow: {
//       contentTypes: ['image/*']
//     }
//   }
// });

// BusinessMenuUpload.allow({
//   insert: function() {
//     return true;
//   },
//   update: function() {
//     return true;
//   },
//   remove: function() {
//     return true;
//   },
//   download: function(fileObj) {
//     return true;
//   }
// });


// BusinessMenuUpload.deny({
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



