import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Mongo } from 'meteor/mongo';
import { Email } from 'meteor/email';
import { Bert } from 'meteor/themeteorchef:bert';

import { NotificationTemplate } from '../api/NotificationTemplate.js';


//============================================================
//  Mail Function
//============================================================
sendMailNotification = function(inputObj) {
	// console.log("sendMailNotification: ",sendMailNotification);
	// console.log('inputObj Mail');
	
	if(inputObj){
		var userDetail = Meteor.users.findOne({'_id':inputObj.to});
		// console.log('userDetail :',userDetail);
		var enquiry = ["User Enquiry Message", "User Enquiry Messages","Vendor Enquiry Message", "Vendor Business Enquiry", "User Business Enquiry", "Enquiry Message Send", "User Business Enquiry All"];
		var rating = ["Vendor Review and Rating", "User Review and Rating", "User Added Review and Rating", "Business Page Review Share"];
		var like = ["Vendor Modal Image Like", "User Modal Image Like", "Vendor Modal Image Comment Like", "User Modal Image Added Comment Like", "User Modal Image Comment Like", "Vendor Modal Image Comment Reply Like", "User Modal Image Added Comment Reply Like", "User Modal Image Added Comment SubReply Like", "User Modal Image Comment SubReply Like", "Vendor Business Page Like", "User Business Page Like", "Vendor Review and Rating Like", "Other User Review and Rating Like", "Current User Review and Rating Like", "Vendor Review Comment Like", "User Comment Review and Rating Like", "User Review Comment Like", "Current User Review Comment Like", "Vendor Review Comment SubReply Like", "User Added Review and Rating SubReply Like", "User Review Comment SubReply Like", "User Added Review Reply SubReply Like", "Current User Review Comment Reply Like"];
		var comment = ["Vendor Modal Image Comment", "User Modal Image Comment", "Vendor Modal Image Comment Reply", "User Modal Image Added Comment Reply", "User Modal Image Comment Reply", "Vendor Review and Rating Comment", "Other User Review and Rating Comment", "Current User Review and Rating Comment", "Vendor Review Comment Reply", "User Review Comment", "Current User Review Comment Reply"];
		var follow = ["Follow User Other", "Follow User Current","Follow"];
		var report = ["businessDone-report-acknowledgedOne","business-image-report-acknowledged","business-report-acknowledged"];
		var busdelete = ['Delete Business Vendor','Delete Business Admin'];
		var other = ['Vendor deleted Offer','Vendor Added New Business','Admin Business Page Modal Report','Vendor Business Page Bookmark','User Business Page Been There','User Business Page Report','User Modal Image Report','Payment Successfull','Thanks for Registering','Vendor Business Page Been There','Offer Deleted','Vendor Business Page Report','Thanks for Submiting Offer','Vendor has Submiting Offer','Vendor Modal Image Report','Invoice','Admin Business Page Report','User Business Page Bookmark','You have been Tagged','Thanks for Registering New Business','Anything Else Business Admin','UnFollow','Mail Receipt','Claim','Business Page Share'];
		
		if(userDetail){
			if(userDetail.notificationConfiguration){
				if(enquiry.includes(inputObj.templateName)){
					if(userDetail.notificationConfiguration.enquiry == "true"){
						var fromId 	= getMailId(inputObj.from);
						var to 		= getMailId(inputObj.to);  
						var subject	= getSubject(inputObj.templateName);
						var body	= getMessageContent(inputObj.templateName,inputObj.variables);
				
						Meteor.call('sendEmailRightNxt',to, fromId, subject, body,function(error,result){
							if(error){
								Bert.alert(error,'danger', 'growl-top-right');
							}else{
								// console.log('Mail Sent','success', 'growl-top-right');
									
							}
						});
					}
				} else if(rating.includes(inputObj.templateName)){
					if(userDetail.notificationConfiguration.rating == "true"){
						var fromId 	= getMailId(inputObj.from);
						var to 		= getMailId(inputObj.to);  
						var subject	= getSubject(inputObj.templateName);
						var body	= getMessageContent(inputObj.templateName,inputObj.variables);
				
						Meteor.call('sendEmailRightNxt',to, fromId, subject, body,function(error,result){
							if(error){
								Bert.alert(error,'danger', 'growl-top-right');
							}else{
								// console.log('Mail Sent','success', 'growl-top-right');
									
							}
						});
					}
				} else if(like.includes(inputObj.templateName)){
					if(userDetail.notificationConfiguration.like == "true"){
						var fromId 	= getMailId(inputObj.from);
						var to 		= getMailId(inputObj.to);  
						var subject	= getSubject(inputObj.templateName);
						var body	= getMessageContent(inputObj.templateName,inputObj.variables);
				
						Meteor.call('sendEmailRightNxt',to, fromId, subject, body,function(error,result){
							if(error){
								Bert.alert(error,'danger', 'growl-top-right');
							}else{
								// console.log('Mail Sent','success', 'growl-top-right');
									
							}
						});
					}
				} else if(comment.includes(inputObj.templateName)){
					if(userDetail.notificationConfiguration.comment == "true"){
						var fromId 	= getMailId(inputObj.from);
						var to 		= getMailId(inputObj.to);  
						var subject	= getSubject(inputObj.templateName);
						var body	= getMessageContent(inputObj.templateName,inputObj.variables);
				
						Meteor.call('sendEmailRightNxt',to, fromId, subject, body,function(error,result){
							if(error){
								Bert.alert(error,'danger', 'growl-top-right');
							}else{
								// console.log('Mail Sent','success', 'growl-top-right');
									
							}
						});
					}
				} else if(follow.includes(inputObj.templateName)){
					if(userDetail.notificationConfiguration.follow == "true"){
						var fromId 	= getMailId(inputObj.from);
						var to 		= getMailId(inputObj.to);  
						var subject	= getSubject(inputObj.templateName);
						var body	= getMessageContent(inputObj.templateName,inputObj.variables);
				
						Meteor.call('sendEmailRightNxt',to, fromId, subject, body,function(error,result){
							if(error){
								Bert.alert(error,'danger', 'growl-top-right');
							}else{
								// console.log('Mail Sent','success', 'growl-top-right');
									
							}
						});
					}
				} else if(report.includes(inputObj.templateName)){
					if(userDetail.notificationConfiguration.report == "true"){
						var fromId 	= getMailId(inputObj.from);
						var to 		= getMailId(inputObj.to);  
						var subject	= getSubject(inputObj.templateName);
						var body	= getMessageContent(inputObj.templateName,inputObj.variables);
				
						Meteor.call('sendEmailRightNxt',to, fromId, subject, body,function(error,result){
							if(error){
								Bert.alert(error,'danger', 'growl-top-right');
							}else{
								console.log('Mail Sent','success', 'growl-top-right');
									
							}
						});
					}
				} else if(busdelete.includes(inputObj.templateName)){
					if(userDetail.notificationConfiguration.editbusiness == "true"){
						var fromId 	= getMailId(inputObj.from);
						var to 		= getMailId(inputObj.to);  
						var subject	= getSubject(inputObj.templateName);
						var body	= getMessageContent(inputObj.templateName,inputObj.variables);
						Meteor.call('sendEmailRightNxt',to, fromId, subject, body,function(error,result){
							if(error){
								Bert.alert(error,'danger', 'growl-top-right');
							}else{
								console.log('Mail Sent','success', 'growl-top-right');
									
							}
						});
					}
				}
			}
			if(other.includes(inputObj.templateName)){
				var fromId 	= getMailId(inputObj.from);
				var to 		= getMailId(inputObj.to);  
				var subject	= getSubject(inputObj.templateName);
				var body	= getMessageContent(inputObj.templateName,inputObj.variables);
				Meteor.call('sendEmailRightNxt',to, fromId, subject, body,function(error,result){
					if(error){
						Bert.alert(error,'danger', 'growl-top-right');
					}else{
						console.log('Mail Sent','success', 'growl-top-right');
							
					}
				});
			}
		}else{
			// console.log('user detail not found:');
		}
	}
}

