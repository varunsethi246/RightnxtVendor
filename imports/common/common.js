
import './loadingLayout.html';

import './anonymousUserLayout1.html';
import './anonymousUserLayout.html';
import './header.html';
import './footer.html';
import './loading.html';
import './authenticatedUserLayout.html';
// console.log('1');

import './header.html';
import './footer.html';
import './loginModal.html';
import './venderHeader.html';

import './searchbar.html';
import './searchbar.js';

import './generalHeader.html';
import './generalHeader.js';
// console.log('loginScreen html');
import './loginScreen.html';
// console.log('loginScreen js');
import './loginScreen.js';

import './signupScreen.html';
import './signupScreen.js';

import './vendorLoginForm.html';
import './vendorLoginForm.js';

import './vendorSignUpForm.html';
import './vendorSignUpForm.js';

// import './ForgotPassword.html';
// import './forgotPassword.js';
// import './forgotPassword.html';
// import '/imports/commom/forgotPassword.html';


// import './resetPassword.html';


import './signUpThankYou.html';

import './starRating2.html';
import './starRating.html';
import './starRating.js';

import './LoginOTP.js';

import { Meteor } from 'meteor/meteor';
import { Review } from '/imports/api/reviewMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.anonymousUserLayout.helpers({
   	isReady: function(){
   		// console.log('isReady: ',FlowRouter.subsReady('userfunction'));
     //   if(FlowRouter.subsReady('userfunction')){
     //   		return FlowRouter.subsReady('userfunction');
     //   }else{
	   	// 	// console.log(FlowRouter.subsReady('userfunction' ,'state' ,'area'));
     //   	return false;
     //   }


      // console.log('FlowRouter.subsReady() anonymousUserLayout:',FlowRouter.subsReady());
       // return FlowRouter.subsReady();


       return Meteor.subscribe('userfunction').ready();
    },
});

Template.anonymousUserLayout1.helpers({
   	isReady: function(){

      //  if(Meteor.subscription('userfunction').ready()){
      //  		// return FlowRouter.subsReady('userfunction');
      //  		return true;
      //  }else{
	   		// // console.log(FlowRouter.subsReady('userfunction' ,'state' ,'area'));
      //  	return true;
      //  }
      return Meteor.subscribe('userfunction').ready();
    },
});

Template.footer.helpers({
	currentYear(){
		return (new Date()).getFullYear();
	},
	// currentCity(){
	// 	var userId = Meteor.userId();
	// 	if(userId){
	// 		var cityObject = Meteor.users.findOne({"_id":userId});
	// 		if(cityObject.selectedCity){
	// 			var currentCity = cityObject.selectedCity;
	// 		}else {
	// 			var currentCity = "Pune";
	// 		}
	// 	}else{
	// 		var city = FlowRouter.getParam('city');
	// 		if(city){
	// 			currentCity = city;
	// 		}else{
	// 			var cityNew = Session.get('rxtNxtCityDatlist');
	// 			if(cityNew){
	// 			  var currentCity = cityNew;
	// 			}else{
	// 			  var currentCity = "Pune";
	// 			}
	// 		}

	// 	}
	// 	return currentCity;
	// },

});

Template.header.helpers({
	showElement(){
		var currentUrl = FlowRouter.current().path;
		if(currentUrl == '/' || currentUrl == '/claim'){
			return false;
		}else{
			return true;
		}
	}
});

Template.generalHeader.helpers({
	showElement(){
		var currentUrl = FlowRouter.current().path;
		if(currentUrl == '/' || currentUrl == '/claim'){
			return false;
		}else{
			return true;
		}
	}
});

Template.header.events({
	
	'click .login-btn': function(event){
		$('.genLoginSignup').hide();
		$('.signupScreen').hide();
		$('.thankyouscreen').hide();
		$('.loginScreen').show();
	},

	'click .login': function(event){
		$('.loginScreen').hide();
		$('.signupScreen').hide();
		$('.thankyouscreen').hide();
		$('.genLoginSignup').show();
		$('.thankyouscreen').hide();
		$('.signUpBox').hide();
	},
	'click .loginTxt': function(event){
		$('.loginScreen').hide();
		$('.genLoginSignup').show();
		$('.thankyouscreen').hide();
	},
	'click .signUp-btn': function(event){
		$('.loginScreen').hide();
		$('.genLoginSignup').hide();
		$('.signupScreen').show();
		$('.thankyouscreen').hide();
	},
	'click .signUp-btn1':function(event){
		$('.loginScreen').hide();
		$('.genLoginSignup').hide();
		$('.signUpBox').show();
		$('.thankyouscreen').hide();
	},
	'click .loginTxt1': function(event){
		$('.loginScreen').hide();
		$('.genLoginSignup').show();
		$('.signupScreen').hide();
		$('.thankyouscreen').hide();
	},
	'click .RegisterHere': function(event){
		$('.loginScreen').hide();
		$('.genLoginSignup').hide();
		$('.signupScreen').hide();
		$('.thankyouscreen').hide();
		$('.signUpBox').show();
	},
	'click .loginTxt2': function(event){
		$('.loginScreen').hide();
		$('.genLoginSignup').show();
		$('.signupScreen').hide();
		$('.thankyouscreen').hide();
		$('.signUpBox').hide();
	},
});

