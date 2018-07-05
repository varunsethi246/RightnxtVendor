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
		var reports = Reports.find({"businessLink":businessLink}).fetch();

		// Added only to format time
		if(reports){
			for(i=0;i<reports.length;i++){
				reports[i].createdAt = moment(reports[i].createdAt).fromNow();
			}
		}

		if(reports){
			var businessObj = Business.find({"businessLink":businessLink,"status": "active"});
			var reportDataReturn = {
				noofreports			: reports.length,
				reportBusinessArray	: [],
				reportImageArray	: [],
				// "businessTitle" : businessObj.businessTitle,
			}
			for(i = 0 ; i < reports.length ; i ++){
					if(reports[i].reportType == 'business')
					{
						reportDataReturn.reportBusinessArray.push(reports[i]);
					}
					if(reports[i].reportType == 'image')
					{
						reportDataReturn.reportImageArray.push(reports[i]);
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
			// console.log("userProfilePic: ",userProfilePic);
			objImg = {
				"userProfilePic":userProfilePic,
			}
			// console.log('objImg :',objImg);
			return objImg;
		}
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
			var data = {
				img : '/images/rightnxt_image_nocontent.jpg',
			};
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
			// console.log("userProfilePic: ",userProfilePic);
			objImg = {
				"userProfilePic":userProfilePic,
			}
			return objImg;
		}
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
				var userDet = Reports.findOne({'_id':userID});
				if(userDet){

					var usermailID = userDet.userid;
					// console.log('usermailID:',usermailID);
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
						}
					}
				}
		}
		}
	},

});

Template.businessReport.events({
	'click .sendBussReportEmail':function(event){
		event.preventDefault();
		var userId = Meteor.userId();
		var adminUser 	= Meteor.users.findOne({'roles':'admin'});
		var adminID		= adminUser._id;
		var userDetails = Meteor.users.findOne({'_id':userId});
		console.log('userDetails:',userDetails);
		var email = $(event.currentTarget).attr('id');
		var res = email.split(" ");
		var userID = res[1];
		var userDet = Reports.findOne({'_id':userID});
		var usermailID = userDet.userid;
		console.log('usermailID:',usermailID);
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
					notifPath	 : businessLink,
					from 		 : userId,
				    to           : usermailID,
				    templateName : 'businessDone-report-acknowledgedOne',
				    variables    : msgvariable,
				}
				sendMailNotification(inputObj);

				var inputObj = {
					notifPath	 : businessLink,
				    to           : usermailID,
				    templateName : 'businessDone-report-acknowledgedOne',
				    variables    : msgvariable,
				}

				sendInAppNotification(inputObj);
				// admin
				// var inputObj = {
				// 	notifPath	 : businessLink,
				// 	from 		 : userId,
				//     to           : adminID,
				//     templateName : 'businessDone-report-acknowledged',
				//     variables    : msgvariable,
				// }
				// sendMailNotification(inputObj);

				// var inputObj = {
				// 	notifPath	 : businessLink,
				//     to           : adminID,
				//     templateName : 'businessDone-report-acknowledged',
				//     variables    : msgvariable,
				// }

				// sendInAppNotification(inputObj);  
			}
		}
	},

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

	'click .sendBusReportEmail':function(event){
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
			}
		}
	},

});

vendorReportForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'vendorReport'});
}

export { vendorReportForm };