sendMailReceiptNotification = function(inputObj) {
	if(inputObj){
		// var other = ['Mail Receipt','Claim'];

		var fromId 	= inputObj.from;
		var to 		= inputObj.to;  
		var subject	= getSubject(inputObj.templateName);
		var body	= getMessageContent(inputObj.templateName,inputObj.variables);

		Meteor.call('sendEmailRightNxt',to, fromId, subject, body,function(error,result){
			if(error){
				Bert.alert(error,'danger', 'growl-top-right');
			}else{
				// console.log('Mail Sent','success', 'growl-top-right');
					
			}
		});
	}
}


//============================================================
//  Mail Function
//============================================================
sendPageShareMail = function(inputObj) {
	// var other = ['Business Page Share','Business Page Review Share'];

	if(inputObj){
		var fromId 	= getMailId(inputObj.from);
		var to 		= inputObj.to;  
		var subject	= getSubject(inputObj.templateName);
		var body	= getMessageContent(inputObj.templateName,inputObj.variables);
		
		Meteor.call('sendEmailRightNxt',to, fromId, subject, body,function(error,result){
			if(error){
				Bert.alert(error,'danger', 'growl-top-right');
			}else{
				console.log('Mail Sent','success', 'growl-top-right');
			}
		});
	}
}


//============================================================
//  Notification Function
//============================================================
sendInAppNotification = function(inputObj) {
	// console.log('inputObjIn app:',inputObj);
	if(inputObj){
		var userDetail = Meteor.users.findOne({'_id':inputObj.to});
		// console.log('userDetail :',userDetail);
		var enquiry = ["User Enquiry Message", "User Enquiry Messages","Vendor Enquiry Message", "Vendor Business Enquiry", "User Business Enquiry", "Enquiry Message Send", "User Business Enquiry All"];
		var rating = ["Vendor Review and Rating", "User Review and Rating", "User Added Review and Rating", "Business Page Review Share"];
		var like = ["Vendor Modal Image Like", "User Modal Image Like", "Vendor Modal Image Comment Like", "User Modal Image Added Comment Like", "User Modal Image Comment Like", "Vendor Modal Image Comment Reply Like", "User Modal Image Added Comment Reply Like", "User Modal Image Added Comment SubReply Like", "User Modal Image Comment SubReply Like", "Vendor Business Page Like", "User Business Page Like", "Vendor Review and Rating Like", "Other User Review and Rating Like", "Current User Review and Rating Like", "Vendor Review Comment Like", "User Comment Review and Rating Like", "User Review Comment Like", "Current User Review Comment Like", "Vendor Review Comment SubReply Like", "User Added Review and Rating SubReply Like", "User Review Comment SubReply Like", "User Added Review Reply SubReply Like", "Current User Review Comment Reply Like"];
		var comment = ["Vendor Modal Image Comment", "User Modal Image Comment", "Vendor Modal Image Comment Reply", "User Modal Image Added Comment Reply", "User Modal Image Comment Reply", "Vendor Review and Rating Comment", "Other User Review and Rating Comment", "Current User Review and Rating Comment", "Vendor Review Comment Reply", "User Review Comment", "Current User Review Comment Reply"];
		var follow = ["Follow User Other", "Follow User Current","Follow"];
		var report = ["businessDone-report-acknowledgedOne","business-image-report-acknowledged","business-report-acknowledged"];
		var busdelete = ['Delete Business Vendor','Delete Business Admin'];
		var other = ['Vendor deleted Offer','Vendor Added New Business','Admin Business Page Modal Report','Vendor Business Page Bookmark','User Business Page Been There','User Business Page Report','User Modal Image Report','Payment Successfull','Thanks for Registering','Vendor Business Page Been There','Offer Deleted','Vendor Business Page Report','Thanks for Submiting Offer','Vendor has Submiting Offer','Vendor Modal Image Report','Invoice','Admin Business Page Report','User Business Page Bookmark','You have been Tagged','Thanks for Registering New Business','Anything Else Business Admin','UnFollow','Mail Receipt','Claim','Business Page Share'];
		
		if(userDetail){
			if(userDetail.notificationConfiguration){
				var notifBody    = getNotificationContent(inputObj.templateName,inputObj.variables);
				var toMailId     = getMailId(inputObj.to); 
				var toUserId     = inputObj.to;
				var templateName = inputObj.templateName;
				var notifPath    = inputObj.notifPath;

				if(enquiry.includes(inputObj.templateName)){
					if(userDetail.notificationConfiguration.enquiry == "true"){
						Meteor.call('insertNotification',templateName,toMailId,toUserId,notifBody,notifPath,function(error,result){
							if(error){
								console.log(error,'danger', 'growl-top-right');
							}else if(result){
								console.log("Notification sent",'success', 'growl-top-right');
							}
						});
					}
				} else if(rating.includes(inputObj.templateName)){
					if(userDetail.notificationConfiguration.rating == "true"){
						Meteor.call('insertNotification',templateName,toMailId,toUserId,notifBody,notifPath,function(error,result){
							if(error){
								console.log(error,'danger', 'growl-top-right');
							}else if(result){
								console.log("Notification sent",'success', 'growl-top-right');
							}
						});
					}
				} else if(like.includes(inputObj.templateName)){
					if(userDetail.notificationConfiguration.like == "true"){
						Meteor.call('insertNotification',templateName,toMailId,toUserId,notifBody,notifPath,function(error,result){
							if(error){
								console.log(error,'danger', 'growl-top-right');
							}else if(result){
								console.log("Notification sent",'success', 'growl-top-right');
							}
						});
					}
				} else if(comment.includes(inputObj.templateName)){
					if(userDetail.notificationConfiguration.comment == "true"){
						Meteor.call('insertNotification',templateName,toMailId,toUserId,notifBody,notifPath,function(error,result){
							if(error){
								console.log(error,'danger', 'growl-top-right');
							}else if(result){
								console.log("Notification sent",'success', 'growl-top-right');
							}
						});
					}
				} else if(follow.includes(inputObj.templateName)){
					if(userDetail.notificationConfiguration.follow == "true"){
						Meteor.call('insertNotification',templateName,toMailId,toUserId,notifBody,notifPath,function(error,result){
							if(error){
								console.log(error,'danger', 'growl-top-right');
							}else if(result){
								console.log("Notification sent",'success', 'growl-top-right');
							}
						});
					}
				} else if(report.includes(inputObj.templateName)){
					if(userDetail.notificationConfiguration.report == "true"){
						Meteor.call('insertNotification',templateName,toMailId,toUserId,notifBody,notifPath,function(error,result){
							if(error){
								console.log(error,'danger', 'growl-top-right');
							}else if(result){
								console.log("Notification sent",'success', 'growl-top-right');
							}
						});
					}
				} else if(busdelete.includes(inputObj.templateName)){
					if(userDetail.notificationConfiguration.editbusiness == "true"){
						Meteor.call('insertNotification',templateName,toMailId,toUserId,notifBody,notifPath,function(error,result){
							if(error){
								console.log(error,'danger', 'growl-top-right');
							}else if(result){
								console.log("Notification sent",'success', 'growl-top-right');
							}
						});
					}
				} 
			}
			if(other.includes(inputObj.templateName)){
				Meteor.call('insertNotification',templateName,toMailId,toUserId,notifBody,notifPath,function(error,result){
					if(error){
						console.log(error,'danger', 'growl-top-right');
					}else if(result){
						console.log("Notification sent",'success', 'growl-top-right');
					}
				});
			}
		}
	}
}


