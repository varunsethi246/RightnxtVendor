import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from '/imports/api/businessMaster.js';
import { BeenThere } from '/imports/api/beenThereMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './businessEventIcons.html';
import '../../notifications/sendMailnNotification.js';

Template.businessEventIcons.events({
	'click #bookmark' : function(event) {
		event.preventDefault();
		var businessurl = FlowRouter.getParam('businessurl');
	    var userId = Meteor.userId();


		var usersData = Meteor.users.findOne({"_id":userId});
		if(usersData){
			if(usersData.roles){
				if(usersData.roles[0] == "user"){
					if($("#bookmark").hasClass('inactiveBookmark')){
						$("#bookmark").removeClass('inactiveBookmark');
						$("#bookmark").addClass('activeBookmark');
				
						var businessurl = FlowRouter.getParam('businessurl');
						Meteor.call('insertBookmark',businessurl,'active',
							function(error,result){
								if(error){
									Bert.alert('Some error occured while bookmark this page!','danger','growl-top-right','fa-remove');
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

                        				if(vendorDetail&&usersData){

				        					//Send Notification, Mail and SMS to Vendor
                        					var vendorname 	= vendorDetail.profile.name;
					                		var date 		= new Date();
					                		var currentDate = moment(date).format('DD/MM/YYYY');
					                		var msgvariable = {
												'[username]' 	: vendorname,
							   					'[currentDate]'	: currentDate,
				   								'[businessName]': businessData.businessTitle

							               	};

											var inputObj = {
												notifPath	 : businessurl,
											    to           : vendorId,
											    templateName : 'Vendor Business Page Bookmark',
											    variables    : msgvariable,
											}
											sendInAppNotification(inputObj);

											var inputObj = {
												notifPath	 : businessurl,
												from         : adminId,
											    to           : vendorId,
											    templateName : 'Vendor Business Page Bookmark',
											    variables    : msgvariable,
											}
											sendMailNotification(inputObj);

											//Send Notification, Mail and SMS to Current User
                        					var username 	= usersData.profile.name;
					                		var date 		= new Date();
					                		var currentDate = moment(date).format('DD/MM/YYYY');
					                		var msgvariable = {
												'[username]' 	: username,
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
												notifPath	 : businessurl,
												from         : adminId,
											    to           : userId,
											    templateName : 'User Business Page Bookmark',
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
						$("#bookmark").removeClass('activeBookmark');
						$("#bookmark").addClass('inactiveBookmark');			
				
						var businessurl = FlowRouter.getParam('businessurl');
						Meteor.call('insertBookmark',businessurl,'inactive',
							function(error,result){
								if(error){
									Bert.alert('Some error occured while removing bookmark page!','danger','growl-top-right','fa-remove');
								}else{
									// Bert.alert('Ohh... sorry to see you removing bookmark our business!','success','growl-top-right','fa-check');
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

	'click #beenThere' : function(event) {
		event.preventDefault();
		var businessurl = FlowRouter.getParam('businessurl');
	    var userId = Meteor.userId();

		var usersData = Meteor.users.findOne({"_id":userId});
		if(usersData){
			if(usersData.roles){
				if(usersData.roles[0] == "user"){
					if($("#beenThere").hasClass('inactiveBeenThere')){
						$("#beenThere").removeClass('inactiveBeenThere');
						$("#beenThere").addClass('activeBeenThere');
				
						var businessurl = FlowRouter.getParam('businessurl');
						Meteor.call('insertBeenThere',businessurl,'active',
							function(error,result){
								if(error){
									Bert.alert('Some error occured while event!','danger','growl-top-right','fa-remove');
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

                        				if(vendorDetail&&usersData){

				        					//Send Notification, Mail and SMS to Vendor
                        					var vendorname 	= vendorDetail.profile.name;
					                		var date 		= new Date();
					                		var currentDate = moment(date).format('DD/MM/YYYY');
					                		var msgvariable = {
												'[username]' 	: vendorname,
							   					'[currentDate]'	: currentDate,
				   								'[businessName]': businessData.businessTitle

							               	};

											var inputObj = {
												notifPath	 : businessurl,
											    to           : vendorId,
											    templateName : 'Vendor Business Page Been There',
											    variables    : msgvariable,
											}
											sendInAppNotification(inputObj);

											var inputObj = {
												notifPath	 : businessurl,
												from         : adminId,
											    to           : vendorId,
											    templateName : 'Vendor Business Page Been There',
											    variables    : msgvariable,
											}
											sendMailNotification(inputObj);

											//Send Notification, Mail and SMS to Current User
                        					var username 	= usersData.profile.name;
					                		var date 		= new Date();
					                		var currentDate = moment(date).format('DD/MM/YYYY');
					                		var msgvariable = {
												'[username]' 	: username,
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
												notifPath	 : businessurl,
												from         : adminId,
											    to           : userId,
											    templateName : 'User Business Page Been There',
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
						$("#beenThere").removeClass('activeBeenThere');
						$("#beenThere").addClass('inactiveBeenThere');			
				
						var businessurl = FlowRouter.getParam('businessurl');
						Meteor.call('insertBeenThere',businessurl,'inactive',
							function(error,result){
								if(error){
									Bert.alert('Some error occured while this event!','danger','growl-top-right','fa-remove');
								}else{
									// Bert.alert('Ohh... sorry to see you removing back from been there!','success','growl-top-right','fa-check');
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
});