import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const OfferImage = new FilesCollection({
    collectionName: 'offerImage',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});