Template.footer.events({
	'click .clickAddNewBusi': function(){
    	Session.set("backlinkurl",'');
	},
});

Template.generalHeader.events({
	'click .logoutLink': function(event){
		// Meteor.logout(function(error,result){
		// 	if(error){
		// 		console.log("error",error);
		// 		return;
		// 	}else{
		// 		// FlowRouter.go('/');
		// 		return;
		// 	}
		// });
		Meteor.logout();
		// FlowRouter.go('/');
	},
});

Template.header.onRendered(function(){
	var currentUrl = FlowRouter.current().path;
	// if(currentUrl != '/' || currentUrl != '/claim'){
	// 	$('.login').addClass('login-margin');
	// }

	var windowWidth = $( window ).width();

	$(window).scroll(function() {
	    if ($(document).scrollTop() > 25 && windowWidth >= 767) {
	      $(".transperent_bg").hide();
	      $(".header").addClass("header-fix");
	    } else {
	      $(".transperent_bg").show();
	      $(".header").removeClass("header-fix");
	    }
  	});
  	if(currentUrl == '/claim'){
  		$('#how-a').hide();
  	}

});


Template.generalHeader.onRendered(function(){
	var windowWidth = $( window ).width();

	$(window).scroll(function() {
	    if ($(document).scrollTop() > 25 && windowWidth >= 767) {
	      $(".transperent_bg").hide();
	      $(".header").addClass("header-fix");
	    } else {
	      $(".transperent_bg").show();
	      $(".header").removeClass("header-fix");
	    }
  });
});

// Template.generalHeader.events({
// 	'click .footerImage': function(event){
// 	$("html,body").scrollTop(0);
// 	},
// });


showStarRating = function(){
		var businessLink = FlowRouter.getParam('businessurl');
		var allReviews = Review.find({"businessLink" : businessLink}).fetch();
		var totalRating = 0;
		for(i=0; i<allReviews.length; i++){
			totalRating = totalRating + allReviews[i].rating;
		}
		totalRating = totalRating / allReviews.length ;
		var intRating = parseInt(totalRating);
		var balRating = totalRating - intRating;
		var finalRating = intRating + balRating;
		if(balRating > 0 && balRating < 0.5){
			var finalRating = intRating + 1;
		}
		if(balRating > 0.5){
			var finalRating = intRating + 2
		}

		ratingObj = {
			// "star1" : "",
			// "star2" : "",
			// "star3" : "",
			// "star4" : "",
			// "star5" : "",
			// "star6" : "",
			// "star7" : "",
			// "star8" : "",
			// "star9" : "",
			// "star10": "",
		};

		for(i=1; i<=10; i++){

			var x = "star" + i;
			// console.log('x = ', x);
			if(i <= finalRating*2){
				if( i%2 == 0){
					ratingObj[x] = "fixStar2";
				}else{
					ratingObj[x] = "fixStar1";
				}				
			}else{
				ratingObj[x]  = "";
			}
		
		}

		// console.log(ratingObj);
		return ratingObj;
} 

Template.header.events({
	
	'click .login-facebook': function(e) {
 	       e.preventDefault();

	       Meteor.loginWithFacebook({requestPermissions: ['public_profile', 'email']}, function(err,result){
	           if (err) {
	               console.log('Handle errors here: ', err);
	           }else{
	           	// console.log('result ',result);
	           	Meteor.call('fbLogin',Meteor.userId(),function(err,res){
	           		if(err){
	           			console.log ( err ); 
	           		}else{
			            Meteor.call('addRoles',Meteor.userId(),'user',function(err,res){
		            		if(err){
		            			console.log ( err ); 
		            		}else{
		            				var userInfo = Meteor.users.findOne({"_id":Meteor.userId()});
		            				if(userInfo){
		            					console.log('user Info ',userInfo);
		            				}
					            	FlowRouter.go('/userProfile');
					            	$('#loginModal').hide();
					            	$('.modal-backdrop').hide();
		            		}
		            	});
	           		}
	           	})
	           }
	       });
	   },
	
   //  'click loginfb':function(event){
	  //   checkLoginState();
	  // },
    'click .login-google': function(e) {
        e.preventDefault();

        Meteor.loginWithGoogle({}, function(err){
            if (err) {
                console.log('Handle errors here: ', err);
            }else{
            	// console.log('result ',result);
            	Meteor.call('addRoles',Meteor.userId(),'user',function(err,res){
            		if(err){
            			console.log ( err ); 
            		}else{
			            	FlowRouter.go('/userProfile');
			            	$('.modal-backdrop').hide();
            		}
            	});
            }
        });
    }
});

loadingF = function () {  
  BlazeLayout.render("loadingLayout",{mains: 'loading'});
}

export { loadingF };