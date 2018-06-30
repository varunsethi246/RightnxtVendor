import './createUsers.html';
import '../commonAdmin/commonAdmin.js';

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Accounts } from 'meteor/accounts-base';
import { ConfigSettings } from '../../api/configSettingsMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';



import { State } from '../../api/masterData/stateMaster.js';
import { City } from '../../api/masterData/cityMaster.js';
import { Area } from '../../api/masterData/areaMaster.js';

// Template.createUsers.onCreated(function(){
//   Meteor.subscribe('signUpConfig');
// });


Template.createUsers.helpers({


   signUpConfig : function(){
    var array = [];

      var fieldFound = ConfigSettings.findOne({});
      // console.log('in helper');
      if(fieldFound){
         var fieldsCount = fieldFound.signUpConfig.length;
        // console.log(fieldsCount);
        for(i=0;i<fieldsCount;i++){
          array.push({
            'fieldName' : fieldFound.signUpConfig[i].fieldName,
            'display'   : fieldFound.signUpConfig[i].display,
          });
       } //end of for loop
       return array;       
      }


    
   },

    fieldNameIs: function(FN) {
      return this.fieldName === FN;
    },

    displayIs: function(DS) {
      return this.display === DS;
    },
    masterState: function () {
      var StateArray = State.find({'status':'active'}).fetch();
      // Session.set('statesession',state);
      // console.log(StateArray);
      return StateArray;
    },
     masterCity: function () {
       if(Session.get('stateValues')){
        var stateValue = Session.get('stateValues');
        var data = City.find({"state":stateValue,'status':'active'}).fetch();
      }
      // console.log(data);
      return data;
    },
    masterZipcode: function () {
       if(Session.get('cityValues')){
        var cityValues = Session.get('cityValues');
        var areadata = Area.find({"city": cityValues,'status':'active'});
      }
      // console.log(areadata);
      return areadata;
    },

});


