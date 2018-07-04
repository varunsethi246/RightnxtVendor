import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const VendorImage = new FilesCollection({
    collectionName: 'vendorImage',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});