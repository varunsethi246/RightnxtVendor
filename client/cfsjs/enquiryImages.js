var enquiryImgStoreS3 = new FS.Store.S3("enquiryImgS3");

export const EnquiryImgUploadS3 = new FS.Collection("enquiryImgS3", {
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


