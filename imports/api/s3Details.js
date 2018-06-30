import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
export const S3Details = new Mongo.Collection('s3Details');


Meteor.publish('s3Details', function() {
    return S3Details.find({});
});