Template.createUsers.events({
  'keydown .mobileCreate': function(e){
      if ($.inArray(e.keyCode, [8, 9, 27, 13]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true))||
            (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true))||
            (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true))||
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode===190 || e.keyCode===46 || e.keyCode===110)) {
            e.preventDefault();
        }
   },
  'focusout .validEmail':function(event){
      var value = $(event.target).val();
      // console.log('value: '+value);
      var userObj = Meteor.users.find({}).fetch();
      // console.log('userObj: ', userObj);

      if(userObj){
        for (var i = 0; i < userObj.length; i++) {
          if(userObj[i].emails){
            var verify = userObj[i].emails[0].verified; 
            if(verify == true){
              var emailVal = userObj[i].emails[0].address;
            }
          // console.log("emailVal: "+userObj[i].emails[0].address);

            if(value == emailVal){
              $(' .wrongEmailSpan').text("Email already exists.");
              $('.wrongEmailSpan').addClass('passwordWrongWar');
            }else{
              $(' .wrongEmailSpan').text("");
              $('.removeEmail').removeClass('wrongEmailSpan');
              $('.wrongEmailSpan').removeClass('passwordWrongWar');

            }
          }
        }
      }
    },

  'change #statesOne':function(event){
      event.preventDefault();
      var stateValues = event.currentTarget.value;
      Session.set('stateValues', stateValues);
    },
  'change #cityOne':function(event){
    event.preventDefault();
    var cityValues = event.currentTarget.value;
    Session.set('cityValues', cityValues);
  },

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

        // if(event.target.userName){
        //   userNameExist = event.target.userName.value;
        // }

        // if(event.target.signGender){
        //   signGenderExist = event.target.signGender.value;
        // }

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

        // if(event.target.signupConfirmPassword){
        //   signupConfirmPasswordExist = event.target.signupConfirmPassword.value;
        // }

        // if(event.target.companyName){
        //   companyNameExist = event.target.companyName.value;
        // }

        // if(fileData){
          fileDataExist = fileData;
        // }

        var companyDomainVar         = companyDomainExist;
        var salutationVar            = salutationExist;
        var lastNameVar              = lastNameExist;
        var firstNameVar             = firstNameExist;
        var emailVar                 = signupEmailExist;
        // var userNameVar              = userNameExist;
        // var signGenderVar            = signGenderExist;
        var homeAddVar               = homeAddExist;
        var cityVar                  = cityExist;
        var stateVar                 = stateExist;
        var zipVar                   = zipExist;
        var countryVar               = countryExist;
        var mobNumberVar             = mobNumberExist;
        var alterNumberVar           = alterNumberExist;
        var passwordVar              = signupPasswordExist;
        var displayPicture           = fileDataExist;
        // var signupConfirmPasswordVar = signupConfirmPasswordExist;
        // var companyNameVar           = companyNameExist;


        var formValues = {
          // username    : userNameVar,
          email       : emailVar,
          password    : passwordVar,
          profile : {   
                    companyDomain   : companyDomainVar,
                    // companyName   : companyNameVar,  
                    salutation  : salutationVar, 
                    firstName   : firstNameVar,
                    lastName    : lastNameVar,
                    // signGender  : signGenderVar,
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
            // console.log('Error: ' + error.reason);
         } 
         if(result) {
            // console.log('Successful-result:'+result);
            // console.log('result : ' + result);
            if(result == 'emailIdExist'){
              Bert.alert( 'Email Address already registered', 'danger' );
            }else{

              var newID = result;
              Bert.alert( 'Staff Created!', 'success' );
              // console.log('newID:'+Meteor.userId());
              
              var roleToAdd = ConfigSettings.findOne({});
              // console.log('roleToAdd : ' + roleToAdd.defaultRoleToUser);
              if(roleToAdd){
                var defaultRoleconfig = roleToAdd.defaultRoleToUser;
                // var defaultRoleconfig = 'Staff';
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



Template.createUsers.onRendered(function(){
  
    // Session.set('stateValues', '');
    // Session.set('cityValues', '');

  $.validator.addMethod("regexx", function(value, element, regexpr) {          
      return regexpr.test(value);
  }, "Invalid Pincode Number.");
   // var messages = {
  //       'firstNameRequired': "Please enter your first name."
  //   };
   $("#createRequired").validate({
    rules: {
          area: {
              required: true,
              Areavali: /^[A-Za-z0-9\s\.\-\/]{3,30}$/,
          },
          zipcode: {
              required: true,
              regexx: /^\d{6}(?:[-\s]\d{6})?$/,
          },
          state:{
            required:true,
          },
          city:{
            required:true,
          },
          firstName:{
            required:true,
          },
          lastName:{
            required:true,
          }, 
          signupEmail:{
            required:true,
          }, 
          homeAdd:{
            required:false,
          },
          mobNumber:{
            required:true,
          },
          alterNumber:{
            required:false,
          },
          zip:{
            required:true,
          }, 

      },
      errorPlacement: function(error, element) {
            if (element.attr("name") == "state"){
              error.insertAfter("#stateCreate");
            }
            if (element.attr("name") == "city"){
              error.insertAfter("#cityCreate");
            }
            if (element.attr("name") == "firstName"){
              error.insertAfter("#firstnameCreate");
            }
            if (element.attr("name") == "lastName"){
              error.insertAfter("#lastNameCreate");
            }
            if (element.attr("name") == "signupEmail"){
              error.insertAfter("#emailCreate");
            }
            if (element.attr("name") == "homeAdd"){
              error.insertAfter("#commentCreate");
            }
            if (element.attr("name") == "mobNumber"){
              error.insertAfter("#mobileCreate");
            }
            if (element.attr("name") == "alterNumber"){
              error.insertAfter("#alterMobCreate");
            }
            if (element.attr("name") == "zip"){
              error.insertAfter("#zipCreate");
            }

        }
      });

});



// $(".addNewJobForm").validate({
//     rules: {
//           jobTitle: {
//               required: true,
//           },
//           date: {
//             required: true,
//           },
//       },
//       errorPlacement: function(error, element) {
//         if (element.attr("name") == "jobTitle"){
//           error.insertAfter("#title");
//         }
//         if (element.attr("name") == "date"){
//           error.insertAfter("#dateInput");
//         }
//     }
//   });
//    $("body").scrollTop(0);
// });

createUsersForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'createUsers'});
}

export { createUsersForm };