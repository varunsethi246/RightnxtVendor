import './companysettingsFormsCarousel.html';
import '../companysettingsForms/companyInfo/companyInfo.js';
import '../companysettingsForms/companyLocations/companyLocations.js';
import '../companysettingsForms/companyLocations/allLocations.js';
import '../companysettingsForms/companyBankDetails/companyBankDetails.js';
import '../companysettingsForms/companyBankDetails/companyAllBankDetails.js';
import '../companysettingsForms/generalSettings/generalSettings.js';
import '../companysettingsForms/taxSettings/taxSettings.js';
import '../companysettingsForms/taxSettings/allTaxes.js';
import '../companysettingsForms/otherSettings/otherSettings.js';
import '../companysettingsForms/finalSubmit/finalSubmit.js';
import './errorMessageModal.html';
import '../companysettingsForms/labourCharges/labourCharges.js';
import '../companysettingsForms/labourCharges/allLabourDetails.js';
import '../companysettingsForms/businessRate/businessRate.js';

import { Session } from 'meteor/session';

import { CompanySettings } from '/imports/api/companysettingsAPI.js';

// Meteor.subscribe('companySettings');


Template.companySettings.onRendered(function(){
// get the carousel


var $carousel = $(".carousel");

// pause it
$carousel.carousel('pause');

// get right & left controls
var $rightControl = $carousel.find(".nextBtn");
var $leftControl = $carousel.find(".prevBtn");

// hide the left control (first slide)
	$leftControl.hide();


// get 'slid' event (slide changed)
$carousel.on('slid.bs.carousel', function() {
	
    
    // get active slide
    var $active = $carousel.find(".item.active");
  
    
    // if the last slide,
    if (!$active.next().length) {
    	  // console.log("!$active true");
        // hide the right control

        $rightControl.fadeOut();
    // if not,
    } else {
        // show the right control
        $rightControl.fadeIn();
    }
    
    // if the first slide,
    if (!$active.prev().length) {
        // hide the left control
        $leftControl.fadeOut();
    // if not,
    } else {
        // show it
        $leftControl.fadeIn();
    }
	});
});

Template.companysettingsHeader.events({

    'click .editbtn': function(e) {
        e.preventDefault();
        // var locationObj = CompanySettings.find({'companyId':'101'});
            $('form .HRMSTextbox').css({
            'background-color': 'transparent',
            'color': '#000',
            'font-weight':'bold',
            'font-size': '15px'
        });
    }
	
});
Template.companysettingsformCarousel.helpers({
    'companyCount' : function() {
            return CompanySettings.find({'companyId':101}).count();
        },

    'formData':function(){
        var companyData1 = CompanySettings.findOne({'companyId':101});
        if(companyData1){
            var companyData = {
                companyName          : companyData1.companyName,
                companyContactNumber : companyData1.companyContactNumber,
                companyEmail         : companyData1.companyEmail,
                companyCity          : companyData1.companyLocationsInfo[0].companyCity,
                companyPincode       : companyData1.companyLocationsInfo[0].companyPincode,
                companyAddress       : companyData1.companyLocationsInfo[0].companyAddress,

            };            
        }else{
            var companyData = {
               companyName : '',
               companyContactNumber : '',
               companyEmail : '',
               companyCity : '',
               companyPincode : '',
               companyAddress : '',
            };

        }

        return companyData;
    },


    themeProcessConfig : function(){
        var themeSettings = CompanySettings.findOne({"companyId" : 101});
        // console.log(JSON.stringify({themeSettings},null,4));

        if(themeSettings){        
          var themeConfig = {
            'selectedProcess': themeSettings.generalSettings.processType,
          }
        }else{
          var themeConfig = {
            'selectedProcess': 'none',
          }          
          // FlowRouter.go('/themeSettings');
        }
        // console.log("themeConfig"+themeConfig);
        return themeConfig;
    },

    isSelectedProcess : function(processName){
      return this.selectedProcess == processName;
    },

    'companyAddressDetails':function(){
       var selectedAddress = Session.get('companyAddress')
       var companyData1 = CompanySettings.find({'companyId':101, 'companyLocationsInfo.companyAddress':selectedAddress});
      },

    'otherSettingData': function(){
        var companyData1 = CompanySettings.findOne({'companyId':101});
        if(companyData1){
            // var rates = {
            //    ratePerOffer      : companyData1.rates[0].ratePerOffer,
            //    ratePerAdvertise  : companyData1.rates[0].ratePerAdvertise,
            //    ratePerBanner     : companyData1.rates[0].ratePerBanner,
            // };
            var rates = companyData1.rates;
        }else{
            var rates = {
               ratePerOffer     : '',
               ratePerAdvertise : '',
               ratePerBanner    : '',
            };
        }
        return rates;        
    }
});

Template.companysettingsformCarousel.events({
    'mouseenter .l1':function(e){
        $('[data-toggle="tooltip"]').tooltip();   
    }
});





