import { Bert } from 'meteor/themeteorchef:bert';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import './LoginOTP.html';
import './anonymousUserLayout.html';
import './loading.html';
import '/imports/common/common.js';


Template.LoginOTP.onRendered(function(){
  $('#loginModal').modal('hide'); 
});

Template.LoginOTP.helpers({
  loginSessionSet(){
    if(Session.get("loginSession")){
      // console.log('Got loginSession');
      return true;
    }else{
      // console.log('Didnt loginSession');   
      return false;
    }
  },
  loginDetails(){
    var userId = Session.get("loginSession");
    // console.log('userId ',userId);
    var user = Meteor.users.findOne({"_id":userId});
    if(user){
      var num = user.profile.mobile ;
      var emailId = user.emails[0].address;
      user.emailId = emailId;
      // user.profile.mobile  = num.substr(num.length - 4);
      // console.log('user emailId ',user);
      return user;
    }
  }
});

Template.LoginOTP.events({
  // 'submit .otpForm' : function(e){
  //  e.preventDefault();
  //  var ipOtp        = $('#loginOTP').val();
  //  var saveOtp      = $('#otpSaved').val();
  //  var saveEmailOtp = $('#otpemailSaved').val();
  //  var userId = Session.get("loginSession");
  //  if((ipOtp == saveOtp) || (ipOtp == saveEmailOtp)){
  //    Meteor.call('activeUser',userId,function(error,result){
  //      if(error){
  //        console.log(error);
  //      }else{
 //                    // Bert.alert('Your A',"success","growl-top-right"); 
  //        var userDetails = Meteor.users.findOne({"_id":userId});
  //        if(userDetails){
  //                     $('#loginModal').modal();
  //          $('.signUpBox').hide(); 
  //                     $('.loginScreen').show(); 
  //                     $('.genLoginSignup').hide();
  //          $('.signupScreen').hide();
  //          $('.thankyouscreen').hide();
  //        }
  //          }
  //         });  
  //  }
  // },
  'click .resendotp' : function(e){
    // e.preventDefault();
    var emailId = $('#userEmail').val();
    if(!emailId ){
      Bert.alert('Please enter registered email address.',"danger","growl-top-right");   
    }else{
      var newID = Meteor.users.findOne({"emails.address":emailId});
      if(newID){
        var otp = newID.profile.emailotp;
        if(!otp){
          Bert.alert("Email already Verified.",'danger','growl-top-right');
          // FlowRouter.go('/');
                        // $('#loginModal').modal();
              // $('.signUpBox').hide(); 
                        // $('.loginScreen').show(); 
                        // $('.genLoginSignup').hide();
              // $('.signupScreen').hide();
              // $('.thankyouscreen').hide();
        }else{
              Meteor.call('sendVerificationLink', newID._id, function(error,result){
                  if(error){
                    Bert.alert(error.reason);
                  }else{                        
                    Bert.alert("Check your email for verification",'success','growl-top-right');
                  } //end else
              }); // send verification mail ends
        }   
      } else{
        Bert.alert('Please enter correct Email','danger','growl-top-right');
      }
    }
  },
  'submit .emailOtpSubmit' : function(e){
    e.preventDefault();

    var emailId = $('#userEmail').val();
    var otp   = $('.otpTxt').val(); 
    var userDetails = Meteor.users.findOne({"emails.0.address":emailId});
    if(userDetails){
      var userId = userDetails._id;
      if((otp == userDetails.profile.otp) || (otp == userDetails.profile.emailotp)){
        Meteor.call('activeUser',userId,function(error,result){
          if(error){
            console.log(error);
          }else{
            Bert.alert('You have sucessfuly logged In',"success","growl-top-right");  
            // var userDetails = Meteor.users.findOne({"_id":userId});
            // if(userDetails){
              // FlowRouter.go('/');
              // $('#loginModal').hide();
              // $('.modal-backdrop').hide();

              var emailVar    = userDetails.emails[0].address;
              var reversePassWord = userDetails.profile.reverse;
              // console.log("reversePassWord",reversePassWord); 
                var passwordVar   = reversePassWord.split("").reverse().join("");
                // console.log("passwordVar",passwordVar);

                Meteor.loginWithPassword(emailVar,passwordVar, function(err,result){
                  if(err){
                    Bert.alert('Something went wrong' , "danger" , "growl-top-right");
                  }else{
                    Meteor.call('removeReverse',userDetails._id,function(err,result){
                      if(err){
                        Bert.alert('Something went wrong' , "danger" , "growl-top-right");
                      }else{
                        FlowRouter.go('/vendorDashboard');
                        // if (Roles.userIsInRole(userDetails, ['user'])) {
                        //           FlowRouter.go('/userProfile',{'userId':userDetails._id});
                        //       }else if (Roles.userIsInRole(userDetails, ['Vendor'])) {
                        //             FlowRouter.go('/vendorDashboard');
                        //       }   
                      }
                    });
                                          
                  }
                });

              
            // }
              }
            });   
      }else{
                Bert.alert('Please enter vaild OTP',"danger","growl-top-right");  
      }
    }else{
      Bert.alert('Please enter correct Email','danger','growl-top-right');
    }
  },
});


LoginOTP = function () {  
  BlazeLayout.render("anonymousUserLayout",{main: 'LoginOTP'});
}

