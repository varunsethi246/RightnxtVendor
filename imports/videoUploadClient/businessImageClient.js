import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const BusinessImage = new FilesCollection({
    collectionName: 'businessImage',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});