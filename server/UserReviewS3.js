// import {S3Details} from '/server/main.js';
import {S3Details} from '/imports/api/s3Details.js';


var s3Data =  S3Details.findOne({});
if(s3Data)
{
  var userReviewStoreS3New = new FS.Store.S3("userReviewS3", {
    region : s3Data.region, 
    accessKeyId: s3Data.key, 
    secretAccessKey: s3Data.secret, 
    bucket: s3Data.bucket,
    
    folder: "UsersReviewImages",
    maxTries: 5, //optional, default 5
    // transformWrite: function(fileObj, readStream, writeStream) {
    //   gm(readStream, fileObj.name()).resize('250', '250').stream().pipe(writeStream)
    // }
  });

  UserReviewStoreS3New = new FS.Collection("userReviewS3", {
    stores: [userReviewStoreS3New],
    filter: {
      allow: {
        contentTypes: ['image/*']
      }
    }
  });

  UserReviewStoreS3New.allow({
    insert: function() {
      return true;
    },
    update: function() {
      return true;
    },
    remove: function(fileObj) {
      return true;
    },
    download: function() {
      return true;
    }
  });


  UserReviewStoreS3New.deny({
    insert: function() {
      return false;
    },
    update: function() {
      return false;
    },
    remove: function() {
      return false;
    },
    download: function() {
      return false;
    }
  });

    Meteor.publish("userReviewS3", function userReviewS3() {
      // console.log(UserReviewStoreS3New.find({}).fetch());
      return UserReviewStoreS3New.find({});
    });
  if (Meteor.isServer) {
  }
}