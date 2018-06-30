// // Do not forget to add the email package: $ meteor add email
// // and to configure the SMTP: https://gist.github.com/LeCoupa/9879221
// import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// import './anonymousUserLayout.js';
// import './anonymousUserLayout.html';
// // import './forgotPassword.js';
// // import './ForgotPassword.html';
// import './ResetPasswords.html';
// // import './forgotPassword.html';

// // import './loginScreen.js'



// // Template.ForgotPassword.onRendered(function (){
// //   $('.disableBtn').attr('disabled','disabled');
// // });



// // Template.ForgotPassword.events({
// //   'click .UMloginbutton': function(event, template) {
// //     event.preventDefault();

// //     // var forgotPasswordForm = $(e.currentTarget);
// //     // console.log(forgotPasswordForm);
// //     var email , trimInput ;

// //     // var emailVar = e.target.email.value;
// //     var emailVar = $("#forgotPasswordEmail").val();
// //     $('.enteredEmail').text(emailVar);
// //     $('.forgotEmailMessage').show();
    
// //     trimInput = function(val) {
// //       return val.replace(/^\s*|\s*$/g, "");
// //     }

// //         emailtrim = trimInput(emailVar);
// //         email     = emailtrim.toLowerCase();


// //       Accounts.forgotPassword({email: email}, function(err) {
// //         if (err) {
// //           if (err.message === 'User not found [403]') {
// //             // console.log('This email does not exist.');
// //             Bert.alert('This email does not exist:'+err.reason);
// //           } else {
// //             // console.log('We are sorry but something went wrong.');
// //             Bert.alert('We are sorry but something went wrong:'+err.reason);
// //           }
// //         } else {
// //           // console.log('Email Sent. Check your mailbox.');
// //           Bert.alert('Email Sent. Check your mailbox.',"success","growl-top-right");
// //         }
// //       });

        
// //       // Bert.alert( "Instructions sent! We've sent an email with instructions on how to reset your password.If you don't receive an email within a few minutes, check your spam and junk folders.", 'success', 'growl-top-right' );
// //     return false;
// //   },

// //   'click .forgotEmail':function(e){
// //     e.preventDefault();
// //     $('.disableBtn').removeAttr('disabled');
// //     console.log('value change');
// //   },



// // });


// Template.ResetPasswords.onCreated(function() {
//   if (Accounts._resetPasswordToken) {
//     // var resetPassword = FlowRouter.getParam('token');
//     Session.set('resetPassword', Accounts._resetPasswordToken);
//     console.log('ResetPasswordtemplate : ' + resetPassword);
//   }
// });

// Template.ResetPasswords.helpers({
//    resetPassword: function(){
//     // console.log('ResetPassword : ' + resetPassword);
//     var resetPassword = FlowRouter.getParam('token');
//     // console.log('ResetPassword : ' + resetPassword);
//     return resetPassword;
//     // return Session.get('resetPassword');

//    },
// });

// Template.ResetPasswords.events({
//   'submit #resetPasswordForm': function(e, t) {
//     e.preventDefault();

//     var resetPassword = FlowRouter.getParam('token');
//     // console.log('ResetPassword : ' + resetPassword);
//     var resetPasswordForm = $(e.currentTarget),
//         password = resetPasswordForm.find('#resetPasswordPassword').val(),
//         passwordConfirm = resetPasswordForm.find('#resetPasswordPasswordConfirm').val();


//     //Check password is at least 6 chars long
//     var isValidPassword = function(password, passwordConfirm) {
//        if (password === passwordConfirm) {
//         console.log('passwordVar.length'+ password.length >= 6 ? true : false);
//          return password.length >= 6 ? true : false;
//        } else {
//          return swal({
//             title: 'Passwords dont match',
//             text: 'Please try again',
//             showConfirmButton: true,
//             type: 'error'
//          }); //End of error swal
//        } //End of else
//      }

//    if (isValidPassword(password, passwordConfirm)) { 
//     // if (isNotEmpty(password) && areValidPasswords(password, passwordConfirm)) {
//       Accounts.resetPassword(resetPassword, password, function(err) {
//         if (err) {
//           console.log('We are sorry but something went wrong.');
//         } else {
//           console.log('Your password has been changed. Welcome back!');
//           Session.set('resetPassword', null);
//           FlowRouter.go('/');
//         }
//       });
//     }else{
//             return swal({
//             title: "password should be at least 6 characters long",
//             text: "Please try again",
//             timer: 1700,
//             showConfirmButton: false,
//             type: "error"
//         });

//     }
//     // }
//     return false;
//   }
// });

// ResetPasswordForm = function () {  
//   console.log('in reset');
//   BlazeLayout.render("anonymousUserLayout",{main: 'ResetPasswords'});
//   // Blaze.render(Template.vendorLayout,document.body);
// }

// export { ResetPasswordForm }; 