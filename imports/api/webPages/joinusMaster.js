import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

export const Career = new Mongo.Collection('career');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('career', function career() {
    return Career.find({});
  });
}

Meteor.methods({
	'insertCareer':function(joinusFormValues){
		Career.insert({ 
			
			"name" 				: joinusFormValues.name.trim(),
			"email" 			: joinusFormValues.email.trim(),
			"MobileNo" 			: joinusFormValues.MobileNo.trim(),
			"Qualification"   	: joinusFormValues.Qualification,
			"PostForApply"   	: joinusFormValues.PostForApply.trim(),
			'ResumeId' 			: joinusFormValues.ResumeId,
			"createdAt"			: new Date(),

		}, function(error,result){
			if(error){
				return error;
			}
			if(result){
				return result;
			}
		});		
	},

	'deleteJobApplicant':function(formValues){
		Career.remove(formValues);
	},

});
