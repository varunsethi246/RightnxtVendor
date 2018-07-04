import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const BusinessMenu = new FilesCollection({
    collectionName: 'businessMenu',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});