import { Accounts } from 'meteor/accounts-base';
import { Bert } from 'meteor/themeteorchef:bert';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


Template.signupScreen.events({
    'click .loginLabel' : function(event){
      $(event.target).siblings().focus();
    },
    'click .termAndCondition':function(event){
      $('.modal-backdrop').hide();
    },

    'click .privacyPolicy':function(event){
      $('.modal-backdrop').hide();
    },

    'focusout .signUpEmail':function(event){
      var value = $(event.target).val();
      // console.log('value: '+value);

      var userObj = Meteor.users.findOne({'emails.address':value});
      // console.log("userObj",userObj);
      if(userObj){
         var emailVal = userObj.emails[0].address;
        // console.log("emailVal",emailVal);
        if (value == emailVal) {
          $('.wrongEmailSpan').show();
          $('.wrongEmailSpan').text("Email already exists.");
          $('.wrongEmailSpan').addClass('passwordWrongWar');
        }
      }
      else{
          $('.wrongEmailSpan').hide();
      }
    },

    'submit #signupScreen' : function(event) {

      event.preventDefault();
        var name     = event.target.name.value;
        var email    = event.target.email.value;
        var mobile   = event.target.mobile.value;
        var pwd      = event.target.pwd.value;
        var reverse    = pwd.split("").reverse().join("");

        
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
            var defaultRoleconfig = "user";
            // $('#loginModal').modal('hide'); 
            Session.set("loginSession",newID);
            // console.log('loginSession Signup ',Session.get("loginSession"));
            Meteor.call('addRoleNotifEmailOTPsendVerifyLink' , newID , defaultRoleconfig, function(error,result){
              if(error){
                console.log(error);
              }else{
                // location.reload();
                $('#loginModal').modal('hide'); 
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
            //         Meteor.call('addEmailOTP',newID,otp,function(error,result){
            //           if(error){
            //            console.log(error);
            //           }else{
            //                 FlowRouter.go('/LoginOTP');
            //             Meteor.call('sendVerificationLink', newID, function(error,result){
            //               if(error){
            //                 Bert.alert(error.reason);
            //               }else{                        
            //                 // Bert.alert("Check your email for verification",'warning');
            //                 $('#loginModal').modal('hide'); 

                            
            //               } //end else
            //           }); // send verification mail ends
                        
            //           }
            //         }); //add Email OTP
            //     //     var mobileNumber =mobile;
            //     //     var otp      = Math.floor(1000 + Math.random() * 9000);
            //     //     if(mobile != ""){
            //     //       Session.set("loginSession",newID);
            //     //       Meteor.call('sendLoginOtp',mobileNumber,otp,function(error,result){
            //     //         if(error){
            //     //           console.log(error.reason);
            //     //         }else{
            //     //           Meteor.call('addOTP',newID,otp,function(error,result){
            //     //             if(error){
            //     //              console.log(error);
            //     //             }else{
            //     //               $('#loginModal').modal('toggle'); 
            //     //               FlowRouter.go('/LoginOTP');
            //     //             }
            //     //           });                                          
            //     //         }
            //     //       });
                                          
            //     //     }else{
            //     //       Bert('Your mobile number is not found. Please enter valid mobile number.',"danger","growl-top-right");
            //     //     }

            //       }
            //     });

            //     // FlowRouter.go('/LoginOTP');
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
                        $('.genLoginSignup').hide();
                        $('.loginScreen').hide();
                        $('.thankyouscreen').show();
                      }
                    }
                }
            }
            FlowRouter.go("/LoginOTP");
          }
        });
    } //end of submit
  }); //end of events

Template.signupScreen.onRendered(function(){
  $.validator.addMethod("regx", function(value, element, regexpr) {          
      return regexpr.test(value);
  }, "Name should only contain alphabets and spaces.");

  $.validator.addMethod("reget", function(value, element, regexpr) {          
      return regexpr.test(value);
  }, "Please Enter Valid Mobile Number");

  $.validator.addMethod("regex_B", function(value, element, regexpr) {          
      return regexpr.test(value);
  }, "Please Enter Valid Email Address");

  $.validator.addMethod("rgex", function(value, element, regexpr) {          
      return regexpr.test(value);
  }, "Password is too short...Use atleast 6 characters");
    
  $("#signupScreen").validate({
    rules: {
          name: {
            required : true,
            regx: /^[\sa-zA-Z]+$/,
          },
          pwd: {
            required : true,
            // rgex: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/,
          },
          mobile: {
            required : true,
            reget:  /^(\+91-|\+91|0)?\d{10}$/,
          },
          email:{
            required : true,
            regex_B: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/,
          },

      }
   });
   if($('.loginForm').find('input').val() !== ''){
      $('.loginForm').find('input').prev('.loginLabel').addClass('active highlight');
    }
    $('#signupScreen').find('input').on('keyup blur focus', function(e){
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
