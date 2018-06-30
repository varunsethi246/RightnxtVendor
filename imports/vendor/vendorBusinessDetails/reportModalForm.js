import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from '/imports/api/businessMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Template.reportModalForm.events({
	'click #reportSubmit': function(event) {
		event.preventDefault();
		var reportPhoneNumber			= $('#phoneNumber').prop('checked');
		var reportPhotosInappropriate 	= $('#photosInappropriate').prop('checked');
		var reportAddress 				= $('#address').prop('checked');
		var reportDuplicateBusiness 	= $('#duplicateBusiness').prop('checked');
		var reportBusinessHasShutdown 	= $('#businessHasShutdown').prop('checked');
		var reportOther 				= $('#other').prop('checked');
		var	businessLink 				= FlowRouter.getParam("businessurl");
		var reportComment				= $('#reportComment').val();


		var formValues = {
			businessLink 				: businessLink,
			reportPhoneNumber 			: reportPhoneNumber,
			reportInappropriatePhotos 	: reportPhotosInappropriate,
			reportAddress 				: reportAddress,
			reportDuplicateBusiness 	: reportDuplicateBusiness,
			reportBusinessHasShutdown 	: reportBusinessHasShutdown,
			reportOther 				: reportOther,
			reportComment 				: reportComment,
			reportType					: 'business',
		};

		if($('input[type="checkbox"]:eq(0)').prop("checked") || $('input[type="checkbox"]:eq(1)').prop("checked") || $('input[type="checkbox"]:eq(2)').prop("checked") || $('input[type="checkbox"]:eq(3)').prop("checked") || $('input[type="checkbox"]:eq(4)').prop("checked") || $('input[type="checkbox"]:eq(5)').prop("checked")){
			Meteor.call('insertreports',formValues,
			function(error,result){
				if(error){
					Bert.alert('error while inserting data','danger','growl-top-right');
					// console.log(error);
					
				}else{
					Bert.alert('Thank you for your feedback. We will soon get back to you.','success','growl-top-right');
					$('input:checkbox').removeAttr('checked');
					$('#reportComment').val('');
                    $('#reportModal').modal('hide');
                    $('.modal-backdrop').hide(); 
					

					//============================================================
					// 			Notification Email / SMS / InApp
					//============================================================
					var admin = Meteor.users.findOne({'roles':'admin'});
				    if(admin){
				    	var adminId = admin._id;
				    }
					var businessData = Business.findOne({"businessLink":businessLink});
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
								'[username]' 		: vendorname,
			   					'[currentDate]'		: currentDate,
   								'[businessName]'	: businessData.businessTitle,
   								'[reportComment]'	: reportComment
			               	};

							var inputObj = {
								notifPath	 : businessLink,
							    to           : vendorId,
							    templateName : 'Vendor Business Page Report',
							    variables    : msgvariable,
							}

							sendInAppNotification(inputObj);

							var inputObj = {
								notifPath	 : businessLink,
								from         : adminId,
							    to           : vendorId,
							    templateName : 'Vendor Business Page Report',
							    variables    : msgvariable,
							}
							sendMailNotification(inputObj);

							if(businessData.businessMobile){
								var msgvariable = {
									'[username]' 		: userDetail.profile.name,
				   					'[currentDate]'		: currentDate,
									'[businessName]'	: businessData.businessTitle,
									'[reportComment]'	: reportComment
				               	};
								var inputObj = {
								    to           : vendorId,
								    number       : businessData.businessMobile,
								    templateName : 'Vendor Business Page Report',
								    variables    : msgvariable,
								}
								sendSMS(inputObj);

							}
							
							//Send Notification, Mail and SMS to Current User
        					var username 	= userDetail.profile.name;
	                		var date 		= new Date();
	                		var currentDate = moment(date).format('DD/MM/YYYY');
	                		var msgvariable = {
								'[username]' 		: username,
			   					'[currentDate]'		: currentDate,
   								'[businessName]'	: businessData.businessTitle,
   								'[reportComment]'	: reportComment

			               	};
			               	console.log('msgvariable ',msgvariable);
							var inputObj = {
								notifPath	 : businessLink,
								from         : adminId,
							    to           : userId,
							    templateName : 'User Business Page Report',
							    variables    : msgvariable,
							}
			               	console.log('inputObj ',inputObj);

							sendMailNotification(inputObj); 

							//Send Notification and Mail to Admin
							var username 	= userDetail.profile.name;
	                        var date    = new Date();
	                        var currentDate = moment(date).format('DD/MM/YYYY');
	                        var msgvariable = {
	                           '[username]'   	: username,
	                           '[adminname]'    : admin.profile.firstName,
	                           '[currentDate]'  : currentDate,
	                           '[businessName]' : businessData.businessTitle,
   							   '[reportComment]': reportComment

	                        };

	                        var inputObj = {
	                                    notifPath     : businessLink,
	                                    to            : adminId,
	                                    templateName  : 'Admin Business Page Report',
	                                    variables     : msgvariable,
	                        }
	                        sendInAppNotification(inputObj);

	                        var inputObj = {
	                                    notifPath     : businessLink,
	                                    from          : adminId,
	                                    to            : adminId,
	                                    templateName  : 'Admin Business Page Report',
	                                    variables     : msgvariable,
	                        }
	                        sendMailNotification(inputObj); 

        				}
					}
					//============================================================
					// 			End Notification Email / SMS / InApp
					//============================================================

				}
			});
		}else{
			Bert.alert('Please select any of the mentioned issue and then submit.','danger','growl-top-right');
		}
	},

});