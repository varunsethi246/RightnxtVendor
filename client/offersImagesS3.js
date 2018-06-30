var offerImagesS3 = new FS.Store.S3("offerImagesS3");

export const OfferImagesS3 = new FS.Collection("offerImagesS3", {
  stores: [offerImagesS3],
  filter: {
    allow: {
      contentTypes: ['image/*']
    }
  }
});

OfferImagesS3.allow({
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


OfferImagesS3.deny({
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
