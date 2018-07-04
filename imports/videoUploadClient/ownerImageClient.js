import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const OwnerImage = new FilesCollection({
    collectionName: 'ownerImage',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});