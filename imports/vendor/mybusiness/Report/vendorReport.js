import './vendorReport1.html';
// import './vendorReport.html';
import './businessReport.html';
import './imageReport.html';
import '../../vendorBusinessDetails/reportModalForm.html';

import { Business } from '/imports/api/businessMaster.js';
import { Reports } from '/imports/api/reportMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { VendorImage } from '/imports/videoUploadClient/vendorImageClient.js';
import { BusinessImage } from '/imports/videoUploadClient/businessImageClient.js';
import { ReviewImage } from '/imports/videoUploadClient/reviewImageClient.js';
import { BusinessMenu } from '/imports/videoUploadClient/businessMenuClient.js';

import '../../vendor.js';

// var tabStatus = '';
// Template.businessReport.onCreated(function(){
//   this.subscribe('vendorImage');
// });
// Template.imageReport.onCreated(function(){
//   this.subscribe('vendorImage');
//   this.subscribe('businessImage');
// });
Template.vendorReport.helpers({
	'businessReports': function (){
		var businessLink = FlowRouter.getParam('businessLink');
		var reports = Reports.find({"businessLink":businessLink},{sort:{'createdAt':-1}}).fetch();
		// console.log(reports);
		var reportcount = Counts.get('VendorReportCount');

		// Added only to format time
		if(reports){
			for(i=0;i<reports.length;i++){
				reports[i].createdAt = moment(reports[i].createdAt).fromNow();
				// if(reports[i].mailStatus=='block'){
				// 	reports[i].status = true;
				// }else{
				// 	reports[i].status = false;
				// }
			}
		}

		if(reports){
			var businessObj = Business.find({"businessLink":businessLink,"status": "active"});
			var reportDataReturn = {
				noofreports			: reportcount,
				reportBusinessArray	: [],
				reportImageArray	: [],
				// "businessTitle" : businessObj.businessTitle,
			}
			if(reports.length > 0){
				reportDataReturn.reportData = true;
				for(i = 0 ; i < reports.length ; i ++){
						if(reports[i].reportType == 'business')
						{
							
							if(reports[i].mailStatus === 'block'){
								// console.log('in if');
								reports[i].status = false;
							}else{
								// console.log('in else');

								reports[i].status = true;
							}

							var userObj = Meteor.users.findOne({'_id':reports[i].userid});
							if(userObj){
								reports[i].isUserDeleted = false;
							}else{
								reports[i].isUserDeleted = true;
							}

							reportDataReturn.reportBusinessArray.push(reports[i]);
						}
						if(reports[i].reportType == 'image')
						{
							if(reports[i].mailStatus === 'block'){
								reports[i].status = false;
							}else{
								reports[i].status = true;
							}

							var userObj = Meteor.users.findOne({'_id':reports[i].userid});
							if(userObj){
								reports[i].isUserDeleted = false;
							}else{
								reports[i].isUserDeleted = true;
							}

							reportDataReturn.reportImageArray.push(reports[i]);
							
						}
					}
			}
			// console.log(reportDataReturn);
			return reportDataReturn;
		}
	},
	'businessName' : function(){
		var businessLink = FlowRouter.getParam('businessLink');
		var businessObj = Business.findOne({"businessLink":businessLink,"status": "active"});
		if(businessObj){
			var ReportsCount = Reports.find({"businessId":businessObj._id}).count();
			var value = {
							"businessTitle" : businessObj.businessTitle,
							"ReportsCount"		: ReportsCount,
						}
			return value;
		}

	},
	or: function(a, b) {
        return a || b;
    },
	

});

Template.businessReport.helpers({
	'busReportVendorImg':function(userid){

		// console.log('userObj:',userid);
		var userObj = Meteor.users.findOne({"_id":userid});
		if (userObj){
			if(userObj.profile.userProfilePic){
				var pic = VendorImage.findOne({"_id":userObj.profile.userProfilePic});
				if(pic){
					userProfilePic = pic.link();	
				}
				else{
					userProfilePic = "/users/profile/profile_image_dummy.svg";	
				}
			}else{
				userProfilePic = "/users/profile/profile_image_dummy.svg";
			}
		}else{
			userProfilePic = "/users/profile/profile_image_dummy.svg";
		}

		// console.log("userProfilePic: ",userProfilePic);
		objImg = {
			"userProfilePic":userProfilePic,
		}
		// console.log('objImg :',objImg);
		return objImg;
	}
});

