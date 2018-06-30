import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';
import { City } from './cityMaster.js';
import { State } from './stateMaster.js';



export const Area = new Mongo.Collection('area');



if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('area', function area() {
    return Area.find({});
  });
  Meteor.publish('areaListSearch', function areaListSearch() {
    return Area.find({},{fields:{"city":1,"area":1,"status":1}});
  });
}




Meteor.methods({

	'insertArea':function(formValues){

		// console.log(formValues);
		Area.insert({ 
			"country" 			: formValues.country,
			"state" 			: formValues.state,
			"city"				: formValues.city,
			"area"				: formValues.area,
			"zipcode"			: formValues.zipcode,
			"status"			: "active",
			"createdAt"			: new Date(),			
						
		}, 

			function(error,result){
			if(error){
				console.log(error);
				return error;
			}
			if(result){
				console.log('result ' , result);
				return result;
			}
		});		
	},
	'removeArea' : function(id){
		
		Area.remove(id);
	},

	'updateStatusAreaActive':function(recId,status){
		return Area.update({'_id':recId},{$set:{'status':status}});
	},

	'updateStatusAreaInactive':function(recId,status){
		return Area.update({'_id':recId},{$set:{'status':status}});
	},
	
	
	CSVUploadLocation( data ){
		check( data, Array);
		console.log('data ', data);
		for ( let i = 0; i < data.length - 1; i++ ) {
			var locData = data[i];

			var country    = locData["country"];
			var camalCaseCountry = country.toLowerCase().replace(/\b[a-z]/g, function(letter) {
			    return letter.toUpperCase();
			});
			country = camalCaseCountry;

			var state	   = locData["state"];
			var camalCaseState = state.toLowerCase().replace(/\b[a-z]/g, function(letter) {
			    return letter.toUpperCase();
			});
			state = camalCaseState;

			var city 	   = locData["city"];
			var camalCaseCity = city.toLowerCase().replace(/\b[a-z]/g, function(letter) {
			    return letter.toUpperCase();
			});
			city = camalCaseCity;			

			var area 	   = locData["area"];
			var camalCaseArea = area.toLowerCase().replace(/\b[a-z]/g, function(letter) {
			    return letter.toUpperCase();
			});
			area = camalCaseArea;

			var zipcode    = locData["zipcode"];
			var checkZip = /^\d{6}(?:[-\s]\d{6})?$/.test(zipcode);
			if(!checkZip){
				
			}else{
				var selectedZipCode  = Area.findOne({"zipcode":zipcode});
				if(selectedZipCode){
					// console.log('if zipcode : ',selectedZipCode);
				}else{
					// console.log('else zipcode : ',selectedZipCode);
					Area.insert({
						"country" 			: country,
						"state" 			: state,
						"city"				: city,
						"area"				: area,
						"zipcode"			: zipcode,
						"status"			: "active",
						"createdAt"			: new Date(),
					}, 
						// console.log('Area',Area);
					function(error,result){
					if(error){
						console.log(error);
					}
					if(result){
						console.log('result zipcode ' , result);
					}
					});
					
					var selectedCity = City.findOne({"city":city});
					if(selectedCity){
						// console.log('if city : ',selectedCity);
					}else{
						console.log('else city : ',selectedCity);
						City.insert({
							"country" 			: country,
							"state" 			: state,
							"city"				: city,
							"status"			: "active",
							"createdAt"			: new Date(),					
						}, 

						function(error,result){
						if(error){
							console.log(error);
						}
						if(result){
							console.log('result city ' , result);
						}
						});
						
						var selectedState = State.findOne({"state":state});
						if (selectedState) {
							// console.log('if state :', selectedState);
						}else{
							// console.log('else state :', selectedState);
							State.insert({
							"country" 			: country,
							"state" 			: state,
							"status"			: "active",
							"createdAt"			: new Date(),					
							}, 

							function(error,result){
							if(error){
								console.log(error);
							}
							if(result){
								console.log('result zipcode ' , result);
							}
							});
						}// End of State
						

					}//End of city

				}//End of zipcode and area
			}
		}//End of CSVUpload location
	}
});