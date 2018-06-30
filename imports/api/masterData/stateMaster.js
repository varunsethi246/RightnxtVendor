import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';


export const State = new Mongo.Collection('state');


if (Meteor.isServer) {
  Meteor.publish('allStates', function () {
    return State.find({});
  });
}

Meteor.methods({
	'insertState':function(formValues){
		// console.log(formValues);
		State.insert({ 
			"country" 			: formValues.country,
			"state" 			: formValues.state,
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
	'removeState' : function(formValues){
		
		State.remove(formValues);
	},
	
	'updateStatusActive':function(recId,status){
		return State.update({'_id':recId},{$set:{'status':status}});
	},

	'updateStatusInactive':function(recId,status){
		return State.update({'_id':recId},{$set:{'status':status}});
	},
	// 'updateStateStatus':function(formValues){
	// 	Business.update(
	// 		{State: "maharashtra"},
	// 		{$set: { 
	// 				"status"			: "active"
	// 				}
	// 		}, 	
	// 		function(error,result){
	// 			if(error){
	// 				// console.log(error);
	// 				return error;
	// 			}
	// 		}
	// 	);
	// 	return businessLink;
	// },

});