import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';



export const City = new Mongo.Collection('city');


if (Meteor.isServer) {
	Meteor.publish('allCity', function allCity() {
		return City.find({});
	});
}


Meteor.methods({
	'insertCity':function(formValues){
		City.insert({ 
			"country" 			: formValues.country,
			"state" 			: formValues.state,
			"city"				: formValues.city,
			"status"			: "active",
			"createdAt"			: new Date(),			
					
		}, 
			function(error,result){
			if(error){
				console.log(error);
				return error;
			}
			if(result){
				return result;
			}
		});		
	},
	'removeCity' : function(id){	
		City.remove(id);
	},

	'updateStatusCityActive':function(recId,status){
		return City.update({'_id':recId},{$set:{'status':status}});
	},

	'updateStatusCityInactive':function(recId,status){
		return City.update({'_id':recId},{$set:{'status':status}});
	},
});