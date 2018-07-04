// import {S3Details} from '/server/main.js';
import {S3Details} from '/imports/api/s3Details.js';


var s3Data =  S3Details.findOne({});
if(s3Data)
{
  // var businessNm = "businessImgS3";
  var enquiryImgStoreS3 = new FS.Store.S3("enquiryImgS3", {
    region : s3Data.region, 
        accessKeyId: s3Data.key, 
        secretAccessKey: s3Data.secret, 
        bucket: s3Data.bucket,
    
    folder: "EnquiryImages",
    maxTries: 5 //optional, default 5
  });

  EnquiryImgUploadS3 = new FS.Collection("enquiryImgS3", {
    stores: [enquiryImgStoreS3],
    filter: {
      allow: {
        contentTypes: ['image/*']
      }
    }
  });

  EnquiryImgUploadS3.allow({
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


  EnquiryImgUploadS3.deny({
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

  Meteor.publish("enquiryImgS3", function() {
    return EnquiryImgUploadS3.find({}, { limit: 0 });
  });
  if (Meteor.isServer) {

  }
}