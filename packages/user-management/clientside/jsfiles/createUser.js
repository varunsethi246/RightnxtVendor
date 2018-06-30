import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';
import { CheckedField } from '../api/checklist.js';


Meteor.subscribe('signUpConfig');

Template.createUser.onCreated(function(){
  Meteor.subscribe('signUpConfig');
});

Template.createUser.helpers({


   signUpConfig : function(){
    var array = [];
    var presentFields = CheckedField.findOne({});
    if(presentFields){
      
      var fieldsCount = presentFields.signUpConfig.length;
      // console.log(fieldsCount);
      for(i=0;i<fieldsCount;i++){
        array.push({
          'fieldName' :  presentFields.signUpConfig[i].fieldName,
          'display' : presentFields.signUpConfig[i].display,
        });
     } //end of for loop
     return array;
   } //end of if
    
   },

    fieldNameIs: function(FN) {
      return this.fieldName === FN;
    },

    displayIs: function(DS) {
      return this.display === DS;
    },

});


Template.createUser.events({


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


        var formValues = {
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
                    deliveryAdd : [],
                    mobNumber   : mobNumberVar,
                    alterNumber : alterNumberVar,
                    displayPicture        :  displayPicture,
                    // signupConfirmPassword : signupConfirmPasswordVar,
                    status      :  'Active',
                    createdOn   :  new Date(),
                  }          
        }


        Meteor.call('createUserByAdmin', formValues, function(error,result) {
         if (error) {
            console.log('Error: ' + error.reason);
         } 
         if(result) {
            // console.log('Successful-result:'+result);
            // console.log('result : ' + result);
            if(result == 'emailIdExist'){
              Bert.alert( 'Email Address already registered', 'danger' );
            }else{

              var newID = result;
              Bert.alert( 'User Created!', 'success' );
              // console.log('newID:'+Meteor.userId());
              roleToAdd = CheckedField.findOne({});
              // console.log('roleToAdd : ' + roleToAdd.defaultRoleToUser);
              if(roleToAdd){
                // var defaultRoleconfig = 'Staff';
                var defaultRoleconfig = roleToAdd.defaultRoleToUser;
                Meteor.call('addRoles', newID , defaultRoleconfig);              
              }

              Meteor.call('createUserByAdminSetEmailToTrue', newID); 


                if(event.target.companyDomain){
                  event.target.companyDomain.value ="";
                }

                if(event.target.salutation){
                  event.target.salutation.value ="";
                }

                if(event.target.lastName){
                  event.target.lastName.value ="";
                }

                if(event.target.firstName){
                  event.target.firstName.value ="";
                }

                if(event.target.signupEmail){
                  event.target.signupEmail.value ="";
                }

                if(event.target.userName){
                  event.target.userName.value ="";
                }

                if(event.target.signGender){
                  event.target.signGender.value ="";
                }

                if(event.target.homeAdd){
                 event.target.homeAdd.value ="";
                }

                if(event.target.city){
                  event.target.city.value ="";
                }

                if(event.target.state){
                  event.target.state.value ="";
                }

                if(event.target.zip){
                  event.target.zip.value ="";
                }

                if(event.target.country){
                  event.target.country.value ="";
                }

                if(event.target.mobNumber){
                  event.target.mobNumber.value ="";
                }

                if(event.target.alterNumber){
                  event.target.alterNumber.value ="";
                }

                if(event.target.signupPassword){
                  event.target.signupPassword.value ="";
                }

                if(event.target.signupConfirmPassword){
                  event.target.signupConfirmPassword.value ="";
                }

                if(event.target.companyName){
                  event.target.companyName.value ="";
                }             
            }

         }
      });





    return false;
    } //end of submit
  }); //end of events