Template.imageReport.helpers({
	'businessName' : function(){
		var businessLink = FlowRouter.getParam('businessLink');
		var businessObj = Business.findOne({"businessLink":businessLink,"status": "active"});
		if(businessObj){
			var ReportsCount = Reports.find({"businessId":businessObj._id}).count();
			var value = {
							"businessTitle" : businessObj.businessTitle,
							"ReportsCount"	: ReportsCount,
						}
			return value;
		}
	},
	'imageReportPic':function(imgId){
		var imgData = BusinessImage.findOne({"_id":imgId});
		if(imgData)
		{
			var data = {
				img : imgData.link(),
			};
		}else{
			var imgData1 = ReviewImage.findOne({"_id":imgId});
			if(imgData1){
				var data = {
					img : imgData1.link(),
				};	
			}else{
				var imgData2 = BusinessMenu.findOne({"_id":imgId});
				if(imgData2){
					var data = {
						img : imgData2.link(),
					};	
				}else{			
					var data = {
						img : 'https://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/general/rightnxt_image_nocontent.jpg',
					};
				}
			}
		}
		return data;
	},
	'reportVendorImg':function(userid){
		var userObj = Meteor.users.findOne({"_id":userid});
		if (userObj){
			if(userObj.profile.userProfilePic){
				var pic = VendorImage.findOne({"_id":userObj.profile.userProfilePic});
				if(pic){
					userProfilePic = pic.link();	
				}
				else{
					userProfilePic = "/users/profile/profile_image_dummy.svg";	
				}
			}else{
				userProfilePic = "/users/profile/profile_image_dummy.svg";
			}
		}else{
			userProfilePic = "/users/profile/profile_image_dummy.svg";
		}
		// console.log("userProfilePic: ",userProfilePic);
		objImg = {
			"userProfilePic":userProfilePic,
		}
		return objImg;
	},

});


Template.imageReport.events({

	'click .delete':function(event){
		event.preventDefault();

		var modelid = $(event.target).parent().parent().parent().parent().parent().attr('id');
		var id  = modelid.split("-");
		// console.log('delete id ' + id[1]);
		Meteor.call('removeImageReport',id[1],function(error,result){
			if(error){
				Bert.alert(error.reason,"danger",'growl-top-right');
			}else{
				Bert.alert('Deleted','success','growl-top-right');
			}
		});
		$('.modal-backdrop').hide();
	},
	'click .sendBusImgReportEmail':function(event){
		event.preventDefault();
		var userId = Meteor.userId();
		var adminUser 	= Meteor.users.findOne({'roles':'admin'});
		if(adminUser){
			var adminID		= adminUser._id;
			var userDetails = Meteor.users.findOne({'_id':userId});
			if(userDetails){
				var email = $(event.currentTarget).attr('id');
				var res = email.split(" ");
				var userID = res[1];
				// Session.set('reportId',userID);
				// console.log('userID :',userID);
				var userDet = Reports.findOne({'_id':userID});
				var idUser = Reports.findOne({'_id':userID}).userid;
				// console.log('idUser :',idUser);
				if(userDet){

					var usermailID = userDet.userid;
					// console.log('usermailID:',usermailID);
					Meteor.call('updateReportStatus',userID,function(error,result){
						if(error){
							Bert.alert(error.reason,"danger",'growl-top-right');
						}else{
							// console.log('in clicnt ',userID)
							if(userDetails){
								var mailAdmin 		= userDetails.emails[0].address;
								var date 			= new Date();
								var currentDate 	= moment(date).format('DD/MM/YYYY');
								var businessLink 	= FlowRouter.getParam('businessLink');
								var businessDetails = Business.findOne({"businessLink":businessLink});

								if(businessDetails){
									var msgvariable = {
										'[currentDate]'	: currentDate,
										'[businessName]': businessDetails.businessTitle,
							       	};
									// user
									var inputObj = {
										notifPath	 : "",
										from 		 : userId,
									    to           : usermailID,
									    templateName : 'business-image-report-acknowledged',
									    variables    : msgvariable,
									}
									sendMailNotification(inputObj);

									var inputObj = {
										notifPath	 : "",
									    to           : usermailID,
									    templateName : 'business-image-report-acknowledged',
									    variables    : msgvariable,
									}

									sendInAppNotification(inputObj);
									// admin
									var inputObj = {
										notifPath	 : "",
										from 		 : userId,
									    to           : adminID,
									    templateName : 'business-image-report-acknowledged',
									    variables    : msgvariable,
									}
									sendMailNotification(inputObj);

									var inputObj = {
										notifPath	 : "",
									    to           : adminID,
									    templateName : 'business-image-report-acknowledged',
									    variables    : msgvariable,
									}

									sendInAppNotification(inputObj);  

									Bert.alert('Mail send successfully.','success','growl-top-right');

								}

							}
							// Bert.alert('Deleted','success','growl-top-right');
						}
					});

				}
		}
		}
	},

});

