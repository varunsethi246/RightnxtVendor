import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../userLayout.js';
import './profileSetting.html';
import './profileSettingSidebar.js';
import './profileSettingLayout.html';
import './editProfile.js';

Template.profileSetting.events({

  'submit #change-password': function(event){
    event.preventDefault();

    var newPwd =  event.target.newPwd.value;
    var confirmPwd =  event.target.confirmPwd.value;
    var currentPwd =  event.target.currentPwd.value;


    var hashpwd = Package.sha.SHA256(currentPwd);
    Meteor.call('checkPassword', hashpwd, function(err, result) {
      if(result){
        // Bert.alert( 'Old Password is correct!', 'success', 'fixed-top' );
        if(newPwd == confirmPwd){
            Meteor.call('changeMyPassword',newPwd,function(err,result){
              if(err){
                Bert.alert('Password can not be changed!', 'danger', 'growl-top-right');
              }else{
                FlowRouter.go('/');
                Bert.alert('Your password has been changed successfully! Please login again!', 'success', 'growl-top-right' );
                // $("html,body").scrollTop(0);
              }
          });
        }else{
         Bert.alert('Your New Password does not match with Confirm Password!', 'danger', 'growl-top-right', 'fa-frown-o' );        
        }
      }else{
        Bert.alert('Your Old Password is not correct!', 'danger', 'growl-top-right', 'fa-frown-o' );        
      }
    }); 
  },

  'click .userYesbtn': function(event) {
  Meteor.call('blockUser',function(err, result) {
      if (err) {
        console.log("err",err);
        }else {
            Meteor.logout();
            FlowRouter.go('/');
            $('.modal-backdrop').hide();
        }
    });
  },  

});


profileSettingForm = function () {  
  BlazeLayout.render("profileSettingLayout",{profileSettings: 'profileSetting'});
  // Blaze.render(Template.userLayout,document.body);
}
export { profileSettingForm }
