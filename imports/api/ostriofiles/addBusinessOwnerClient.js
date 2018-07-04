import { Meteor }          from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const BusinessOwnerImages = new FilesCollection({
  debug: true,
  collectionName: 'BusinessOwnerImages',
  allowClientCode: false, // Disallow remove files from Client
  onBeforeUpload: function (file) {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 1024 * 1024 * 3 && /png|jpe?g/i.test(file.extension)) {
      return true;
    }
    return 'Please upload image, with size equal or less than 3 MB';
  }
});



// if (Meteor.isClient) {
//   Meteor.subscribe('allBusinessOwnerImages');
// }


