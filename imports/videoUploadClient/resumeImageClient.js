import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';

export const ResumeImage = new FilesCollection({
    collectionName: 'resumeImage',
    allowClientCode: false,
    chunkSize: 1024 * 1024
});