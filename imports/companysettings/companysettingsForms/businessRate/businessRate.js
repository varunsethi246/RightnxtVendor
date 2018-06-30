import './businessRate.html';

import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';


import { CompanySettings } from '/imports/api/companysettingsAPI.js';


	Template.businessRate.helpers({
  		'treandingBusinessDetails' :function() {
			var CompanySettingData = CompanySettings.findOne({'companyId':101});
			var rateArray = [];
			if(CompanySettingData){
				if(CompanySettingData.BusinessRates[0]){
					var monthlyRate = CompanySettingData.BusinessRates[0].monthlyRate;
					var categoryRate = CompanySettingData.BusinessRates[0].categoryRate;
					var areaRate = CompanySettingData.BusinessRates[0].areaRate;
					rateArray.push({
						'monthlyCharge': monthlyRate,
						'categoryCharge': categoryRate,
						'areaCharge' : areaRate,
					});
			    }
			}//CompanySettingData
			return rateArray;
		},
	});


	Template.businessRate.events({
		'click .deleteRate':function(event){
			event.preventDefault();
        	var eventDetails = this;
			var id = event.currentTarget.name;
			var confirm = window.confirm("Do you really want to delete this record?");

          	if(confirm){
           	 Meteor.call('removeBusinessRate');
            
          	}

		},

		'submit .rateInfo':function(event){
			event.preventDefault();
			eventInfoFormValue = {
		        monthlyRate  : $("input#monthlyRate").val(),
		        categoryRate : $("input#categoryRate").val(),
		        areaRate     : $("input#areaRate").val(),
		    }

		    Meteor.call('insertBusinessRate', eventInfoFormValue,function(err,result){
		    	if(err){
		    		console.log(err);
		    	}else{
		    		console.log('Added');
		    		$("input#monthlyRate").val('');
		        	$("input#categoryRate").val('');
		        	$("input#areaRate").val('');
		    	}
		    });
		}
	});
