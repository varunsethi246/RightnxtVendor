import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const ReviewImage = new FilesCollection({
    collectionName: 'reviewImage',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});