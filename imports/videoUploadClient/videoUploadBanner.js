import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const BizVideoBanner = new FilesCollection({
    collectionName: 'bannerVideo',
    allowClientCode: false,
    streams: 'dynamic',
    chunkSize: 'dynamic'
});