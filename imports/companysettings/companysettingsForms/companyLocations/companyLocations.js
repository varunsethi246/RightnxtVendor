import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import './companyLocations.html';


Template.companyLocations.helpers({
	'editLocation': function (){
		return Session.get('editLocation');
	}

});

Template.companyLocations.events({

  'click .btnUpdate': function(event){
    event.preventDefault();
   
    companyLocationsFormValue = {
        companyLocation  : $("input#companyNewLocation").val(),
        companyAddress   : $("input#companyNewAddress").val(),
        companyPincode   : $("input#companyPincode").val(),
        companyCity      : $("select#companyCity").val(),
        companyState     : $("select#companyState").val(),
        companyCountry   : $("select#companyCountry").val()
      

    }
    

    Meteor.call('updateCompanyLocations', companyLocationsFormValue);
   },

   'click .faqStyle': function(event){
        $('.moreLocations').toggleClass('fa fa-caret-right');
        $('.moreLocations').toggleClass('fa fa-caret-down');
        $('.locationFormWrapper').slideToggle();

   }
    
});