import { Template } from 'meteor/templating';
import { Mongo } from 'meteor/mongo';

import './generateEvent.html';

import { CompanySettings } from '/imports/api/companysettingsAPI.js';

// Meteor.subscribe('companySettings'); 

	Template.generateEvent.helpers({
  		'eventNameDetails' :function() {
			return CompanySettings.findOne({'companyId':101});
		},
	});


	Template.generateEvent.events({
		'click .deleteEvent':function(event){
			event.preventDefault();
        	var eventDetails = this;
        	// console.log("eventDetails: "+eventDetails);
			var id = event.currentTarget.name;
            // console.log("id: "+id);
			var confirm = window.confirm("Do you really want to delete this record?");

          	if(confirm){
           	 Meteor.call('removeEventDetails', eventDetails);
            
          	}

		},
	});
