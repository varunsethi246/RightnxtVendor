import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const BizVideo = new FilesCollection({
    collectionName: 'bussVideo',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});