// import {S3Details} from '/server/main.js';
import {S3Details} from '/imports/api/s3Details.js';


var s3Data =  S3Details.findOne({});
if(s3Data)
{
  var businessVideoStore = new FS.Store.S3("businessVideo", {
    chunkSize: 2048000,
    region : s3Data.region, 
      accessKeyId: s3Data.key, 
      secretAccessKey: s3Data.secret, 
      bucket: s3Data.bucket,
    
    folder: "BusinessVideo",
    maxTries: 5, //optional, default 5
    // beforeWrite: function(fileObj) {
    //   fileObj.size(1, {store: "businessVideoStore", save: false});
    // },
  });

  BusinessVideoUpload = new FS.Collection("businessVideo", {
    stores: [businessVideoStore],
    filter: {
      allow: {
        contentTypes: ['video/*']
      }
    }
  });

  BusinessVideoUpload.allow({
    insert: function() {
      return true;
    },
    update: function() {
      return true;
    },
    remove: function() {
      return true;
    },
    download: function() {
      return true;
    }
  });


  BusinessVideoUpload.deny({
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
  Meteor.publish('businessVideo', function() {
    return BusinessVideoUpload.find({}, { limit: 0 });
  });

  if (Meteor.isServer) {

  }
}
