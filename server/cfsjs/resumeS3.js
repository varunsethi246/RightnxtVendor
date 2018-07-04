// import {S3Details} from '/server/main.js';
import {S3Details} from '/imports/api/s3Details.js';


var s3Data =  S3Details.findOne({});
if(s3Data)
{

  var resumeS3 = new FS.Store.S3("resumeS3", {

    region : s3Data.region, 
          accessKeyId: s3Data.key, 
          secretAccessKey: s3Data.secret, 
          bucket: s3Data.bucket,
    
    
    folder: "resume",
    maxTries: 5 //optional, default 5
  });

  ResumeS3 = new FS.Collection("resumeS3", {
    stores: [resumeS3],
  });

  ResumeS3.allow({
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


  ResumeS3.deny({
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

  Meteor.publish('resumeS3', function() {
    return ResumeS3.find({}, { limit: 0 });
  });
  if (Meteor.isServer) {

  }
}
