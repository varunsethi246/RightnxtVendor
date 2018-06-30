
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
export const QuickwalletDetails = new Mongo.Collection('quickwalletDetails');

if (Meteor.isServer) {
	Meteor.publish('allQuickWalletDetails', function() {
	    return QuickwalletDetails.find({});
	});
}
