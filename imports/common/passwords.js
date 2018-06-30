import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './anonymousUserLayout.js';
import './anonymousUserLayout.html';
import '/imports/common/common.js';

import './ResetPassword.html'

Template.passwords.onCreated(function() {
  if (Accounts._resetPasswordToken) {
    // var resetPassword = FlowRouter.getParam('token');
    Session.set('resetPassword', Accounts._resetPasswordToken);
    console.log('ResetPasswordtemplate : ' + resetPassword);
  }
});

Template.passwords.helpers({
   resetPassword: function(){
    // console.log('ResetPassword : ' + resetPassword);
    var resetPassword = FlowRouter.getParam('token');
    // console.log('ResetPassword : ' + resetPassword);
    return resetPassword;
    // return Session.get('resetPassword');

   },
});

Template.passwords.events({
  'submit #resetPasswordForm': function(e, t) {
    e.preventDefault();

    var resetPassword = FlowRouter.getParam('token');
    // console.log('ResetPassword : ' + resetPassword);
    var resetPasswordForm = $(e.currentTarget),
        password = resetPasswordForm.find('#resetPasswordPassword').val(),
        passwordConfirm = resetPasswordForm.find('#resetPasswordPasswordConfirm').val();


    //Check password is at least 6 chars long
    var isValidPassword = function(password, passwordConfirm) {
       if (password === passwordConfirm) {
        console.log('passwordVar.length'+ password.length >= 6 ? true : false);
         return password.length >= 6 ? true : false;
       } else {
         return swal({
            title: 'Passwords dont match',
            text: 'Please try again',
            showConfirmButton: true,
            type: 'error'
         }); //End of error swal
       } //End of else
     }

   if (isValidPassword(password, passwordConfirm)) { 
    // if (isNotEmpty(password) && areValidPasswords(password, passwordConfirm)) {
      Accounts.resetPassword(resetPassword, password, function(err) {
        if (err) {
          console.log('We are sorry but something went wrong.');
        } else {
          console.log('Your password has been changed. Welcome back!');
          Session.set('resetPassword', null);
          FlowRouter.go('/');
        }
      });
    }else{
            return swal({
            title: "password should be at least 6 characters long",
            text: "Please try again",
            timer: 1700,
            showConfirmButton: false,
            type: "error"
        });

    }
    // }
    return false;
  }
});

ResetPasswordForm = function () {  
  console.log('in reset');
  BlazeLayout.render("anonymousUserLayout",{main: 'passwords'});
  // Blaze.render(Template.vendorLayout,document.body);
}

export { ResetPasswordForm };