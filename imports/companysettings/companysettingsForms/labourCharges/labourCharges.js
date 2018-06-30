
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import './labourCharges.html';

Template.labourCharges.helpers({
	'editlabourSettings': function (){
		return Session.get('editLabourSettings');
	},
});

Template.labourCharges.events({
	'click .btnUpdatLabourChargeDetails': function(event){
	    event.preventDefault();
	    // console.log("btnupdate");
	    labourChargesDetailsFormValue = {
	        labourChargeCategory : $("input#labourChargeCategory").val(),
	        labourChargeRate     : $("input#labourChargeRate").val(),
	    }

	    Meteor.call('updateLabourChargeSettings', labourChargesDetailsFormValue);
	   
	   },
	   
   // 'click .addLabourCat': function(event){
   //  $('.moreLabourCat').toggleClass('fa fa-caret-right');
   //  $('.moreLabourCat').toggleClass('fa fa-caret-down');
   //  $('.labourCategoryFormWrapper').slideToggle();
   // 	}
});
