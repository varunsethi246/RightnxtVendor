import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';

import './allTaxes.html';

import { CompanySettings } from '/imports/api/companysettingsAPI.js';

// Meteor.subscribe('companySettings'); 

	Template.allTaxes.helpers({
  		'taxSettingsDetails' :function() {
			return CompanySettings.findOne({'companyId':101});
		},
	});


	Template.allTaxes.events({
		'click .deletetaxSettings':function(event){
			event.preventDefault();
        	var taxDetails = this;
			var id = event.currentTarget.name;
            
			var confirm = window.confirm("Do you really want to delete this record?");

          	if(confirm){
           	 Meteor.call('removeTaxDetails', taxDetails);
            
          	}

		},

		'click .edittaxSettings': function(e) {
        e.preventDefault();
        $('.HRMSTextbox').css({
            'background-color': 'transparent',
            'color': '#000',
            'font-weight':'bold',
            'font-size': '15px'
        });
        // var locationObj = CompanySettings.find({'responsiblePerson':'Admin'});
        var rule = this;
        var targetedid = e.currentTarget.id;
        // console.log(targetedid);
        var id = {id : e.currentTarget.name};
        // console.log("id:"+id);
        // var index = id.split('*');
        // console.log("index"+index);
        FlowRouter.setQueryParams(id);
        $('input[name="taxType"]').val(this.taxType);
        $('input[name="applicableTax"]').val(this.applicableTax);
        $('input[name="effectiveFrom"]').val(this.effectiveFrom);
        
    
        Session.set('targetedid',targetedid);
        Session.set('edittaxSettings',true);        
      
    },
	});