import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

export const ContactUs = new Mongo.Collection('contactUs');


if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('contactUs', function contactUs() {
    return ContactUs.find({});
  });

  Meteor.publish('noOfContactUs', function() {
		Counts.publish(this, 'noOfContactUs', ContactUs.find({}));
	});
}



Meteor.methods({

	'insertContactUs':function(formValues){

		ContactUs.insert({ 
			"name" 				: formValues.name.trim(),
			"email" 			: formValues.email.trim(),
			"phoneNo" 			: formValues.phoneNo.trim(),
			"howCanWeHelpYou"   : formValues.howCanWeHelpYou,
			"message"   		: formValues.message,
			"createdAt"   		: new Date(),
		}, function(error,result){
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

	'removeContactUsQuery' : function(id){
		ContactUs.remove({"_id":id},
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

});
