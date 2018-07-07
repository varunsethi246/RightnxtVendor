// var businessImgStoreS3 = new FS.Store.S3("businessImgS3");

// export const BusinessImgUploadS3 = new FS.Collection("businessImgS3", {
//   stores: [businessImgStoreS3],
//   filter: {
//     allow: {
//       contentTypes: ['image/*']
//     }
//   }
// });

// BusinessImgUploadS3.allow({
//   insert: function(fileObj) {
//     return true;
//   },
//   update: function() {
//     return true;
//   },
//   remove: function(fileObj) {
//     return true;
//   },
//   download: function(fileObj) {
//     return true;
//   }
// });


// BusinessImgUploadS3.deny({
//   insert: function(fileObj) {
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