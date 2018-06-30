import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from '/imports/api/businessMaster.js';



export const BusinessAds = new Mongo.Collection('businessAds');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('allBusinessAds', function allBusinessAds() {
    return BusinessAds.find({});
  });
}


Meteor.methods({
	'insertBusinessAds':function(formValues){
		var loggedInUser = Meteor.userId();
		var business = Business.findOne({"businessLink": formValues.businessLink, "status":"active"});

		return BusinessAds.insert({ 
			"businessTitle" : business.businessTitle,
			"businessLink" 	: formValues.businessLink,
			"category" 		: formValues.category,
			"position" 		: formValues.position,
			"areas" 	    : formValues.selectedAreas,
			"city" 	    	: business.businessCity,
			"startDate" 	: formValues.startDate,
			"noOfMonths" 	: formValues.noOfMonths,
			"endDate" 		: formValues.endDate,
			"createdAt"	    : new Date(),
			"status"		: "new",
			"createdBy"		: loggedInUser,
		}, function(error,result){
			if(error){
				// console.log(error);
				return error;
			}
			if(result){
				return result;
			}
		}

		);		
	},
	
	'removeBusinessAds': function(businessLink, catg,pos,rank){
		BusinessAds.remove({"businessLink": businessLink, "category":catg,"position":pos,"rank":rank});
	},


	'removeBusinessAdsAll': function(businessLink,catg){
		BusinessAds.remove({"businessLink": businessLink, "category":catg});
	},


	'activateAdsPayment':function(businessLink,catg){
		BusinessAds.update( 
			{"businessLink": businessLink,"category":catg},
			{$set : {
				"status"		: "active",
				}
			}, 
			function(error,result){
				if(error){
					// console.log(error);
					return error;
				}
				if(result){
					return result;
				}
			}
		);
	},
	
	'deactivateAdsPayment':function(businessLink,catg){
		BusinessAds.update( 
			{"businessLink": businessLink,"category":catg},
			{$set : {
				"status"		: "inactive",
				}
			}, 
			function(error,result){
				if(error){
					// console.log(error);
					return error;
				}
				if(result){
					return result;
				}
			}
		);
	},
});