export { LoginOTP };

// Template.LoginOTP.onRendered(function(){
//  $('#loginModal').modal('hide'); 
// });

// Template.LoginOTP.helpers({
//  loginSessionSet(){
//    if(Session.get("loginSession")){
//      // console.log('Got loginSession');
//      return true;
//    }else{
//      // console.log('Didnt loginSession');   
//      return false;
//    }
//  },
//  loginDetails(){
//    var userId = Session.get("loginSession");
//    // console.log('userId ',userId);
//    var user = Meteor.users.findOne({"_id":userId});
//    if(user){
//      var num = user.profile.mobile ;
//      var emailId = user.emails[0].address;
//      user.emailId = emailId;
//      // user.profile.mobile  = num.substr(num.length - 4);
//      // console.log('user emailId ',user);
//      return user;
//    }
//  }
// });

// Template.LoginOTP.events({
//  // 'submit .otpForm' : function(e){
//  //  e.preventDefault();
//  //  var ipOtp        = $('#loginOTP').val();
//  //  var saveOtp      = $('#otpSaved').val();
//  //  var saveEmailOtp = $('#otpemailSaved').val();
//  //  var userId = Session.get("loginSession");
//  //  if((ipOtp == saveOtp) || (ipOtp == saveEmailOtp)){
//  //    Meteor.call('activeUser',userId,function(error,result){
//  //      if(error){
//  //        console.log(error);
//  //      }else{
//  //                    // Bert.alert('Your A',"success","growl-top-right");  
//  //        var userDetails = Meteor.users.findOne({"_id":userId});
//  //        if(userDetails){
//  //                     $('#loginModal').modal();
//  //          $('.signUpBox').hide(); 
//  //                     $('.loginScreen').show(); 
//  //                     $('.genLoginSignup').hide();
//  //          $('.signupScreen').hide();
//  //          $('.thankyouscreen').hide();
//  //        }
//  //          }
//  //         });  
//  //  }
//  // },
//  'click .resendotp' : function(e){
//    // e.preventDefault();
//    var emailId = $('#userEmail').val();
//    if(!emailId ){
//      Bert.alert('Please enter registered emailId',"danger","growl-top-right");   
//    }else{
//      var newID = Meteor.users.findOne({"emails.address":emailId});
//      if(newID){
//        var otp = newID.profile.emailotp;
//        if(otp == 0){
//          Bert.alert("Email already Verified");
//          FlowRouter.go('/');
//                        $('#loginModal').modal();
//              $('.signUpBox').hide(); 
//                        $('.loginScreen').show(); 
//                        $('.genLoginSignup').hide();
//              $('.signupScreen').hide();
//              $('.thankyouscreen').hide();
//        }else{
//              Meteor.call('sendVerificationLink', newID._id, function(error,result){
//                  if(error){
//                    Bert.alert(error.reason);
//                  }else{                        
//                    Bert.alert("Check your email for verification",'success');
//                  } //end else
//              }); // send verification mail ends
//        }   
//      } else{
//        Bert.alert('Please enter correct Email','danger','growl-top-right');
//      }
//    }
//  },
//  'submit .emailOtpSubmit' : function(e){
//    e.preventDefault();

//    var emailId = $('#userEmail').val();
//    var otp   = $('.otpTxt').val(); 
//    var userDetails = Meteor.users.findOne({"emails.0.address":emailId});
//    if(userDetails){
//          var userId = userDetails._id;
//      if((otp == userDetails.profile.otp) || (otp == userDetails.profile.emailotp)){
//        Meteor.call('activeUser',userId,function(error,result){
//          if(error){
//            console.log(error);
//          }else{
//                      Bert.alert('You have sucessfuly logged In',"success","growl-top-right");  
//            var userDetails = Meteor.users.findOne({"_id":userId});
//            if(userDetails){
//              FlowRouter.go('/');
//                        $('#loginModal').hide();
//              $('.modal-backdrop').hide();

//              var emailVar    = userDetails.emails[0].address;
//              var reversePassWord = userDetails.profile.reverse;
//              console.log("reversePassWord",reversePassWord); 
//                var passwordVar   = reversePassWord.split("").reverse().join("");
//                console.log("passwordVar",passwordVar);

//                Meteor.loginWithPassword(emailVar,passwordVar, function(err,result){
//                  if(err){
//                    Bert.alert('Something thing went wrong' , "danger" , "growl-top-right");
//                  }else{
//                    Meteor.call('removeReverse',userDetails._id,function(err,result){
//                      if(err){
//                        Bert.alert('Something thing went wrong' , "danger" , "growl-top-right");
//                      }else{
//                        if (Roles.userIsInRole(userDetails, ['user'])) {
//                                  FlowRouter.go('/userProfile',{'userId':userDetails._id});
//                              }else if (Roles.userIsInRole(userDetails, ['Vendor'])) {
//                                    FlowRouter.go('/vendorDashboard');
//                              }   
//                      }
//                    });
                                          
//                  }
//                });

              
//            }
//              }
//            });   
//      }else{
//                 Bert.alert('Please enter vaild OTP',"danger","growl-top-right"); 
//      }
//    }else{
//             Bert.alert('Please enter correct Email','danger','growl-top-right');
//    }
//  },
// });