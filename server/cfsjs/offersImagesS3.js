// // import {S3Details} from '/server/main.js';
// import {S3Details} from '/imports/api/s3Details.js';


// var s3Data =  S3Details.findOne({});
// if(s3Data)
// {
//   var offerImagesS3 = new FS.Store.S3("offerImagesS3", {
//     region : s3Data.region, 
//         accessKeyId: s3Data.key, 
//         secretAccessKey: s3Data.secret, 
//         bucket: s3Data.bucket,
   
//     folder: "OfferImages",
//     maxTries: 5 //optional, default 5
//   });

//   OfferImagesS3 = new FS.Collection("offerImagesS3", {
//     stores: [offerImagesS3],
//     filter: {
//       allow: {
//         contentTypes: ['image/*']
//       }
//     }
//   });

//   OfferImagesS3.allow({
//     insert: function() {
//       return true;
//     },
//     update: function() {
//       return true;
//     },
//     remove: function() {
//       return true;
//     },
//     download: function() {
//       return true;
//     }
//   });


//   OfferImagesS3.deny({
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
//   Meteor.publish('offerImagesS3', function() {
//     return OfferImagesS3.find({}, { limit: 0 });
//   });

//   if (Meteor.isServer) {

//   }

// }