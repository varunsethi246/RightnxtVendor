import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from './businessMaster.js';

export const Reports = new Mongo.Collection('reports');


if (Meteor.isServer) {
	Meteor.publish('businessReports', function businessReports(businessLink) {
		return Reports.find({"businessLink":businessLink});
	});

	Meteor.publish('businessReportsCount', function businessReportsCount(businessLink) {
		return Reports.find({});
	});
}


// user _id
// businessLink
// user name
// email _id
// createdAt
// business name


Meteor.methods({
	'insertreports':function(formValues){
		// console.log(businessurl);
		Reports.insert({ 
		 	'userid'        				: Meteor.userId(),
		 	'businessLink'					: formValues.businessLink,
		 	'username'						: Meteor.user().profile.name,
		 	'email'							: Meteor.user().emails[0].address,
			"reportPhoneNumber" 			: formValues.reportPhoneNumber,
			"reportInappropriatePhotos" 	: formValues.reportInappropriatePhotos,
			"reportAddress"					: formValues.reportAddress,
			"reportDuplicateBusiness"		: formValues.reportDuplicateBusiness,
			"reportBusinessHasShutdown"		: formValues.reportBusinessHasShutdown,
			"reportOther"					: formValues.reportOther,
			"selectImageReport"				: formValues.selectImageReport,
			"reportComment"					: formValues.reportComment,
			"imageReportComment"			: formValues.imageReportComment,
			"reportType"					: formValues.reportType,
			"businessTitle"					: formValues.businessTitle,
			"reportedImage"					: formValues.reportedImage,
			'createdAt'						: new Date(),
			},function(error,result){
				if(error){
					console.log('insertreports error ' , error.reason);
					return error;
				}if(result){
					return result; 
				}
		
			});
	},
	'removeImageReport' : function(formValues){
		Reports.remove(formValues);
	},

});







	
					

			 