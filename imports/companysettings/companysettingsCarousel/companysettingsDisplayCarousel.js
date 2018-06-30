import './companysettingsDisplayCarousel.html';
import './companysettingsHeader.html';
import '../companyDetails/displayCompanyInfo.html';
import '../companyDetails/displayCompanyLocations.html';
import '../companyDetails/displayBankDetails.html';
import '../companyDetails/displayTaxDetails.html';
// import '../../themes/themes.js';

import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';


import { CompanySettings } from '/imports/api/companysettingsAPI.js';

// Meteor.subscribe('companySettings'); // subcribe

	Template.displayCompanyInfo.helpers({
  	 	'allcompanyInformation' : function() {
    		return CompanySettings.find({'companyId':101});
		},
	});

	Template.displayCompanyLocations.helpers({
  	 	'allILocationsnformation' : function() {
     		return CompanySettings.findOne({'companyId':101});
		},

		'allHeadLocationsinformation' : function() {
  	 		var CSObject = 	CompanySettings.findOne({'companyId':101});
  	 		if(CSObject){
	 			 var mainLocation = {
	   			 'mainLocation': CSObject.companyLocationsInfo[0].mainLocation,
	   			}
	  		}else{
	  			var mainLocation = {
	   			 'mainLocation':'none',
	   			}
	  		}
	  		return mainLocation;
  	 	},
  	 	'isSelectedLocation':function(mainLocation){
  	 		return this.mainLocation == mainLocation;
  	 	}

		
	});
	Template.dispalyBankDetails.helpers({
  	  	'allBankDetailsInformation' : function() {
    		return CompanySettings.find({'companyId':101});
		},
	});

	Template.displayTaxDetails.helpers({
  	  'allTaxSettings' : function() {
    		return CompanySettings.find({'companyId':101});
		},
	});