//============================================================
//  SMS Function
//============================================================
sendSMS = function(inputObj) {
	if(inputObj){
		var userDetail = Meteor.users.findOne({'_id':inputObj.to});
		// console.log('userDetail :',userDetail);
		var enquiry = ["Vendor Business Enquiry","Business Enquiry"];
		var report = ["Vendor Business Page Report"];
		
		if(userDetail){
			if(userDetail.notificationConfiguration){
				var smsBody    = getSMSContent(inputObj.templateName,inputObj.variables);
				var toUserId   = inputObj.to;
				var toNumber   = inputObj.number.substring(3);

				if(enquiry.includes(inputObj.templateName)){
					if(userDetail.notificationConfiguration.enquiry == "true"){
						Meteor.call('sendSMS',toNumber,smsBody,function(error,result){
							if(error){
								console.log(error);
							}else{
								Meteor.call('insertSMS',toUserId,smsBody,toNumber,function(error,result){
									if(error){
										console.log(error,'danger', 'growl-top-right');
									}else if(result){
										// console.log("SMS sent",'success', 'growl-top-right');
									}
								});
							}
						});
					}
				} else if(report.includes(inputObj.templateName)){
					Meteor.call('sendSMS',toNumber,smsBody,function(error,result){
						if(error){
							console.log(error);
						}else{
							Meteor.call('insertSMS',toUserId,smsBody,toNumber,function(error,result){
								if(error){
									console.log(error,'danger', 'growl-top-right');
								}else if(result){
									// console.log("SMS sent",'success', 'growl-top-right');
								}
							});
						}
					});
				} 
			}
		}
	}
}


