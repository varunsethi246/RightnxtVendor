import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';
import { Accounts } from 'meteor/accounts-base'; 



// Template.profileSetting.events({

//   'submit #change-password': function(event){
//     event.preventDefault();

//     var formValues = {
//       "newPwd"        : event.target.newPwd.value,
//       "confirmPwd"    : event.target.confirmPwd.value,
//       "currentPwd"    : event.target.currentPwd.value,
//     };

//     if(formValues.newPwd == formValues.confirmPwd){
//         Meteor.call('changePAssword',formValues,function(err,result){
//         if(!err){
//           Bert.alert( 'User created successfully!', 'success', 'fixed-top' );
//           console.log("Congrats you change the password")
//           }
//           else{
//           Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
//           console.log("There is an error" + err.reason)
//         }
//       });
//     }
    
//   },

// });

Template.profileSetting.events({
  'click #change-password': function() {
    var digest = Package.sha.SHA256($('#password').val());
    Meteor.call('checkPassword', digest, function(err, result) {
      if (result) {
        console.log('the passwords match!');
      }
    });
  }
});