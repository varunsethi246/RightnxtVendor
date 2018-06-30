import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';
import { CheckedField } from '../api/checklist.js';


Meteor.subscribe('signUpConfig');

Template.UMsignup.onCreated(function(){
  Meteor.subscribe('signUpConfig');
});

Template.UMsignup.helpers({

   signUpConfig1 : function(){

    const configVar = CheckedField.find({}).count();

    if(configVar){
      
      if(configVar > 0 ){
          // console.log('Show Signupform');
          return CheckedField.findOne({});

        }else{
          // console.log('Null Collection');
          FlowRouter.go('/UMonetimeSignup');
        }
    }
   
   },

   signUpConfig : function(){
    var array = [];
    var presentFields = CheckedField.findOne({});
    // if(presentFields){
      
      var fieldsCount = presentFields.signUpConfig.length;
      // console.log(fieldsCount);
      for(i=0;i<fieldsCount;i++){
        array.push({
          'fieldName' :  presentFields.signUpConfig[i].fieldName,
          'display' : presentFields.signUpConfig[i].display,
        });
     } //end of for loop
   // } //end of if
    return array;
   },

    fieldNameIs: function(FN) {
      return this.fieldName === FN;
    },

    displayIs: function(DS) {
      return this.display === DS;
    },

});


Template.UMsignup.events({


'change .js-browseImg': function(event,Template){
    event.preventDefault();
    // console.log('In on change');
    var file = event.target.files[0];  //assuming u have only one file
    var render = new FileReader(); //this works only in html5
    render.onload =function(event){
       fileData = render.result;
      // var buffer = new Unit8Array(result);
      // console.log('This is my file:'+fileData); 
    };
    render.readAsDataURL(file);
  },


    'submit form' : function(event) {

      event.preventDefault();

      var companyDomainExist = '';
      var salutationExist = '';
      var lastNameExist = '';
      var firstNameExist = '';
      var signupEmailExist = '';
      var userNameExist = '';
      var signGenderExist = '';
      var homeAddExist = '';
      var cityExist = '';
      var stateExist = '';
      var zipExist = '';
      var countryExist = '';
      var mobNumberExist = '';
      var alterNumberExist = '';
      var signupPasswordExist = '';
      var signupConfirmPasswordExist = '';
      var companyNameExist = '';
      var newzLetterExist = '';
      var fileDataExist = '';

        if(!window.fileData){fileData = '';}

        if(event.target.companyDomain){
          companyDomainExist = event.target.companyDomain.value;
        }

        if(event.target.salutation){
          salutationExist = event.target.salutation.value;
        }

        if(event.target.lastName){
          lastNameExist = event.target.lastName.value;
        }

        if(event.target.firstName){
          firstNameExist = event.target.firstName.value;
        }

        if(event.target.signupEmail){
          signupEmailExist = event.target.signupEmail.value;
        }

        if(event.target.userName){
          userNameExist = event.target.userName.value;
        }

        if(event.target.signGender){
          signGenderExist = event.target.signGender.value;
        }

        if(event.target.homeAdd){
          homeAddExist = event.target.homeAdd.value;
        }

        if(event.target.city){
          cityExist = event.target.city.value;
        }

        if(event.target.state){
          stateExist = event.target.state.value;
        }

        if(event.target.zip){
          zipExist = event.target.zip.value;
        }

        if(event.target.country){
          countryExist = event.target.country.value;
        }

        if(event.target.mobNumber){
          mobNumberExist = event.target.mobNumber.value;
        }

        if(event.target.alterNumber){
          alterNumberExist = event.target.alterNumber.value;
        }

        if(event.target.signupPassword){
          signupPasswordExist = event.target.signupPassword.value;
        }

        if(event.target.signupConfirmPassword){
          signupConfirmPasswordExist = event.target.signupConfirmPassword.value;
        }

        if(event.target.companyName){
          companyNameExist = event.target.companyName.value;
        }

        if(event.target.newzLetter){
          if(event.target.newzLetter.checked){
            newzLetterExist = 'yes'
          }else{
            newzLetterExist = 'No'
          }
        }

        if(fileData){
          fileDataExist = fileData;
        }

        var companyDomainVar         = companyDomainExist;
        var salutationVar            = salutationExist;
        var lastNameVar              = lastNameExist;
        var firstNameVar             = firstNameExist;
        var emailVar                 = signupEmailExist;
        var userNameVar              = userNameExist;
        var signGenderVar            = signGenderExist;
        var homeAddVar               = homeAddExist;
        var cityVar                  = cityExist;
        var stateVar                 = stateExist;
        var zipVar                   = zipExist;
        var countryVar               = countryExist;
        var mobNumberVar             = mobNumberExist;
        var alterNumberVar           = alterNumberExist;
        var passwordVar              = signupPasswordExist;
        var displayPicture           = fileDataExist;
        var signupConfirmPasswordVar = signupConfirmPasswordExist;
        var companyNameVar           = companyNameExist;
        var newzLetterVar            = newzLetterExist;



   //Check password is at least 6 chars long
    var isValidPassword = function(passwordVar, signupConfirmPasswordVar) {
       if (passwordVar === signupConfirmPasswordVar) {
        console.log('passwordVar.length'+ passwordVar.length >= 6 ? true : false);
         return passwordVar.length >= 6 ? true : false;
       } else {
         return swal({
            title: 'Passwords dont match',
            text: 'Please try again',
            showConfirmButton: true,
            type: 'error'
         }); //End of error swal
       } //End of else
     }
    // If validation passes, supply the appropriate fields to the
    // Accounts.createUser function.
    if (isValidPassword(passwordVar, signupConfirmPasswordVar)) { 

        newUserId = Accounts.createUser({
          username    : userNameVar,
          email       : emailVar,
          password    : passwordVar,
          profile : {   
                    companyDomain   : companyDomainVar,
                    companyName   : companyNameVar,  
                    salutation  : salutationVar, 
                    firstName   : firstNameVar,
                    lastName    : lastNameVar,
                    signGender  : signGenderVar,
                    homeAdd     : homeAddVar,
                    city        : cityVar,
                    state       : stateVar,
                    country     : countryVar, 
                    zip         : zipVar,
                    deliveryAdd : [{
                                    name : firstNameVar+" "+lastNameVar,
                                    email : emailVar,
                                    houseNo : homeAddVar,
                                    street : "",
                                    landmark : "",
                                    pin : zipVar,
                                    city : cityVar,
                                    state : stateVar,
                                    mob : mobNumberVar,                     
                    }],
                    mobNumber   : mobNumberVar,
                    alterNumber : alterNumberVar,
                    newzLetterSubscription : newzLetterVar,
                    displayPicture        :  displayPicture,
                    // signupConfirmPassword : signupConfirmPasswordVar,
                    status      :  'Active',
                    createdOn   :  new Date(),
                  }
      }, function(error,result) {
         if (error) {
            // sAlert.error(error.reason, configOverwrite);
            console.log('Error: ' + error.reason);
         } else {
            // console.log('Successful-result:'+result);
            // console.log(Meteor.userId());
            var newID = Meteor.userId();
            // console.log('newID:'+Meteor.userId());
            roleToAdd = CheckedField.findOne({});
            // console.log('roleToAdd : ' + roleToAdd.defaultRoleToUser);
            var defaultRoleconfig = roleToAdd.defaultRoleToUser;
            Meteor.call('addRoles', newID , defaultRoleconfig);

            // Meteor.call( 'sendVerificationLink', ( error, response ) => {
            //   if ( error ) {
            //     Bert.alert( error.reason, 'danger' );
            //   } else {
            //     Bert.alert( 'Your Email is sent. Please check your email inbox!', 'success' );
            //   }
            // });
            // Meteor.logout();
            $('.modal-backdrop').remove();   
            FlowRouter.go("/");
            // window.location.reload();
            // $('.modal-backdrop').hide();

         }
      }); //End of User Creation
    }else{
                return swal({
                    title: "password should be at least 6 characters long",
                    text: "Please try again or create an account",
                    timer: 1700,
                    showConfirmButton: false,
                    type: "error"
                });
            } // End of else


    // event.target.salutation.value ='';
    // event.target.lastName.value ='';
    // event.target.firstName.value =''; 
    // event.target.signupEmail.value ='';
    // event.target.userName.value ='';
    // event.target.signGender.value ='';
    // event.target.homeAdd.value ='';
    // event.target.city.value ='';
    // event.target.state.value ='';
    // event.target.zip.value ='';
    // event.target.country.value ='';
    // event.target.mobNumber.value ='';
    // event.target.alterNumber.value ='';
    // event.target.signupPassword.value ='';
    // event.target.displayPicture.value ='';
    // event.target.signupConfirmPassword.value ='';  



    return false;
    } //end of submit
  }); //end of events



