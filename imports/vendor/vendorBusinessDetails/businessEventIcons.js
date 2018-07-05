import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

import { Likes } from '/imports/api/businessMaster.js';
import { Review } from '/imports/api/reviewMaster.js';
import { Business } from '/imports/api/businessMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BusinessImage } from '/imports/videoUploadClient/businessImageClient.js';

import './businessEventIcons.html';
import '../../notifications/sendMailnNotification.js';

Template.businessEventIcons.onCreated(function(){
  this.subscribe('businessImage');
});

Template.businessEventIcons.events({
	'click #likeme': function(event){
		event.preventDefault();
		var businessurl = FlowRouter.getParam('businessurl');
		var usersData = Meteor.users.findOne({"_id":Meteor.userId()});
		if(usersData){
			if(usersData.roles){
				if(usersData.roles[0] == "user"){
					if($("#likeme").hasClass('inactivelike')){
						$("#likeme").removeClass('inactivelike');
						$("#likeme").addClass('activelike');
				
						Meteor.call('insertLikes',businessurl,'active',
							function(error,result){
								if(error){
									Bert.alert('Some error occured while liking this page!','danger','growl-top-right','fa-remove');
								}else{

									//============================================================
									// 			Notification Email / SMS / InApp
									//============================================================
									var admin = Meteor.users.findOne({'roles':'admin'});
								    if(admin){
								    	var adminId = admin._id;
								    }
									var businessData = Business.findOne({"businessLink":businessurl});
									if(businessData){
										var vendorId = businessData.businessOwnerId;
										var vendorDetail = Meteor.users.findOne({'_id':vendorId});
										var userId = Meteor.userId();
										var userDetail = Meteor.users.findOne({'_id':userId});
										if(vendorDetail&&userDetail){
																//Send Notification, Mail and SMS to Vendor
											var vendorname 	= vendorDetail.profile.name;
													var date 		= new Date();
													var currentDate = moment(date).format('DD/MM/YYYY');
													var msgvariable = {
																	'[username]' 	  : vendorname,
																	'[currentDate]'	: currentDate,
																	'[businessName]': businessData.businessTitle
														};

																var inputObj = {
																	notifPath	   : businessurl,
																to           : vendorId,
																templateName : 'Vendor Business Page Like',
																variables    : msgvariable,
																}

																sendInAppNotification(inputObj);

																var inputObj = {
																	notifPath	   : businessurl,
																	from         : adminId,
																to           : vendorId,
																templateName : 'Vendor Business Page Like',
																variables    : msgvariable,
																}
																sendMailNotification(inputObj);

																//Send Notification, Mail and SMS to Current User
												var username 	= userDetail.profile.name;
												var date 		= new Date();
												var currentDate = moment(date).format('DD/MM/YYYY');
												var msgvariable = {
																'[username]' 	  : username,
																'[currentDate]'	: currentDate,
																'[businessName]': businessData.businessTitle
														};

																// var inputObj = {
																// 	notifPath	 : businessurl,
																//     to           : vendorId,
																//     templateName : 'Vendor Business Page Like',
																//     variables    : msgvariable,
																// }
																// sendInAppNotification(inputObj);

																var inputObj = {
																	notifPath	   : businessurl,
																	from         : adminId,
																to           : userId,
																templateName : 'User Business Page Like',
																variables    : msgvariable,
																}
																sendMailNotification(inputObj); 

										}
									}
									//============================================================
									// 			End Notification Email / SMS / InApp
									//============================================================
								}
							}
						);			
					}else{
						$("#likeme").removeClass('activelike');
						$("#likeme").addClass('inactivelike');			
				
						Meteor.call('insertLikes',businessurl,'inactive',
							function(error,result){
								if(error){
									Bert.alert('Some error occured while disliking this page!','danger','growl-top-right','fa-remove');
								}else{
									
								}
							}
						);			
					}
				}			
			}else{
				$('#loginModal').modal('show');
				$('.loginScreen').hide();
				$('.signupScreen').hide();
				$('.thankyouscreen').hide();
				$('.genLoginSignup').show();
				$('.thankyouscreen').hide();
				$('.signUpBox').hide();
			}
		}else{
			$('#loginModal').modal('show');
			$('.loginScreen').hide();
			$('.signupScreen').hide();
			$('.thankyouscreen').hide();
			$('.genLoginSignup').show();
			$('.thankyouscreen').hide();
			$('.signUpBox').hide();
		}
	},
	'mouseover #likeme':function(){
		event.preventDefault();
		$('.tooltipone').tooltip({title: "Like", trigger: "hover"});
	},
	'mouseover #bookmark':function(){
		event.preventDefault();
		$('.tooltiptwo').tooltip({title: "Bookmark", trigger: "hover"});
	},
	'mouseover #beenThere':function(){
		event.preventDefault();
		$('.tooltipthree').tooltip({title: "Been There", trigger: "hover"});
	},
	'mouseover #share':function(){
			event.preventDefault();
			$('.tooltipfour').tooltip({title: "Share", trigger: "hover"});
	},

	'click .your-rating':function(){
		event.preventDefault();
		if(!(Meteor.userId())){
			$('#loginModal').modal('show');
			$('.loginScreen').hide();
			$('.signupScreen').hide();
			$('.thankyouscreen').hide();
			$('.genLoginSignup').show();
			$('.signUpBox').hide();
		}
	},

	'click .businessSharePage': function(event){
		if(!(Meteor.userId())){
			$('#loginModal').modal('show');
			$('#sharebtn').hide();
			$('.loginScreen').hide();
			$('.signupScreen').hide();
			$('.thankyouscreen').hide();
			$('.genLoginSignup').show();
			$('.signUpBox').hide();
			$('#share_page3').modal('hide');
		}
	},

	'click #busiRate':function(event){
		if(Meteor.userId()){
			var userReview = Review.findOne({"userId":Meteor.userId()});
			if(userReview){
				// businessObj.alreadyReviewed = true;	
			}else{
				// businessObj.alreadyReviewed = false;
				$('.openReview').show();	
				$('.writeReview').focus();
				$('.publishReview').hide();
				$('.socailShare').hide();	
			}
		}

	},

	'click .businessDetailsreview': function(event){
		if(Meteor.userId()){
			var userReview = Review.findOne({"userId":Meteor.userId()});

			
			if(userReview){
				$('.userReviews').focus();
			}else{
				$('.openReview').show();	
				$('.writeReview').focus();
				$('.publishReview').hide();
				$('.socailShare').hide();	
			}

			// To Scroll to old Review
			var businessLink = FlowRouter.getParam('businessurl');
			var oldUserReview = Review.findOne({"userId":Meteor.userId(),"businessLink":businessLink});
			if(oldUserReview && oldUserReview._id){
				$('html, body').animate({
					scrollTop: $("#scrollToReview-"+oldUserReview._id).offset().top-230
				}, 500);
			}else{
				$('html, body').animate({
					scrollTop: $("#publish3").offset().top-230
				}, 500);
			}

		}else{
			$('#loginModal').modal('show');
			$('.loginScreen').hide();
			$('.signupScreen').hide();
			$('.thankyouscreen').hide();
			$('.genLoginSignup').show();
			$('.signUpBox').hide();
		}


		// $('html, body').animate({ 'scrollTop': $('.writeReview').height() }, 1200);
	},

	'click .reviewClose': function(event){
		console.log($('.reviewClose').parent().attr('class'));
	    $('.reviewClose').parent('.openReview').hide();
	    $('.publishReview').show();	
	},

	'click .fbShareDiv':function(event){
		var id = $('.fbShareDiv').attr('id');
		var url = window.location.href;

		var businessData = Business.findOne({'_id':id});
		if(businessData){
			var title       = businessData.businessTitle;
			var desp = businessData.businessAboutBus;
			if(desp){
				var description = desp.slice(0, 150);
			}else{
				var description = "Welcome to my page";
			}
			
			if(businessData.businessImages && businessData.businessImages.length>0){
				var pic = BusinessImage.findOne({"_id":businessData.businessImages[0].img});
				if(pic){
					businessData.businessImages = pic.path;
				}else{
					businessData.businessImages = '/images/rightnxt_image_nocontent.jpg';
				}

			}else{
				businessData.businessImages = '/images/rightnxt_image_nocontent.jpg';
			}

			var img = businessData.businessImages;
			var image = 'https://rightnxt.s3.amazonaws.com/BusinessImages/'+img;

			
			fbShare(url,title,description,image,id);
		}//businessData
		// }//reviewData
		
	},

	'click .gpShareDiv ':function(){
		var destination = window.location.href;
		googleplusshare(destination);

	},
	'click .shareBussPage': function(event){
		var currentUserMail = $('#toVEmail').val();
		var currentUserNote = $('#toVAddNote').val();
		var businessLink = FlowRouter.getParam('businessurl');
		var currentPath = Meteor.absoluteUrl(businessLink);
		var businessData = Business.findOne({"businessLink":businessLink});
		var nameRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
		if (currentUserMail==null||currentUserMail==""||!currentUserMail.match(nameRegex)) {
			Bert.alert('Please enter correct Email','danger','growl-top-right');
		} else {
			if(currentUserMail&&currentPath&&businessData){
				//============================================================
				// 			Notification Email / SMS / InApp
				//============================================================
				var currentUserId = Meteor.userId();
				var currentUser = Meteor.users.findOne({'_id':currentUserId});
	
				var admin = Meteor.users.findOne({'roles':'admin'});
				if(admin){
					var adminId = admin._id;
				}
	
				if(currentUser&&admin){
					var username = currentUser.profile.name;
	
					//Send Mail to Shared User Email
					var date 		= new Date();
					var currentDate = moment(date).format('DD/MM/YYYY');
					var msgvariable = {
						'[username]' 		: username,
						'[currentDate]'		: currentDate,
						'[businessName]'	: businessData.businessTitle,
						'[currentPath]' 	: currentPath,
						'[note]'			: currentUserNote,
					   };
	
					var inputObj = {
						from         : adminId,
						to           : currentUserMail,
						templateName : 'Business Page Share',
						variables    : msgvariable,
					}
					sendPageShareMail(inputObj);
					$('#share_page3').modal('hide');
					
				}
				
				//============================================================
				// 			End Notification Email / SMS / InApp
				//============================================================
			}
	
			$('#toVEmail').val('');
			$('#toVAddNote').val('');
		}
		
	},

});

