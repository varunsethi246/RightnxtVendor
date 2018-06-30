import './forgotPassword.html';


// import './ForgotPassword.html';


// Template.forgotPassword.events({
//   'submit #forgotPasswordForm': function(e, t) {
//     e.preventDefault();

//     var forgotPasswordForm = $(e.currentTarget),
//         email = trimInput(forgotPasswordForm.find('#forgotPasswordEmail').val().toLowerCase());

//     if (isNotEmpty(email) && isEmail(email)) {

//       Accounts.forgotPassword({email: email}, function(err) {
//         if (err) {
//           if (err.message === 'User not found [403]') {
//             console.log('This email does not exist.');
//           } else {
//             console.log('We are sorry but something went wrong.');
//           }
//         } else {
//           console.log('Email Sent. Check your mailbox.');
//         }
//       });

//     }
//     return false;
//   },
// });
Template.forgotPassword.events({
	  'click .frgtClose':function(e){
	   	$('.forgotEmailMessage').hide();
	    $('.resetPwd').removeClass('diplayNoneresetPwd');

  	},

});
