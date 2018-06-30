import './companysettingsModal.html';
import './companysettingsFormsCarousel.js';
import '../companysettingsForms/companyLocations/allLocations.js';
import '../companysettingsForms/taxSettings/allTaxes.js';
import '../companysettingsForms/companyBankDetails/companyAllBankDetails.js';
import '../companysettingsForms/labourCharges/allLabourDetails.js';
import '../companysettingsForms/generateEvents/generateEvent.js';
import '../companysettingsForms/otherSettings/otherSettings.js';




import './errorMessageModal.html';
import { Session } from 'meteor/session';
// import { Session } from 'meteor/session';
import { CompanySettings } from '/imports/api/companysettingsAPI.js';
import { TempLogoImage } from '/imports/api/companysettingsAPI.js';

// Meteor.subscribe('tempLogoImage');



function toTitleCase(str)
{
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1);});
}

Template.companysettingsformCarousel.events({
  
  'click .nextBtn':function(event) {
   	  
  // Prevent default browser form submit
  event.preventDefault();
  //Create an Array to pass to Method
 
  var formClass = $(event.target).parent().siblings('.carousel-inner').children('.active').find("form").attr('class');
  var formId = $(event.target).parent().siblings('.carousel-inner').children('.active').find("form").attr('id');
  // if(formClass == 'finalSubmit'){
  //   $carousel.find(".nextBtn").hide();
  // }
// checkitem(); 

/*------Code check empty fields----*/
//   var flag=true;

//   $("#"+formId).find(':input').each(function(){
//   // console.log($(this).val());     
//   if($(this).val() === ""){
//      // alert("Please filled empty field");
//      // $("#errormodal").modal("show");
//     flag=false;
//     return flag;
//   }
// });
//   if(!flag)
//     return false;

//Create an Array to pass to Method

  // var image = TempLogoImage.findOne({});
  // var logoFilename = image.logoFilename;
  // var companyLogo= image.tempLogoImg;  
  
  var formValuesArray = formClass+'FormValue' ;
   switch(formClass) {

    case 'companyInfo':

          window[formValuesArray] ={

              companyName  		     : $("input#companyName").val(),
              companyContactNumber : $("input#companyContactNumber").val(),
              companyEmail         : $("input#companyEmail").val(),
              // logoFilename         : logoFilename,
               // companyLogo   		   : companyLogo,
              companyAddress       : $("input#companyAddress").val(),
              companyPincode       : $("input#companyPincode").val(),
              companyCity          : $("select#companyCity").val(),
              companyState         : $("select#companyState").val(),
              companyCountry       : $("select#companyCountry").val(),              
              
           }//close array
           break;
        case 'companyLocations':

            window[formValuesArray] = {
              companyLocation      : $("input#companyNewLocation").val(),
              companyAddress       : $("input#companyNewAddress").val(),
              companyPincode       : $("input#companyPincode").val(),
              companyCity          : $("select#companyCity").val(),
              companyState         : $("select#companyState").val(),
              companyCountry       : $("select#companyCountry").val(),

              }
              break;

        case 'companyBankDetails':
            window[formValuesArray] = {
                accHolderName : $("input#accHolderName").val(),
                bankName      : $("input#bankName").val(),
                branchName    : $("input#branchName").val(),
                accNumber     : $("input#accNumber").val(),
                ifscCode      : $("input#ifscCode").val(),
               }
               break;

        case 'generalSettings':
            window[formValuesArray] = {
               
              	shopType    : $('input[name=process1]:checked').val(),
              	processType : $('input[name="process2"]:checked').val(),
              	storeType   : $('input[name="process3"]:checked').val(),
                scaleType   : $('input[name=scaleprocess1]:checked').val(),
              }
              break;

        case 'taxSettings':
            
             window[formValuesArray] = {

                taxType       : $("select#taxType").val(),
                applicableTax : $("input#applicableTax").val(),
                effectiveFrom : $("input#effectiveFrom").val(),
              }
              
              break;
        case 'eventInfo':
            
             window[formValuesArray] = {

                eventName       : $("input#eventName").val(),
                
              }
              
              break;
        case 'labourCharges':
            
             window[formValuesArray] = {
                labourChargeCategory : $("input#labourChargeCategory").val(),
                labourChargeRate     : $("input#labourChargeRate").val(),
              }
              
              break;
              
        case 'otherSettings':
            
             window[formValuesArray] = {
                ratePerOffer         : $("input#ratePerOffer").val(),
                ratePerAdvertise     : $("input#ratePerAdvertise").val(),
                ratePerBanner        : $("input#ratePerBanner").val(),
              }
              
              break;
    }//close switch
    // console.log(window[formValuesArray]);
	 Meteor.call('insert'+toTitleCase(formClass), window[formValuesArray], 
              function(error, result){
                if(error){
                  console.log(error);
                }else{
                  //As logo is added to main companySettings table, we can now remove
                  //the same logo from temporary collection. 
                  // Meteor.call('tempLogoImageDelete', fileName);
                }
              }
      );
},



	
	 'click .prevBtn':function(event) {
 
      event.preventDefault();
  //Create an Array to pass to Method
      var formClass = $(event.target).parent().siblings('.carousel-inner').children('.active').find("form").attr('class');
      // console.log('formClass: ' + formClass); 
  },




  'submit .companyLocations'(event){
    event.preventDefault();
   
    companyLocationsFormValue = {
        companyLocation  : event.target.companyNewLocation.value,
        companyAddress  : event.target.companyNewAddress.value,
        companyPincode  : event.target.companyPincode.value,
        companyCity      : event.target.companyCity.value,
        companyState     : event.target.companyState.value,
        companyCountry   : event.target.companyCountry.value,
        
    }

    Meteor.call('insertCompanyLocations', companyLocationsFormValue);
 
    //Clear form
      event.target.companyNewLocation.value='';
      event.target.companyNewAddress.value='';
      event.target.companyPincode.value='';
      event.target.companyCity.value='';
      event.target.companyState.value='';
      event.target.companyCountry.value ='';
      
  },

  'submit .companyBankDetails'(event){
    event.preventDefault();
   
    companyBankDetailsFormValue = {
        accHolderName : event.target.accHolderName.value,
        bankName      : event.target.bankName.value,
        branchName    : event.target.branchName.value,
        accNumber     : event.target.accNumber.value,
        ifscCode      : event.target.ifscCode.value,
         
    }
    Meteor.call('insertCompanyBankDetails', companyBankDetailsFormValue);
 
    //Clear form
      event.target.accHolderName.value ='';
      event.target.bankName.value   ='';
      event.target.branchName.value ='';
      event.target.accNumber.value  ='';
      event.target.ifscCode.value   = '';
  },

  'submit .taxSettings'(event){
    event.preventDefault();
    taxSettingsFormValue = {
      taxType        : event.target.taxType.value,
      applicableTax  : event.target.applicableTax.value,
      effectiveFrom  : event.target.effectiveFrom.value,
       
    }
    Meteor.call('insertTaxSettings', taxSettingsFormValue);
 
    //Clear form
      event.target.taxType.value ='';
      event.target.applicableTax.value   ='';
      event.target.effectiveFrom.value ='';
      
      
   },

   'submit .eventInfo'(event){
    event.preventDefault();
    eventInfoFormValue = {
      eventName        : event.target.eventName.value,
       
    }
    Meteor.call('insertEventName', eventInfoFormValue);
 
    //Clear form
      event.target.eventName.value ='';
      
   },

   'submit .labourCharges'(event){
    event.preventDefault();
    labourChargesDetailsFormValue = {
      labourChargeCategory : event.target.labourChargeCategory.value,
      labourChargeRate     : event.target.labourChargeRate.value,
       
    }
    Meteor.call('insertLabourCharges', labourChargesDetailsFormValue);
 
    //Clear form
      event.target.labourChargeCategory.value ='';
      event.target.labourChargeRate.value   ='';
      
      
   },

   // 'submit .otherSettings'(event){
   //  event.preventDefault();
   //  otherSettingsFormValue = {
   //    ratePerOffer      : event.target.ratePerOffer.value,
   //    ratePerAdvertise  : event.target.ratePerAdvertise.value,
   //    ratePerBanner     : event.target.ratePerBanner.value,
       
   //  }
   //  Meteor.call('insertOtherSettings', otherSettingsFormValue);    
   // },
});


// checkitem : function(){
//     console.log("checkitem");
//   var $this;
//   $this = $("#formCarousel");
//   if ($("#formCarousel .carousel-inner .item:last").hasClass("active")){
    
//     flag : true;
//   }
//   return flag;
// }
//   isSelectedSlide : function(flagvalue){
//       return this.flag == flagvalue;
// },
