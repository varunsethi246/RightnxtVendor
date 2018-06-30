import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';

import { ContactUs } from '../../api/webPages/contactUsMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../generalLayout/generalLayout.js'
import './contactUs.html';


Template.contactUs.onCreated(function () {
	this.subscribe('businessImgS3');  
	this.subscribe('area');
	this.subscribe('notification');
	this.subscribe('userfunction');
	this.subscribe('notificationTemplate') ;  
	this.subscribe('userProfileS3');  
	
});

Template.contactUs.helpers({
	getCityName(){
		var currentCity = FlowRouter.getParam('city');
		return currentCity;		
	}
});

Template.contactUs.events({
	'keydown #contactMblNumber': function(e){
      if ($.inArray(e.keyCode, [8, 9, 27, 13]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true))||
            (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true))||
            (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true))||
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode===190 || e.keyCode===46 || e.keyCode===110)) {
            e.preventDefault();
        }
   },
   'focusout #contactMblNumber': function(){
         var myFuncVar = $("#contactMblNumber").val();
         var nameRegex = /^\d+$/;
         var nameRegexLandLine = /^([0-9\-\s]{2,5}[0-9]{6,8})$/;
         // var mylandLine = $("#businessLandline").val();

        if(myFuncVar){
          // 1. condition
          if(myFuncVar){
            if(myFuncVar){
              if(myFuncVar.length<10){
                $(".SpanMobileErrors").addClass("ErrorRedText");
                $(".businessMobileC").addClass("SpanLandLineRedBorder");
                $(".SpanMobileErrors").text("Please Enter Valid 10 digit Mobile Number");
              }
            }
          }
          if(!myFuncVar.match(nameRegexLandLine)){
            $(".SpanMobileErrors").removeClass("ErrorRedText");
            $(".businessMobileC").removeClass("SpanLandLineRedBorder");
            $(".SpanMobileErrors").text("");
          }
          // 2. condition
          if(myFuncVar){
            if(myFuncVar.length<10){
              $(".SpanMobileErrors").addClass("ErrorRedText");
              $(".businessMobileC").addClass("SpanLandLineRedBorder");
              $(".SpanMobileErrors").text("Please Enter Valid 10 digit Mobile Number");
            }
            if(myFuncVar.length==10){
                $(".SpanMobileErrors").removeClass("ErrorRedText");
                $(".businessMobileC").removeClass("SpanLandLineRedBorder");
                $(".SpanMobileErrors").text("");
            }
          }
          // 3. condition
        }
        //Condition 4
        if(!myFuncVar){
          $(".SpanMobileErrors").addClass("ErrorRedText");
          $(".businessMobileC").addClass("SpanLandLineRedBorder");
          $(".SpanMobileErrors").text("Please Enter Valid 10 digit Mobile Number");
        }
    },
	'focusout input[name="name"]': function(event){
		if($(event.target).val() != ''){
			$('#name-error').html('Name should only contains uppercase, lowercase letters and space.');
		}
	},
	'submit #contactUsFrom': function(event){
		event.preventDefault();
		var formValues = {
			"name" 				: event.target.name.value,
			"email" 			: event.target.email.value,
			"phoneNo" 			: event.target.phoneNo.value,
			"howCanWeHelpYou" 	: event.target.howCanWeHelpYou.value,
			"message" 			: event.target.message.value,
		};

		Meteor.call('insertContactUs', formValues,
			function(error,result){
				if(error){
					Bert.alert('Error occurs in submitting message.', 'danger', 'growl-top-right' );
					return;
				}else{
					var toEmail = 'rightnxt123@gmail.com';
					var fromEmail = formValues.email;
					var subj = formValues.howCanWeHelpYou;
					var msg = '<div class="msgMar">' + formValues.name + ' has contacted for the query ' + formValues.howCanWeHelpYou + '.</div><br><div><h4>Conatct details:</h4><span class="msgSpan"><b>Name - </b>' + formValues.name + '</span><br><span class="msgSpan"><b>Email - </b>' + formValues.email + '</span><br><span class="msgSpan"><b>Mobile - </b>' + formValues.phoneNo + '</span><br><span class="msgSpan"><b>Message - </b>' +formValues.message+ '</span></div>'
					Meteor.call('sendEmailRightNxt', toEmail, fromEmail, subj, msg,function(error,result){
						if(error){
							Bert.alert(error.reason, 'danger', 'growl-top-right' );
							return;
						}else{
							// Bert.alert('Thanks for writing to us, we will contact you shortly.','success','growl-top-right');
						}
					});
					Bert.alert('Thanks for writing to us, we will contact you shortly.', 'success', 'growl-top-right' );	
					event.target.name.value				= '';
					event.target.email.value			= '';
					event.target.phoneNo.value			= '';
					event.target.howCanWeHelpYou.value	= '--select--';
					event.target.message.value			= '';
					return;
				}
			}
		);
	},

});

Template.contactUs.onRendered(function(){
	$('html, body').scrollTop(0);
	
	$.validator.addMethod("regx10", function(value, element, regexpr) {          
    	return regexpr.test(value);
	}, "Name should only contains uppercase, lowercase letters and space.");

	$.validator.addMethod("regx11", function(value, element, regexpr) {          
    	return regexpr.test(value);
	}, "Please enter a valid email address.");
	
	// $.validator.addMethod("regx12", function(value, element, regexpr) {          
 //    	return regexpr.test(value);
	// }, "Please enter a valid mobile number.");
	
	$("#contactUsFrom").validate({
	 	rules: {
	        name: {
	            required: true,
	            regx10: /^[A-za-z'\s]+( [A-Za-z'\s]+)*$/,
	        },
	        // phoneNo: {
	        // 	// required: true,
	        // 	regx12: /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,	
	        // },
	        email: {
	        	required: true,
	        	regx11: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
	        },
    	}
	});
});



contactUsForm = function () {  
  BlazeLayout.render("generalLayoutWithImage",{generalcontent: 'contactUs'});
  // Blaze.render(Template.vendorLayout,document.body);
}

export { contactUsForm };