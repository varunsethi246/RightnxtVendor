// import {S3Details} from '/server/main.js';
import {S3Details} from '/imports/api/s3Details.js';


var s3Data =  S3Details.findOne({});
if(s3Data)
{
  var businessMenuStore = new FS.Store.S3("businessMenu", {
    region : s3Data.region, 
      accessKeyId: s3Data.key, 
      secretAccessKey: s3Data.secret, 
      bucket: s3Data.bucket,
    
    folder: "BusinessMenus",
    maxTries: 5, //optional, default 5
    // transformWrite: function(fileObj, readStream, writeStream) {
    //   gm(readStream, fileObj.name()).resize('250', '250').stream().pipe(writeStream)
    // }
  });

  BusinessMenuUpload = new FS.Collection("businessMenu", {
    stores: [businessMenuStore],
    filter: {
      allow: {
        contentTypes: ['image/*']
      }
    }
  });

  BusinessMenuUpload.allow({
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


  BusinessMenuUpload.deny({
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

  Meteor.publish('businessMenu', function() {
    return BusinessMenuUpload.find({}, { limit: 0 });
  });
  if (Meteor.isServer) {

  }
}
