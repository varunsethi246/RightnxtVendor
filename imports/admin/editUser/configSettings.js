import { Template } from 'meteor/templating';
 
import { ConfigSettings } from '../../api/configSettingsMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './configSettings.html';
import '../commonAdmin/commonAdmin.js';


Template.configSettings.onCreated(function(){
    Meteor.subscribe('userfunction');
});

Template.configSettings.helpers({
  usersconfig() {
    return Meteor.users.find({});
  },
});

Template.configSettings.events({

  'submit #checkboxForm' : function (event,template ) {
    event.preventDefault();

  if(event.target.checkboxtitle.checked){
    event.target.checkboxtitle.value = 'yes';
  }
  if(event.target.checkboxfirstName.checked){
    event.target.checkboxfirstName.value = 'yes';
  }
  if(event.target.checkboxlastName.checked){
    event.target.checkboxlastName.value = 'yes';
  }
  if(event.target.checkboxemailAddress.checked){
    event.target.checkboxemailAddress.value = 'yes';
  }
  if(event.target.checkboxuserName.checked){
    event.target.checkboxuserName.value = 'yes';
  }
  if(event.target.checkboxgender.checked){
    event.target.checkboxgender.value = 'yes';
  }
  if(event.target.checkboxpicture.checked){
    event.target.checkboxpicture.value = 'yes';
  }
  if(event.target.checkboxhomeAddress.checked){
    event.target.checkboxhomeAddress.value = 'yes';
  }
  if(event.target.checkboxcountry.checked){
    event.target.checkboxcountry.value = 'yes';//country
  }
  if(event.target.checkboxstate.checked){
    event.target.checkboxstate.value = 'yes';//state
  }
  if(event.target.checkboxcity.checked){
    event.target.checkboxcity.value = 'yes';//city
  }
  if(event.target.checkboxpin.checked){
    event.target.checkboxpin.value = 'yes';//zipcode
  }
  if(event.target.checkboxmobNum.checked){
    event.target.checkboxmobNum.value = 'yes';
  }
  if(event.target.checkboxalterMobNum.checked){
    event.target.checkboxalterMobNum.value = 'yes';
  }
  if(event.target.checkboxcompanyName.checked){
    event.target.checkboxcompanyName.value = 'yes';
  }

  if(event.target.checkboxconfirmPassword.checked){
    event.target.checkboxconfirmPassword.value = 'yes';
  }

  if(event.target.checkboxpassword.checked){
    event.target.checkboxpassword.value = 'yes';
  }

  if(event.target.checkboxNewsLetterSubscription.checked){
    event.target.checkboxNewsLetterSubscription.value = 'yes';
  }

// Default Role to user
   // const defaultRoleToUser = event.target.defaultRole.value;



// Add admin role to user   

   // const addAdminVar = event.target.addAdminRoleListDropdown.value;

   // if( addAdminVar != '-'){

   //     const activeUser = Meteor.users.findOne({ '_id' : addAdminVar});

   //     console.log ( 'failed : ' + activeUser.profile.status );

   //     if( activeUser.profile.status == 'Active'){
   //        Meteor.call('addAdminRoleToUser', addAdminVar ,
   //                  function(error, result) { 
   //                      if (error) {
   //                          console.log ( 'Add role error : ' + error ); 
   //                      } 
   //                      else {
   //                          console.log ( 'Role Added successfully' ); 
   //                      }
   //                  }
   //              );
   //      }else{
   //          console.log ( 'Can not add role to user as he/she is blocked' );
   //      }
   //  }else{
   //      console.log ( 'You have not selected any user to add as a admin' );
   //  }

    formValues = {
        
       checkboxcompanyName    : event.target.checkboxcompanyName.value, 
       checkboxtitle          : event.target.checkboxtitle.value,
       checkboxfirstName      : event.target.checkboxfirstName.value,
       checkboxlastName       : event.target.checkboxlastName.value,
       checkboxemailAddress   : event.target.checkboxemailAddress.value,
       checkboxuserName       : event.target.checkboxuserName.value,
       checkboxgender         : event.target.checkboxgender.value,
       checkboxpicture        : event.target.checkboxpicture.value,
       checkboxhomeAddress    : event.target.checkboxhomeAddress.value,
       checkboxcountry        : event.target.checkboxcountry.value,
       checkboxstate          : event.target.checkboxstate.value,
       checkboxcity           : event.target.checkboxcity.value,
       checkboxpin            : event.target.checkboxpin.value,
       checkboxmobNum         : event.target.checkboxmobNum.value,
       checkboxalterMobNum    : event.target.checkboxalterMobNum.value,
       checkboxpassword       : event.target.checkboxpassword.value,
       checkboxconfirmPassword    : event.target.checkboxconfirmPassword.value,
       checkboxNewsLetterSubscription    : event.target.checkboxNewsLetterSubscription.value,
       title        : event.target.title.value,
       firstName    : event.target.firstName.value,
       lastName     : event.target.lastName.value,
       emailAddress : event.target.emailAddress.value,
       userName     : event.target.userName.value,
       gender       : event.target.gender.value,
       picture      : event.target.picture.value,
       homeAddress  : event.target.homeAddress.value,
       city         : event.target.city.value,
       state        : event.target.state.value,
       pin          : event.target.pin.value,
       country      : event.target.country.value,
       mobNum       : event.target.mobNum.value,
       alterMobNum  : event.target.alterMobNum.value,
       companyDomain: event.target.companyDomain.value,
       defaultRoleToUser : event.target.defaultRole.value,
       // defaultRoleToUser : 'Staff',
       password          : event.target.password.value,
       confirmPassword   : event.target.confirmPassword.value,
       companyName   : event.target.companyName.value,
       newsLetterSubscription   : event.target.newsLetterSubscription.value,
  }


    var countMatchedRows = ConfigSettings.find({ 'companyDomain' : formValues.companyDomain }).count();

    var matchedRow = ConfigSettings.findOne({ 'companyDomain' : formValues.companyDomain });

    if(countMatchedRows == 0){ 
    var result = Meteor.call('insertCheckedData', formValues,
                function(error, result) { 
                    if (error) {
                        // console.log ( 'Insert error : ' + error ); 
                    } 
                    else {
                      // console.log ( 'Insert success' ); 
                    }
                }
            );
    } //End of if statement
    else{
        // console.log('Already Exist');

    var result = Meteor.call('updateCheckedData', formValues, matchedRow ,
                function(error, result) { 
                    if (error) {
                        // console.log ( 'Update error : ' + error ); 
                    } 
                    else {
                        FlowRouter.go("/");
                        // console.log ( 'update success' ); 
                    }
                }
            );
    } //End of else statement

  }, //End of Submit



});


configSettingsForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'configSettings'});
}

export { configSettingsForm };