Template.businessEventIcons.helpers({
	showRating(){
		// userId,businessLink
		var userId = Meteor.userId();
		var businessLink = FlowRouter.getParam('businessurl');
		var ratingInt = Review.findOne({"userId" : userId,"businessLink":businessLink});
		if(ratingInt){

		}
		var latestRating = ratingInt.rating;

		var intRating = parseInt(latestRating);
		var balRating = latestRating - intRating;
		var finalRating = intRating + balRating;
		if(balRating > 0 && balRating < 0.5){
			var finalRating = intRating + 0.5;
		}
		if(balRating > 0.5){
			var finalRating = intRating + 1;
		}

		ratingObj = {};

		for(i=1; i<=10; i++){
			var x = "star" + i;
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

		return ratingObj;
	},
});

Template.businessEvntIcons2.events({

	'click .nonuserreview': function(event){
		$('#nonuserreview').show();

	},

});

fbShare = function(URL,title,description,image,id){

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1441873185871088',
      xfbml      : true,
      version    : 'v2.10'
    });

    FB.ui({
        method: 'share_open_graph',
        action_type: 'og.shares',
        action_properties: JSON.stringify({
            object : {
               'og:url'        : URL, 
               'og:title'      : title,
               'og:description': description,
               'og:image'      : image 
            }
        })
        },
      function(response) {
      	console.log("response: ",response);
      });


  };
}

 googleplusshare = function(url) {
  sharelink = "https://plus.google.com/share?url="+url;
  newwindow=window.open(sharelink,'name','height=400,width=600');
  if (window.focus) {newwindow.focus()}                                                                                                                                
  return false;
}  


