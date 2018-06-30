import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

export const GeneralContent = new Mongo.Collection('generalContent');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('generalContent', function generalContent() {
    return GeneralContent.find({});
  });
  Meteor.publish('generalContentUrl', function generalContentUrl(url) {
    return GeneralContent.find({"url": url});
  });
  Meteor.publish('generalContentFaq', function generalContentFaq(url,tabName) {
    return GeneralContent.find({"url": url,"tabName": tabName});
  });
}

Meteor.methods({
	'insertGeneralContent':function(formValues){
		GeneralContent.insert({ 
			"contentType" 			: formValues.contentType,
			"title" 				: formValues.title,
			"contentBody" 			: formValues.contentBody,
			"tabName" 				: formValues.tabName,
			"sectionHeading" 		: formValues.sectionHeading,
			"url" 					: formValues.title.trim().toLowerCase().replace(/\s+/g, '-'),
			"date" 					: moment(new Date()).format("MMM DD, YYYY"),
		}, function(error,result){
				if(error){
					return error;
				}
				if(result){
					return result;
				}
			}
		);
	},



	'updateGeneralContent':function(formValues){
		GeneralContent.update(
			{"_id": formValues.id},
			{ $set:	
				{ 
					"title" 			: formValues.title,
					"contentBody" 		: formValues.contentBody,
					"tabName" 			: formValues.tabName,
					"sectionHeading" 	: formValues.sectionHeading,
					"date" 				: moment(new Date()).format("MMM DD, YYYY"),
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

	'deleteWebPages':function(formValues){
		GeneralContent.remove(formValues);
	},

});
