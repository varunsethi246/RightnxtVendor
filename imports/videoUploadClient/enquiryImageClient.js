import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const EnquiryImage = new FilesCollection({
    collectionName: 'enquiryImage',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});