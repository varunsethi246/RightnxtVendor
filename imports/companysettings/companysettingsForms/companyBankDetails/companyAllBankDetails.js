import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';

import './companyAllBankDetails.html';

import { CompanySettings } from '/imports/api/companysettingsAPI.js';
// Meteor.subscribe('companySettings'); 

	Template.companyAllBankDetails.helpers({
  		'allBankDetails' : function() {
    		return CompanySettings.find({"companyId":101});
		},
	});

	Template.companyAllBankDetails.events({
		'click .deleteBankDetails':function(event){
			event.preventDefault();
        	var bankDetails = this;
			var id = event.currentTarget.name;
			var confirm = window.confirm("Do you really want to delete this record?");

          	if(confirm){
           	 Meteor.call('removeBankDetails', bankDetails);
            
          	}

		}
	});