//============================================================
//  Get Mail-ID Function
//============================================================
getMailId = function(to,templateName){
	var userData = Meteor.users.findOne({'_id':to});
	if(userData){
		var emailAddress = userData.emails[0].address;
	}
	return emailAddress;
}


//============================================================
//  Get Sending Mail Subject Function
//============================================================
getSubject = function(templateName){
	var NotificationData = NotificationTemplate.findOne({'templateName':templateName,"templateType" : "Email"});
	if(NotificationData){
		var subject = NotificationData.subject;
	}
	return subject;
}


//============================================================
//  Get Sending Mail Message Function
//============================================================
getMessageContent = function(templateName,varObj){
	
	// get all content from templatename
	var NotificationData = NotificationTemplate.findOne({"templateType" : "Email",'templateName':templateName});
	
	if(NotificationData){
		var content = NotificationData.content;
		content = content.replace(/<p>/gm, " ");
		content = content.replace(/<\/p>/gm, " ");
		content = content.replace(/<br>/gm, " ");
		content = content.replace("&nbsp;", " ");
		var words = content.split(' ');
		var tokens = [];
		var n = 0;
		for(i=0;i<words.length;i++){
			if(words[i].charAt(0)=='['){
				tokens[n] = words[i];
				if(tokens[n].substr(tokens[n].length - 1) != ']'){
				   tokens[n] = tokens[n].substr(0,tokens[n].length - 1) ;
				}
				n++;
			}
		}

		var numOfVar = Object.keys(varObj).length;
		for(i=0; i<numOfVar; i++){
			content = content.replace(tokens[i],varObj[tokens[i]]);
		}
	}//NotificationData
	return content;
}

