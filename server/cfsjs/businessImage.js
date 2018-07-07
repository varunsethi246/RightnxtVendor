// // import {S3Details} from '/server/main.js';
// import {S3Details} from '/imports/api/s3Details.js';


// var s3Data =  S3Details.findOne({"_id":"1"});

// if(s3Data)
// {
//   var businessImgStoreS3 = new FS.Store.S3("businessImgS3", {

//     region : s3Data.region, 
//     accessKeyId: s3Data.key, 
//     secretAccessKey: s3Data.secret, 
//     bucket: s3Data.bucket,
//     folder: "BusinessImages",
//     maxTries: 5, //optional, default 5
   
//   });

//   export const BusinessImgUploadS3 = new FS.Collection("businessImgS3", {
//     stores: [businessImgStoreS3],
//     filter: {
//       allow: {
//         contentTypes: ['image/*']
//       }
//     }
//   });

//   BusinessImgUploadS3.allow({
//     insert: function() {
//       return true;
//     },
//     update: function() {
//       return true;
//     },
//     remove: function(fileObj) {
//       return true;
//     },
//     download: function() {
//       return true;
//     }
//   });


//   BusinessImgUploadS3.deny({
//     insert: function() {
//       return false;
//     },
//     update: function() {
//       return false;
//     },
//     remove: function() {
//       return false;
//     },
//     download: function() {
//       return false;
//     }
//   });

//     Meteor.publish("businessImgS3", function() {
//       return BusinessImgUploadS3.find({}, { limit: 0});
//     });
//   if (Meteor.isServer) {


//   }
// }
