import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';

import './allLocations.html';

import { CompanySettings } from '/imports/api/companysettingsAPI.js';
// Meteor.subscribe('companySettings'); 

	Template.allLocations.helpers({
  		'allLocationsinfo' : function() {
    		return CompanySettings.find({'companyId':101});
		},

        'allLocationsinformationhead' : function() {
            var CSObject = CompanySettings.findOne({'companyId':101});
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


	Template.allLocations.events({
		'click .deleteLocations':function(event){
			event.preventDefault();
        	var selectedLocation = this;
			var id = event.currentTarget.name;
			// console.log(id);
			// console.log(selectedLocation);
			var confirm = window.confirm("Do you really want to delete this record?");

          	if(confirm){
           	 Meteor.call('removeallCompanyLocations', selectedLocation);
            
          	}

		},

		'click .editLocations': function(e) {
        e.preventDefault();
        // var locationObj = CompanySettings.find({'companyId':'101'});
	        $('.HRMSTextbox').css({
	        'background-color': 'transparent',
	        'color': '#000',
	        'font-weight':'bold',
	        'font-size': '15px'
    	});
        var rule = this;
        var address = rule.companyAddress;
        var id = {id : e.currentTarget.name};

        FlowRouter.setQueryParams(id);
        $('input[name="companyNewLocation"]').val(this.companyLocation);
        $('input[name="companyNewAddress"]').val(this.companyAddress);
        $('input[name="companyPincode"]').val(this.companyPincode);
        $('input[name="companyCity"]').val(this.companyCity);
        $('input[name="companyState"]').val(this.companyState);
        $('input[name="companyCountry"]').val(this.companyCountry);
        
        Session.set('editLocation',true);        
        Session.set('companyAddress',address);        
    }



		
	});
