
var userReviewStoreS3New = new FS.Store.S3("userReviewS3");

export const UserReviewStoreS3New = new FS.Collection("userReviewS3", {
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