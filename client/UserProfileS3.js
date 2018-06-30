
var userProfileStoreS3New = new FS.Store.S3("userProfileS3");

export const UserProfileStoreS3New = new FS.Collection("userProfileS3", {
  stores: [userProfileStoreS3New],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});

UserProfileStoreS3New.allow({
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


UserProfileStoreS3New.deny({
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