Template.businessReport.events({
	'click .delete':function(event){
		event.preventDefault();

		var modelid = $(event.target).parent().parent().parent().parent().parent().attr('id');
		var id  = modelid.split("-");
		// console.log('delete id ' + id[1]);
		Meteor.call('removeImageReport',id[1],function(error,result){
			if(error){
				Bert.alert(error.reason,"danger",'growl-top-right');
			}else{
				Bert.alert('Deleted','success','growl-top-right');
			}
		});
		$('.modal-backdrop').hide();
	},

	'click .sendBussReportEmail':function(event){
		event.preventDefault();
		var userId 		= Meteor.userId();
		var adminUser 	= Meteor.users.findOne({'roles':'admin'});
		var adminID		= adminUser._id;
		var userDetails = Meteor.users.findOne({'_id':userId});
		var email 		= $(event.currentTarget).attr('id');
		var res 		= email.split(" ");
		var userID 		= res[1];
		var userDet 	= Reports.findOne({'_id':userID});
		var usermailID 	= userDet.userid;

		Meteor.call('updateReportStatus',userID,function(error,result){
			if(error){
				Bert.alert(error.reason,"danger",'growl-top-right');
			}else{
				if(userDetails){
					var date 			= new Date();
					var currentDate 	= moment(date).format('DD/MM/YYYY');
					var businessLink 	= FlowRouter.getParam('businessLink');
					var businessDetails = Business.findOne({"businessLink":businessLink});
					if(businessDetails){
						var msgvariable = {
							'[currentDate]'	: currentDate,
							'[businessName]': businessDetails.businessTitle,
				       	};
				       	// user
						var inputObj = {
							notifPath	 : "",
							from 		 : userId,
						    to           : usermailID,
						    templateName : 'business-report-acknowledged',
						    variables    : msgvariable,
						}
						sendMailNotification(inputObj);

						var inputObj = {
							notifPath	 : "",
						    to           : usermailID,
						    templateName : 'business-report-acknowledged',
						    variables    : msgvariable,
						}
						sendInAppNotification(inputObj); 
						
						// admin
						var inputObj = {
							notifPath	 : "",
							from 		 : userId,
						    to           : adminID,
						    templateName : 'business-report-acknowledged',
						    variables    : msgvariable,
						}
						sendMailNotification(inputObj);

						var inputObj = {
							notifPath	 : "",
						    to           : adminID,
						    templateName : 'business-report-acknowledged',
						    variables    : msgvariable,
						}
						sendInAppNotification(inputObj); 
						Bert.alert('Mail send successfully.','success','growl-top-right');
					}
				}
			}
		});

	},

});

vendorReportForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'vendorReport'});
}

export { vendorReportForm };