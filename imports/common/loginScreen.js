import { Bert } from 'meteor/themeteorchef:bert';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Business } from '/imports/api/businessMaster.js';

import '/imports/common/common.js';


// if (Meteor.isClient) {

  Template.loginScreen.events({
    'click .UMloginbutton': function(event, template) {
      event.preventDefault();

      // var forgotPasswordForm = $(e.currentTarget);
      // console.log('T');
      var email , trimInput ;

      // var emailVar = e.target.email.value;
      var emailVar = $("#forgotPasswordEmail").val();
      trimInput = function(val) {
        return val.replace(/^\s*|\s*$/g, "");
      }

      if(emailVar){
        emailtrim = trimInput(emailVar);
        email     = emailtrim.toLowerCase();
        // console.log(email);
        var vendorObj = Meteor.users.findOne({"emails.address":email});
        if(!vendorObj){
          Bert.alert('The entered email address doesn’t exist in our Vendor database','danger','growl-top-right');
        }else{
          if(vendorObj.roles[0] == 'Vendor'){
            $('.enteredEmail').text(email);
            $('.forgotEmailMessage').show();
            $('.disableBtn').attr('disabled','disabled');
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
          }else{
            Bert.alert("You can’t change your password. Please contact us at support@rightnxt.com or call our support staff.","danger","growl-top-right");
          }
        }
      }else{
        Bert.alert('Please enter your registered email address',"danger","growl-top-right");
      }
          
        // Bert.alert( "Instructions sent! We've sent an email with instructions on how to reset your password.If you don't receive an email within a few minutes, check your spam and junk folders.", 'success', 'growl-top-right' );
      return false;
    },
    'click .frgtClose':function(e){
      $('.forgotEmailMessage').hide();
      $('.resetPwd').removeClass('diplayNoneresetPwd');

    },

  'click .forgotEmail':function(e){
    e.preventDefault();
    $('.disableBtn').removeAttr('disabled');
    // console.log('value change');
  },

    
  'click .loginLabel' : function(event){
      $(event.target).siblings().focus();
    },
    
  'submit .loginForm': function(event) {
    event.preventDefault();

    var email = event.target.email.value.toLowerCase();
    var pwd   = event.target.pwd.value;
      // console.log('email:',email);

    var vendorObj = Meteor.users.findOne({"emails.address":email});
    if(!vendorObj){      
      // Bert.alert('This email address does not exist.','danger','growl-top-right');
      $('.passwordWrongSpan').text("The entered email address doesn’t exist in our Vendor database");
      $('.passwordWrongSpan').addClass('passwordWrongWar');
    }else{
      if(vendorObj.roles[0] == 'Vendor'){
        $('#loginModal').modal('hide');
        // $('.modal-backdrop').hide();
        Meteor.call('checkEmailVerification', email, (error,data)=>{
          if (data == "verified"){
            Meteor.loginWithPassword(email, pwd, (error)=> {
               if (error) {
                  $('#loginModal').modal('show');
                  $('.passwordWrongSpan').text("The email address or password you entered is not valid. Please try again");
                  $('.passwordWrongSpan').addClass('passwordWrongWar');
                  
                  // Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
                } else {
                  // Bert.alert('Welcome To Rightnxt.com!');
                 
                  $('.passwordWrongSpan').removeClass('passwordWrongWar');                   
                  event.target.email.value   ='';
                  event.target.pwd.value     =''; 
                  // FlowRouter.go('/');
                                        
                  // $('.modal-backdrop').remove();
                  $('.modal-backdrop').hide();

                  var loggedInUser = Meteor.userId();
                  // var user = Meteor.users.findOne({'_id' : loggedInUser });
                  var user = Meteor.userId();
                  if(user){
                    var businessName = Business.findOne({'businessOwnerId':user});
                    if(businessName){
                      FlowRouter.go('/vendorDashboard/'+businessName.businessLink);
                    }else{
                      FlowRouter.go('/vendorDashboard');
                    }                                
                  }
                }
              }
              );
          }else if(data == "unverified"){
                 $('#loginModal').modal('show');
                 $('.passwordWrongSpan').text("Please use the option Verify Account for OTP verification.");
                 $('.passwordWrongSpan').addClass('passwordWrongWar');
          }else if(data == "Blocked"){
                 $('#loginModal').modal('show');
                 $('.passwordWrongSpan').text("You're profile is blocked. Please contact Admin.");
                 $('.passwordWrongSpan').addClass('passwordWrongWar');
          }else{    
                $('#loginModal').modal('show');
                $('.passwordWrongSpan').text("The email address or password you entered is not valid. Please try again");
                $('.passwordWrongSpan').addClass('passwordWrongWar');         
          }
        });
      }else{
        $('.passwordWrongSpan').text("Something is wrong with your account’s email id. Please contact us at support@rightnxt.com or call our support staff.");
        $('.passwordWrongSpan').addClass('passwordWrongWar');
      }
    }
    return false;
  },

  'click .frgtClose': function(event) {
    $('#forgotPwdModal').modal('hide');
  },
  'keyup .loginPassword': function(event) {
    $('.passwordWrongSpan').removeClass('passwordWrongWar');
  },
  'keyup .loginEmail': function(event) {
    $('.passwordWrongSpan').removeClass('passwordWrongWar');
  },
  'click .verifyotp': function(event) {
    $('.passwordWrongSpan').removeClass('passwordWrongWar');
    $('label.error').hide();
    $('input[type="text"]').val('');
    $('input[type="password"]').val('');
    $('input[type="tel"]').val('');
    $('.loginLabel').removeClass('active');
    $('#loginModal').modal('hide'); 
    $('.modal-backdrop').hide(); 
  },
  'click .forgotPass': function(event) {
    $('.passwordWrongSpan').removeClass('passwordWrongWar');
    $('label.error').hide();
    $('input[type="text"]').val('');
    $('input[type="password"]').val('');
    $('input[type="tel"]').val('');
    $('input[type="email"]').val('');
    $('.loginLabel').removeClass('active');
  },
});
 
// }

Template.header.events({
  
  'click .loginClosenew': function(event) {
    $('.modal-backdrop').hide();
  },
});


Template.loginScreen.onRendered(function(){
  // $('.disableBtn').attr('disabled','disabled');

  $.validator.addMethod("regex_1", function(value, element, regexpr) {          

      return regexpr.test(value);
  }, "Please Enter valid Email Address");

   $(".loginForm").validate({
    rules:{
          email:{
            regex_1: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
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


