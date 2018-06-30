import { Bert } from 'meteor/themeteorchef:bert';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '/imports/common/common.js';


// if (Meteor.isClient) {

  Template.loginScreen.events({
    'click .UMloginbutton': function(event, template) {
      event.preventDefault();

      // var forgotPasswordForm = $(e.currentTarget);
      // console.log(forgotPasswordForm);
      var email , trimInput ;

      // var emailVar = e.target.email.value;
      var emailVar = $("#forgotPasswordEmail").val();
      $('.enteredEmail').text(emailVar);
      $('.forgotEmailMessage').show();
      
      trimInput = function(val) {
        return val.replace(/^\s*|\s*$/g, "");
      }

          emailtrim = trimInput(emailVar);
          email     = emailtrim.toLowerCase();


        Accounts.forgotPassword({email: email}, function(err) {
          if (err) {
            if (err.message === 'User not found [403]') {
              // console.log('This email does not exist.');
              Bert.alert('This email does not exist:'+err.reason);
            } else {
              // console.log('We are sorry but something went wrong.');
              Bert.alert('We are sorry but something went wrong:'+err.reason);
            }
          } else {
            // console.log('Email Sent. Check your mailbox.');
            Bert.alert('Email Sent. Check your mailbox.',"success","growl-top-right");
          }
        });

          
        // Bert.alert( "Instructions sent! We've sent an email with instructions on how to reset your password.If you don't receive an email within a few minutes, check your spam and junk folders.", 'success', 'growl-top-right' );
      return false;
    },

    'click .forgotEmail':function(e){
      e.preventDefault();
      $('.disableBtn').removeAttr('disabled');
      console.log('value change');
    },
    'click .frgtClose':function(e){
      $('.forgotEmailMessage').hide();
      $('.resetPwd').removeClass('diplayNoneresetPwd');

    },


     'click .UMloginbutton': function(event, template) {
    event.preventDefault();

    // var forgotPasswordForm = $(e.currentTarget);
    // console.log(forgotPasswordForm);
    var email , trimInput ;

    // var emailVar = e.target.email.value;
    var emailVar = $("#forgotPasswordEmail").val();
    $('.enteredEmail').text(emailVar);
    $('.forgotEmailMessage').show();
    
    trimInput = function(val) {
      return val.replace(/^\s*|\s*$/g, "");
    }

        emailtrim = trimInput(emailVar);
        email     = emailtrim.toLowerCase();


      Accounts.forgotPassword({email: email}, function(err) {
        if (err) {
          if (err.message === 'User not found [403]') {
            // console.log('This email does not exist.');
            Bert.alert('This email does not exist:'+err.reason);
          } else {
            // console.log('We are sorry but something went wrong.');
            Bert.alert('We are sorry but something went wrong:'+err.reason);
          }
        } else {
          // console.log('Email Sent. Check your mailbox.');
          Bert.alert('Email Sent. Check your mailbox.',"success","growl-top-right");
        }
      });

        
      // Bert.alert( "Instructions sent! We've sent an email with instructions on how to reset your password.If you don't receive an email within a few minutes, check your spam and junk folders.", 'success', 'growl-top-right' );
    return false;
  },

  'click .forgotEmail':function(e){
    e.preventDefault();
    $('.disableBtn').removeAttr('disabled');
    console.log('value change');
  },

    
  'click .loginLabel' : function(event){
      $(event.target).siblings().focus();
    },
    
  'submit .loginForm': function(event) {
    event.preventDefault();

    $('#loginModal').hide();
    var email = event.target.email.value;
    var pwd   = event.target.pwd.value;

    // var userObj = Meteor.users.find({}).fetch();
    // if(userObj){
    //   for (var i = 0; i < userObj.length; i++) {
    //     if(userObj[i].emails){
    //       var verify = userObj[i].emails[0].verified; 
    //       if(verify == false){
    //         var emailVal = userObj[i].emails[0].address;
    //       }
    //     // console.log("emailVal: "+userObj[i].emails[0].address);

    //       if(email == emailVal){
    //         $('.wrongLoginEmailSpan').text("Email already exists.");
    //         $('.wrongLoginEmailSpan').addClass('passwordWrongWar');
    //       }
    //     }
    //   }
    // }


    Meteor.call('checkEmailVerification', email, (error,data)=>{
    if (data == "verified"){


      Meteor.loginWithPassword(email, pwd, (error)=> {
         if (error) {
            $('#loginModal').show();
            $('.passwordWrongSpan').text("Please Enter Valid Email or Password");
            $('.passwordWrongSpan').addClass('passwordWrongWar');
            
            // Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
          } else {
            // Bert.alert('Welcome To Rightnxt.com!');
           
            $('.passwordWrongSpan').removeClass('passwordWrongWar');
             
          event.target.email.value   ='';
          event.target.pwd.value     =''; 
          // FlowRouter.go('/');
                                  
            $('.modal-backdrop').remove();

            var loggedInUser = Meteor.userId();
            // var user = Meteor.users.findOne({'_id' : loggedInUser });
            var user = Meteor.user();
            if(user){
                if (Roles.userIsInRole(loggedInUser, ['user'])) {
                      // var msgvariable = {
                      //    '[username]'      : user.profile.name,
                      //    '[currentDate]'   : currentDate,
                      // };
                      // var inputObj = {
                      //                   notifPath     : '',
                      //                   from          : adminId,
                      //                   to            : Meteor.userId(),
                      //                   templateName  : 'Thanks for Registering',
                      //                   variables     : msgvariable,
                      //                }
                      // sendMailNotification(inputObj);
                      FlowRouter.go('/userProfile',{'userId':loggedInUser});

                }else if (Roles.userIsInRole(loggedInUser, ['Vendor'])) {
                      FlowRouter.go('/vendorDashboard');
                }
                else{
                      FlowRouter.go('/adminDashBoard');
                }                      
              }
              
          }
        }
        );

    }else if(data == "unverified"){
           $('#loginModal').show();
           $('.passwordWrongSpan').text("Please use the option Verify Account for OTP verification.");
           $('.passwordWrongSpan').addClass('passwordWrongWar');
    }else if(data == "Blocked"){
           $('#loginModal').show();
           $('.passwordWrongSpan').text("You're profile is blocked. Please contact Admin.");
           $('.passwordWrongSpan').addClass('passwordWrongWar');
    }else{    
          $('#loginModal').show();
          $('.passwordWrongSpan').text("Please Enter Valid Email or Password");
          $('.passwordWrongSpan').addClass('passwordWrongWar');         
    }
  });
    // console.log('data');
    return false;
  },

  // 'click .frgtClose': function(event) {
  //   $('.modalBox').hide();
  // },

   'click .frgtClose': function(event) {
    $('#forgotPwdModal').modal('hide');
  },

});
 
