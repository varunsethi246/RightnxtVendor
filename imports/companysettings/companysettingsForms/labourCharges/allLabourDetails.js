import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';

import './allLabourDetails.html';

import { CompanySettings } from '/imports/api/companysettingsAPI.js';

// Meteor.subscribe('companySettings'); 

	Template.allLabourDetails.helpers({
  		'labourDetails' :function() {
			return CompanySettings.findOne({'companyId':101});
		},
	});


	Template.allLabourDetails.events({
		'click .deleteLabourSettings':function(event){
			event.preventDefault();
        	var labourChargeDetails = this;
			var id = event.currentTarget.name;
			var confirm = window.confirm("Do you really want to delete this record?");

          	if(confirm){
           	 Meteor.call('removeLabourChargesDetails', labourChargeDetails);
            
          	}

		},


		'click .editLabourSettings': function(e) {
	        e.preventDefault();
	        $('.HRMSTextbox').css({
	            'background-color': 'transparent',
	            'color': '#000',
	            'font-weight':'bold',
	            'font-size': '15px'
	        });
	        // var locationObj = CompanySettings.find({'responsiblePerson':'Admin'});
	        var rule = this;
	        var id = {id : e.currentTarget.name};

	        FlowRouter.setQueryParams(id);       
	        $('input[name="labourChargeCategory"]').val(this.labourChargeCategory);
	        $('input[name="labourChargeRate"]').val(this.labourChargeRate);
	        
	        
	    
	        
	        Session.set('editLabourSettings',true);        
	      
		},
	});