getSMSContent = function(templateName,varObj){
	// get all content from templatename
	
	var NotificationData = NotificationTemplate.findOne({"templateType" : "SMS",'templateName':templateName});
	if(NotificationData){
		var content = NotificationData.content;
		content = content.replace(/<p>/gm, " ");
		content = content.replace(/<\/p>/gm, " ");
		// content = content.replace(/<\/p>/gm, "");
		content = content.replace(/<br>/gm, " ");
		content = content.replace("&nbsp;", " ");		
		var words = content.split(' ');
		var tokens = [];
		var n = 0;
		for(i=0;i<words.length;i++){
			if(words[i].charAt(0)=='['){
				tokens[n] = words[i];
				if(tokens[n].substr(tokens[n].length - 1) != ']'){
				   tokens[n] = tokens[n].substr(0,tokens[n].length - 1) ;
				}
				n++;
			}
		}


		var numOfVar = Object.keys(varObj).length;
		for(i=0; i<numOfVar; i++){
			content = content.replace(tokens[i],varObj[tokens[i]]);
		}
	}//NotificationData

	return content;
}

getNotificationContent = function(templateName,varObj){
	var NotificationData = NotificationTemplate.findOne({"templateType" : "Notification",'templateName':templateName});
	if(NotificationData){
		var content = NotificationData.content;
		content = content.replace(/<p>/gm, " ");
		content = content.replace(/<\/p>/gm, " ");
		// content = content.replace(/<\/p>/gm, "");
		content = content.replace(/<br>/gm, " ");
		content = content.replace("&nbsp;", " ");		
		var words = content.split(' ');
		var tokens = [];
		var n = 0;
		for(i=0;i<words.length;i++){
			if(words[i].charAt(0)=='['){
				tokens[n] = words[i];
				if(tokens[n].substr(tokens[n].length - 1) != ']'){
				   tokens[n] = tokens[n].substr(0,tokens[n].length - 1) ;
				}
				n++;
			}
		}


		var numOfVar = Object.keys(varObj).length;
		for(i=0; i<numOfVar; i++){
			content = content.replace(tokens[i],varObj[tokens[i]]);
		}
	}//NotificationData

	return content;
}


