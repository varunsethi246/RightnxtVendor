import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

export const Newjob = new Mongo.Collection('newjob');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('newjob', function newjob() {
    return Newjob.find({});
  });
  Meteor.publish('onenewjob', function onenewjob(id) {
    return Newjob.find({'_id':id});
  });
}

Meteor.methods({
	'insertNewjob':function(formValues){
		Newjob.insert({ 
			"contentType" 				: formValues.contentType,
			"jobTitle" 					: formValues.jobTitle.trim(),
			"jobDescripton" 			: formValues.jobDescripton,
			"noOfVacancies" 			: formValues.noOfVacancies.trim(),
			"date" 						: formValues.date,
			"selectCountry" 			: formValues.selectCountry,
			"selectState" 				: formValues.selectState,
			"selectCity" 				: formValues.selectCity,
			"salary" 					: formValues.salary.trim(),
			"dateofPost"				: moment(new Date()).format("YYYY-MM-DD"),
			"jobStatus"					: 'active'
		},function(error,result){
			if(error){
				return error;
			}
			if(result){
				return result;
			}
		});		
	},

	'updateNewjob':function(formValues){
		Newjob.update(
			{"_id": formValues.id},
			{ $set:	
				{ 
					"jobTitle" 					: formValues.jobTitle.trim(),
					"jobDescripton" 			: formValues.jobDescripton,
					"noOfVacancies" 			: formValues.noOfVacancies.trim(),
					"date" 						: formValues.date,
					"selectCountry" 			: formValues.selectCountry,
					"selectState" 				: formValues.selectState,
					"selectCity" 				: formValues.selectCity,
					"salary" 					: formValues.salary.trim(),
					"dateofPost"				: moment(new Date()).format("YYYY-MM-DD"),
					"jobStatus"					: 'active'
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

	"updateJobStatus":function(id){
		Newjob.update(
			{"_id": id},
			{ $set:	
				{ 
					jobStatus 	: 'inactive'
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

	"updateJobStatusActive":function(id){
		Newjob.update(
			{"_id": id},
			{ $set:	
				{ 
					jobStatus 	: 'active'
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

	'deleteNewjob':function(formValues){
		Newjob.remove(formValues);
	},

});
