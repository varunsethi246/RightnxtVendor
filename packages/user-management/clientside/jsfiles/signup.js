import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Accounts } from 'meteor/accounts-base';

// import './signup.html';
// import './mainLayout.html';

Template.signup.events({


'change .js-browseImg': function(event,Template){
    event.preventDefault();
    console.log('In on change');
    var file = event.target.files[0];  //assuming u have only one file
    var render = new FileReader(); //this works only in html5
    render.onload =function(event){
       fileData = render.result;
      // var buffer = new Unit8Array(result);
      console.log('This is my file:'+fileData); 
    };
    render.readAsDataURL(file);
  },


    'submit form' : function(event) {

      event.preventDefault();

        if(!window.fileData){fileData = '';}

        var salutationVar   = event.target.salutation.value;
        var lastNameVar     = event.target.lastName.value;
        var firstNameVar    = event.target.firstName.value;
        var emailVar        = event.target.signupEmail.value;
        var userNameVar     = event.target.userName.value;
        var signGenderVar   = event.target.signGender.value;
        var homeAddVar      = event.target.homeAdd.value;
        var cityVar         = event.target.city.value;
        var stateVar        = event.target.state.value;
        var zipVar          = event.target.zip.value;
        var countryVar      = event.target.country.value;
        var mobNumberVar    = event.target.mobNumber.value;
        var alterNumberVar  = event.target.alterNumber.value;
        var passwordVar     = event.target.signupPassword.value;
        var displayPicture  = fileData;
        var signupConfirmPasswordVar = event.target.signupConfirmPassword.value;



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
          email       : emailVar,
          password    : passwordVar,
          profile: {      
                    firstName   : firstNameVar,
                    userName    : userNameVar,
                    signGender  : signGenderVar,
                    homeAdd     : homeAddVar,
                    city        : cityVar,
                    state       : stateVar,
                    zip         : zipVar,
                    country     : countryVar, 
                    mobNumber   : mobNumberVar,
                    alterNumber : alterNumberVar,
                    salutation  : salutationVar,
                    lastName    : lastNameVar,
                    displayPicture        :  displayPicture,
                    signupConfirmPassword : signupConfirmPasswordVar,
                    status      :  'Active',
                    createdOn   :  new Date(),
                  }
      }, function(error,result) {
         if (error) {
            console.log('Error: ' + error.reason);
         } else {
            console.log('Successful-result:'+result);
            console.log(Meteor.userId());
            var newID = Meteor.userId();
            console.log('newID:'+Meteor.userId());
            Meteor.call('addRoles', newID);
            FlowRouter.go("/um-Home");
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



    //                event.target.salutation.value ='';
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



