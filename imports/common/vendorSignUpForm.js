import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';
import { Accounts } from 'meteor/accounts-base'; 
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import '/imports/common/common.js';
// import './forgotPassword.js';

Template.vendorSignUpForm.events({

  'click .loginLabel' : function(event){
      $(event.target).siblings().focus();
    },

  'focusout .vSignUpEmail':function(event){
    var value =$(event.target).val();
    var vendorObj = Meteor.users.findOne({'emails.address':value});
    if(vendorObj){
       var emailVal = vendorObj.emails[0].address;
      if (value == emailVal) {
        $('.wrongVendorEmailSpan').show();
        $('.wrongVendorEmailSpan').text("Email already exists.");
        $('.wrongVendorEmailSpan').addClass('passwordWrongWar');
      }
    }
    else{
        $('.wrongVendorEmailSpan').hide();
    }
  },

    'submit #vendorsignUpForm' : function(event) {

      event.preventDefault();
      var name       = event.target.name.value;
      var email      = event.target.email.value;
      var pwd        = event.target.pwd.value;
      var reverse    = pwd.split("").reverse().join("");
      var mobile     = event.target.mobile.value;
      var userRole   = 'Vendor';
      
      var formValues = {
        name   : name,
        email  : email,
        mobile : mobile,
        pwd    : pwd,
        reverse: reverse,
      }
      Meteor.call('userSignUp', formValues , function(error,result){
      if(error){
        // Bert.alert(error.reason);
      }else{               
        var newID = result;
        Meteor.logout();
        var defaultRoleconfig = "Vendor";
        Session.set("loginSession",newID);
        $('#loginModal').hide();
        $(".modal-backdrop").remove(); 
        // console.log('loginSession Signup ',Session.get("loginSession"));
        Meteor.call('addRoleNotifEmailOTPsendVerifyLink' , newID , defaultRoleconfig, function(error,result){
          if(error){
            console.log(error);
          }else{
            // location.reload();
            $('#loginModal').hide();
            $(".modal-backdrop").remove(); 
            FlowRouter.go("/LoginOTP");
            
          }
        });
        // Meteor.call('addRoles', newID , defaultRoleconfig,function(error,result){
        //   if(error){
        //     console.log(error);
        //   }else{
        //     Meteor.call('addNotifConfig',newID,function(error,result){
        //       if(error){
        //         // Bert.alert("Something went wrong");
        //       }else{
        //         var otp      = Math.floor(1000 + Math.random() * 9000);
        //           Meteor.call('addEmailOTP',newID,otp,function(error,result){
        //             if(error){
        //              console.log(error);
        //             }else{
        //               Meteor.call('sendVerificationLink', newID, function(error,result){
        //                 if(error){
        //                   Bert.alert(error.reason);
        //                 }else{                        
        //                   Bert.alert("Check your email for verification",'warning');
        //                   $('#loginModal').modal('toggle'); 
        //                   FlowRouter.go('/LoginOTP');
        //                 } //end else
        //               }); // send verification mail ends
                      
        //             }
        //           }); //add Email OTP
        //       }
        //     });
        //   }
        // });

      var userObj = Meteor.users.find({}).fetch();
      if(userObj){
        for (var i = 0; i < userObj.length; i++) {
            if(userObj[i].emails){
              var verify = userObj[i].emails[0].verified; 
              if(verify == true){
                  var emailVal = userObj[i].emails[0].address;
              }
              // console.log("emailVal: "+userObj[i].emails[0].address);
              if(email == emailVal){
                $(' .wrongVendorEmailSpan').text("Email already exists.");
                $('.wrongVendorEmailSpan').addClass('passwordWrongWar');
              }else{    
                $('.signupScreen').hide();
                $('.signUpBox').hide();
                $('.genLoginSignup').hide();
                $('.loginScreen').hide();
                $('.thankyouscreen').show();
              }
            }
        }
      }
      Meteor.logout();
      // Bert.alert( 'User created successfully!', 'success', 'fixed-top' );
      FlowRouter.go('/');
    }
  }); //End of User Creation
  } //end of submit
  }); //end of events

Template.vendorSignUpForm.onRendered(function(){
  $.validator.addMethod("regx1", function(value, element, regexpr) {          
      return regexpr.test(value);
  }, "Name should only contain alphabets and spaces.");

  $.validator.addMethod("regexx2", function(value, element, regexpr) {          
      return regexpr.test(value);
  }, "Please Enter Valid Mobile Number");

  $.validator.addMethod("regex_B3", function(value, element, regexpr) {          
      return regexpr.test(value);
  }, "Please Enter Valid Email Address");

  $.validator.addMethod("rgex4", function(value, element, regexpr) {          
      return regexpr.test(value);
  }, "Password is too short...Use atleast 6 characters");
    
  $("#vendorsignUpForm").validate({
    rules: {
          name: {
            required : true,
            regx1: /^[\sa-zA-Z]+$/,
          },
          pwd: {
            required : true,
            // rgex4: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
          },
          mobile: {
            required : true,
            regexx2:  /^(\+91-|\+91|0)?\d{10}$/,
          },
          email:{
            required : true,
            regex_B3: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
          },

      }
   });
  $('#vendorsignUpForm').find('input').on('keyup blur focus', function(e){
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

vendorSignUpForm = function () {  
  BlazeLayout.render("anonymousUserLayout",{main: 'vendorSignUpForm'});
}

export { vendorSignUpForm };

