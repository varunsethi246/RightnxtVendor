import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';
import { Accounts } from 'meteor/accounts-base'; 

import { State } from '/imports/api/masterData/stateMaster.js';
import { City } from '/imports/api/masterData/cityMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../userLayout.js';
import './editProfile.js';
import './editProfile.html';
import './profileSettingSidebar.js';
import './profileSettingLayout.html';

Template.editProfile.helpers({
	userProfileData(){
		// console.log('Meteor.users.findOne({"_id":Meteor.userId()})')
		return Meteor.users.findOne({"_id":Meteor.userId()});
	},
	masterState(){
      var states = State.find({'status':'active'}).fetch();
      if(states){
      	var userProfileObj = Meteor.users.findOne({"_id":Meteor.userId()});	
      	if(userProfileObj){
      		userState = userProfileObj.profile.state;
      		if (userState) {
     			for (i=0; i<states.length; i++) {
      				if(userState == states[i].state){
      					states[i].selected = 'selected';
      				}else{
      					states[i].selected = '';
      				}
      			}
      		}
      	}
      }
      // console.log(states);
      return states;
    },
    masterCity() {
      	var userProfileObj = Meteor.users.findOne({"_id":Meteor.userId()});	
      	if(userProfileObj){
      		userCity = userProfileObj.profile.city;
	      	if(Session.get('stateValue')){
	      		var fields = {"state": Session.get('stateValue')};
	      	}else{
	      		var fields = {"state": userProfileObj.profile.state };
	      	}
	      	var cities = City.find(fields).fetch();
		      // console.log(cities);

      		if (cities) {
     			for (i=0; i<cities.length; i++) {
      				if(userCity == cities[i].city){
      					cities[i].selected = 'selected';
      				}else{
      					cities[i].selected = '';
      				}
      			}
  			}
      	}
      return cities;

    },

});

Template.editProfile.events({
	'change #stateopt': function(event){
		event.preventDefault();
		var stateInputVal = $("#stateopt").val();
		Session.set('stateValue', stateInputVal);
	},
	// 'change .pinCodess': function(event){
	// 	var myFuncVar = $(".pinCodess").val();
 //        var nameRegex = /^\d{6}(?:[-\s]\d{6})?$/;

 //        if (myFuncVar==null||myFuncVar==""||!myFuncVar.match(nameRegex)) {
 //            $(".spanSettingZipCode").addClass("ErrorRedText");
 //            $(".pinCodess").addClass("SpanLandLineRedBorder");
 //            $( ".spanSettingZipCode" ).text("Please Enter Valid Zip Code" );

 //        } else {
 //            $(".spanSettingZipCode").removeClass("ErrorRedText");
 //            $(".pinCodess").removeClass("SpanLandLineRedBorder");
 //            $( ".spanSettingZipCode" ).text("");
 //        }
	// },
	// 'change #area': function(event){
	// 	 var myFuncVar = $("#area").val();
 //         var nameRegex = /^[A-Za-z0-9 ]{2,100}$/;
 //         if (myFuncVar==null||myFuncVar==""||!myFuncVar.match(nameRegex)) {
 //            $(".spanSettingArea").addClass("ErrorRedText");
 //            $("#area").addClass("SpanLandLineRedBorder");
 //            $( ".spanSettingArea" ).text("Please Enter Valid Area" );

 //         } else {
 //            $(".spanSettingArea").removeClass("ErrorRedText");
 //            $("#area").removeClass("SpanLandLineRedBorder");
 //            $( ".spanSettingArea" ).text("" );
 //         }
	// },
	'change .settingMobile': function(event){
		 var myFuncVar = $(".settingMobile").val();
         var nameRegex = /^(\+91-|\+91|0)?\d{10}$/;
         if (myFuncVar&&!myFuncVar.match(nameRegex)) {
            $(".spanSettingMobile").addClass("ErrorRedText");
            $(".settingMobile").addClass("SpanLandLineRedBorder");
            $( ".spanSettingMobile" ).text("Please Enter Valid Mobile Number" );
         } else {
            $(".spanSettingMobile").removeClass("ErrorRedText");
            $(".settingMobile").removeClass("SpanLandLineRedBorder");
            $( ".spanSettingMobile" ).text("");
         }
	},

   'keydown #comment':function(event){
      setTimeout(function() {
         var comment = $('#comment').val();
         if(comment){
            var commentlen = comment.length;
            var remainText = 140 - commentlen;
            $('.textRemain').text(remainText + ' Characters Remaining');
         }else{
            $('.textRemain').text('140 Characters Remaining');
         }
      }, 1);
   },
	
	'submit #editProfileForm': function(event){
		event.preventDefault();
		var currentUser = Meteor.users.findOne({"_id":Meteor.userId()});
		// console.log("currentUser",currentUser);
		var userProfilePic = currentUser.profile.userProfilePic;
		// console.log("userProfilePic",userProfilePic);
    
		var formValues = {
			name		   	    : event.target.name.value,
			state 		      : event.target.state.value,
			city 			      : event.target.city.value,
			// area 			: event.target.area.value,
			// pincode			: event.target.pincode.value,
			aboutMe		      : event.target.aboutMe.value,
			mobile		      : event.target.mobile.value,
			status  	      : "Active",
      userProfilePic  : userProfilePic,


		};

		var errorIn = '';
	    if ($(".ErrorRedText").length > 0) {
	        errorIn = "true";
	    }

	    if(errorIn!="true"){
	     	Meteor.call('updateUserProfile',formValues, function(err,result){
				if(err){
					console.log(err);
					Bert.alert('There is some error in editing your Profile', 'danger', 'growl-top-right');
				}else{
					Bert.alert('Your profile edited successfully!!!', 'success', 'growl-top-right');
				}
			});
	    } else {
         	// $('.SpanLandLineRedBorder:visible:first').focus();
	    }


		

	},

});

// Template.editProfile.onRendered(function(){
//  	$.validator.addMethod("regxx1", function(value, element, regexpr) {          
//       return regexpr.test(value);
//   	}, "Name should only contain alphabets and spaces.");

//  	$.validator.addMethod("regxx2", function(value, element, regexpr) {          
//       return regexpr.test(value);
//   	}	, "Please Enter Valid Mobile Number");

//   	$("#editProfileForm").validate({
// 	    rules: {
// 	          name: {
// 	            required : true,
// 	            regxx1: /^[\sa-zA-Z]+$/,
// 	          },
	 
// 	          regxx2: {
// 	            required : true,
// 	            reget:  /^(\+91-|\+91|0)?\d{10}$/,
// 	          },
	  
// 	    }
// 	});
// });

editProfileForm = function () {  
  BlazeLayout.render("profileSettingLayout",{profileSettings: 'editProfile'});
  // Blaze.render(Template.userLayout,document.body);
}
export { editProfileForm }