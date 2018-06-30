import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from '/imports/api/businessMaster.js';



export const BusinessBanner = new Mongo.Collection('businessBanner');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('allbusinessBanner', function allbusinessBanner() {
    return BusinessBanner.find({});
  });
}


Meteor.methods({
	'insertBusinessBanner':function(formValues){
		var loggedInUser = Meteor.userId();
		var business = Business.findOne({"businessLink": formValues.businessLink, "status":"active"});

		return BusinessBanner.insert({ 
			"businessTitle" : business.businessTitle,
			"businessLink" 	: formValues.businessLink,
			"category" 		: formValues.category,
			"position" 		: formValues.position,
			"rank" 			: formValues.rank,
			"areas" 	    : formValues.selectedAreas,
			"startDate" 	: formValues.startDate,
			"noOfMonths" 	: formValues.noOfMonths,
			"endDate" 		: formValues.endDate,
			"createdAt"	    : new Date(),
			"status"		: "new",
			"createdBy"		: loggedInUser,
			// "payment"		: 'incomplete'
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
	
	'removeBusinessBanner': function(businessLink, catg,pos,rank){
		BusinessBanner.remove({"businessLink": businessLink, "category":catg,"position":pos,"rank":rank});
	},


	'removeBusinessBannerAll': function(businessLink,catg){
		BusinessBanner.remove({"businessLink": businessLink, "category":catg});
	},


	'activateBannerPayment':function(businessLink,catg){
		BusinessBanner.update( 
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


	// 'updateBusinessBanner':function(formValues,areaNames){
	// 	BusinessBanner.update( 
	// 		{businessLink: formValues.businessLink,category: formValues.category,position: formValues.position,rank: formValues.rank},
	// 		{$set : {
	// 			"areas"			: areaNames,
	// 			"payment"		: 'incomplete'
	// 			}
	// 		}, 
	// 		function(error,result){
	// 			if(error){
	// 				// console.log(error);
	// 				return error;
	// 			}
	// 			if(result){
	// 				return result;
	// 			}
	// 		}
	// 	);
	// 	// return businessLink;
	// }



	
	'deactivateBannerPayment':function(businessLink,catg){
		BusinessBanner.update( 
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