// }

Template.header.events({
  
  'click .loginClosenew': function(event) {
    $('.modal-backdrop').hide();
  },
});


Template.loginScreen.onRendered(function(){
  $('.disableBtn').attr('disabled','disabled');

  $.validator.addMethod("regex_1", function(value, element, regexpr) {          

      return regexpr.test(value);
  }, "Please Enter valid Email Address");

   $(".loginForm").validate({
    rules:{
            email:{
            regex_1: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
          },
        
         
      }
   });

   // $('.loginEmail').on('focus',function(){
   //    $(this).siblings('.loginLabel').addClass('newLoginLabel');


   // });

    if($('.loginForm').find('input').val() !== ''){
      $('.loginForm').find('input').prev('.loginLabel').addClass('active highlight');
    }

     $('.loginForm').find('input').on('keyup blur focus', function(e){
       var $this = $(this),
          label = $this.prev('.loginLabel');
          if (e.type === 'keyup') {
            if ($this.val() === '') {
                label.removeClass('active highlight');
              } else {
                label.addClass('active highlight');
              }
          } else if (e.type === 'blur') {
            if( $this.val() === '' ) {
              label.removeClass('active highlight'); 
            } else {
              label.removeClass('highlight');   
            }   
          } else if (e.type === 'focus') {
            if( $this.val() === '' ) {
              label.removeClass('highlight'); 
            } 
            else if( $this.val() !== '' ) {
              label.addClass('highlight');
            }
          }

     });
      
});


