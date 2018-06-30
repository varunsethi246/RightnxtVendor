import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

import { Payment } from './paymentMaster.js';
export const Offers = new Mongo.Collection('offers');

if (Meteor.isServer) {
  // This code only runs on the server
	Meteor.publish('offers', function offers() {
		return Offers.find({});
	});
	Meteor.publish('offersListSearch', function() {
		return Offers.find({"offerStatus":"Active"},{fields:{"dealHeadline":1}});
	});
	Meteor.publish('businessOffers', function businessOffers(businessLink) {
		return Offers.find({"businessLink": businessLink});
	});
	Meteor.publish('businessOffersCount', function businessOffersCount() {
		return Offers.find({});
	});
	Meteor.publish('noOfOfferWeek', function() {
		var days = 7;
		var currentDate = new Date();
		var last = new Date(currentDate.getTime()-(days * 24 *60 *60 *1000));
		var first = currentDate.getDate() - currentDate.getDay();
		var lastDate = new Date(last).toISOString();
		var firstWeekDate = new Date(currentDate.setDate(first)).toISOString();
		Counts.publish(this, 'noOfOfferWeek', Offers.find({'offerStatus':'Active','createdAt' : {$gte : new Date(firstWeekDate), $lt :new Date(new Date().toISOString())}}));
	});
	Meteor.publish('noOfofferMonth', function() {
  		var currentDate = new Date();
  		var firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  		var lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
		Counts.publish(this, 'noOfofferMonth', Offers.find({'offerStatus':'Active','createdAt' : {$gte : new Date(firstDay), $lt :new Date( new Date().toISOString())}}));
	});
	Meteor.publish('noOfofferYear', function() {
  		var currentDate = new Date();
  		var endDate = new Date(currentDate.getFullYear(),11, 31);
  		var startDate = new Date(new Date().getFullYear(), 0, 1);
		Counts.publish(this, 'noOfofferYear', Offers.find({'offerStatus':'Active','createdAt' : {$gte :startDate, $lt :endDate}}));
	});
}

Meteor.methods({
	'insertOffers':function(formValues){
		Offers.insert({ 
			"businessId"			: formValues.businessId, 
			"vendorId"  			: formValues.vendorId,  
			"dealTemplate" 			: formValues.dealTemplate,
			"dealHeadline"			: formValues.dealHeadline,
			"dealDescription"		: formValues.dealDescription,
			"expirationFromDate" 	: formValues.expirationFromDate,
			"expirationToDate" 		: formValues.expirationToDate,
			"legalNotices"			: formValues.legalNotices,
			"offerStatus"			: formValues.offerStatus,
			"numOfMonths"			: formValues.numOfMonths,
			"offerImage"			: formValues.offerImage,
			"createdAt"				: new Date(),
		}, function(error,result){
			if(error){
				console.log(error);
				return error;
			}
			if(result){
				return result;
			}
		});		
	},

	'updateOffers':function(formValues,_id){
		Offers.update(
			{"_id": _id},
			{ $set:	
				{ 
					"dealTemplate" 			: formValues.dealTemplate,
					"dealHeadline"			: formValues.dealHeadline,
					"dealDescription"		: formValues.dealDescription,
					"expirationFromDate" 	: formValues.expirationFromDate,
					"expirationToDate" 		: formValues.expirationToDate,
					"legalNotices"			: formValues.legalNotices,
					"numOfMonths"			: formValues.numOfMonths,
					"offerImage"			: formValues.offerImage,
					"offerStatus"			: formValues.offerStatus
				}, 
			},
			function(error,result){
				if(error){
					return error;
				}
				if(result){
					return result;
				}
			}
		);
	},

	'updateOfferStatus':function(_id,status){
		Offers.update(
			{"_id": _id},
			{ $set:	
				{ 
					offerStatus : status
				}, 
			},
			function(error,result){
				if(error){
					console.log(error);
					return error;
				}
				if(result){
					return result;
				}
			}
		);
	},

	'deleteOffers':function(formValues,businessLink){
		Offers.remove(formValues);
		var payObj = Payment.findOne({"vendorId":Meteor.userId(), "businessLink": businessLink, "paymentStatus":"unpaid", "orderType":"Offer"});
		if(payObj){
			Payment.update(
			{"_id":payObj._id},
			{$pull: 
				{'offers': 
					{
						'offerId': formValues
					},
				'offerId': formValues,
				}
			});
		}
	},
	'deleteOfferImg' : function(id){
		Offers.update(
			{"_id": id},
			{ $set:	
				{ 
					"offerImage"			: '',
				}, 
			},
			function(error,result){
				if(error){
					return error;
				}
				if(result){
					return result;
				}
			}
		);	
	},
});
