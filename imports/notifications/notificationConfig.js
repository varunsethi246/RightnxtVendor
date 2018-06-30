import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Mongo } from 'meteor/mongo';
import { Email } from 'meteor/email';
import { Bert } from 'meteor/themeteorchef:bert';

import './notificationConfig.html';
import '../userarea/profileSetting/profileSettingSidebar.js';
import '../userarea/profileSetting/profileSettingLayout.html';
import '../userarea/profileSetting/editProfile.js';
import '../userarea/profileSetting/editProfile.html';

Template.notificationConfig.events({
	'click .submitConfig':function(){
		event.preventDefault();
		var Enquiry = $('input[name=Enquiry]:checked').val();
		// var Invoice = $('input[name=Invoice]:checked').val();
		var Rating  = $('input[name=Rating]:checked').val();
		// var Payment = $('input[name=Payment]:checked').val();
		var Follow  = $('input[name=Follow]:checked').val();
		// var UnFollow= $('input[name=UnFollow]:checked').val();
		var Like    = $('input[name=Like]:checked').val();
		// var UnLike  = $('input[name=UnLike]:checked').val();
		var Comment = $('input[name=Comment]:checked').val();

		var editbusiness = $('input[name=editbusiness]:checked').val();
		
		var report	 = $('input[name=report]:checked').val();
		
		Meteor.call('insertUserNotifConfig',Enquiry,Rating,Follow,Like,Comment,editbusiness,report,function(error,result){
			if(error){
				Bert.alert('Something went wrong :',error);
			}else{
				Bert.alert('Updated Successfully!','success','growl-top-right');
			}
		})
	},

});

Template.notificationConfig.helpers({

	scaleProcess:function(){
		var userId = Meteor.userId();
		var userData = Meteor.users.findOne({'_id':userId});
		if(userData){
			if(userData.notificationConfiguration){
				var enquiryConfig = {
            		'enquiry'   : userData.notificationConfiguration.enquiry,
            	}
			}//notificationConfiguration
		}//userData
		return enquiryConfig;
	},

	ratingProcess:function(){
		var userId = Meteor.userId();
		var userData = Meteor.users.findOne({'_id':userId});
		if(userData){
			if(userData.notificationConfiguration){
				var ratingConfig = {
            		'rating'   : userData.notificationConfiguration.rating,
            	}
			}//notificationConfiguration
		}//userData
		return ratingConfig;
	},

	followProcess:function(){
		var userId = Meteor.userId();
		var userData = Meteor.users.findOne({'_id':userId});
		if(userData){
			if(userData.notificationConfiguration){
				var followConfig = {
            		'follow'   : userData.notificationConfiguration.follow,
            	}
			}//notificationConfiguration
		}//userData
		return followConfig;
	},

	// unfollowProcess:function(){
	// 	var userId = Meteor.userId();
	// 	var userData = Meteor.users.findOne({'_id':userId});
	// 	if(userData){
	// 		if(userData.notificationConfiguration){
	// 			var unfollowConfig = {
 //            		'unfollow'   : userData.notificationConfiguration.unfollow,
 //            	}
	// 		}//notificationConfiguration
	// 	}//userData
	// 	return unfollowConfig;
	// },

	likeProcess:function(){
		var userId = Meteor.userId();
		var userData = Meteor.users.findOne({'_id':userId});
		if(userData){
			if(userData.notificationConfiguration){
				var likeConfig = {
            		'like'   : userData.notificationConfiguration.like,
            	}
			}//notificationConfiguration
		}//userData
		console.log('likeConfig :',likeConfig);

		return likeConfig;
	},

	// unlikeProcess:function(){
	// 	var userId = Meteor.userId();
	// 	var userData = Meteor.users.findOne({'_id':userId});
	// 	if(userData){
	// 		if(userData.notificationConfiguration){
	// 			var unlikeConfig = {
 //            		'unlike'   : userData.notificationConfiguration.unlike,
 //            	}
	// 		}//notificationConfiguration
	// 	}//userData
	// 	return unlikeConfig;
	// },

	commentProcess:function(){
		var userId = Meteor.userId();
		var userData = Meteor.users.findOne({'_id':userId});
		if(userData){
			if(userData.notificationConfiguration){
				var commentConfig = {
            		'comment'   : userData.notificationConfiguration.comment,
            	}
			}//notificationConfiguration
		}//userData
		return commentConfig;
	},
	editbusinessProcess:function(){
		var userId = Meteor.userId();
		var userData = Meteor.users.findOne({'_id':userId});
		if(userData){
			if(userData.notificationConfiguration){
				var editbusinessConfig = {
            		'editbusiness'   : userData.notificationConfiguration.editbusiness,
            	}
			}//notificationConfiguration
		}//userData
		// console.log('editbusinessConfig :',editbusinessConfig);
		return editbusinessConfig;
	},
	reportProcess:function(){
		var userId = Meteor.userId();
		var userData = Meteor.users.findOne({'_id':userId});
		if(userData){
			if(userData.notificationConfiguration){
				var reportConfig = {
            		'report'   : userData.notificationConfiguration.report,
            	}
			}//notificationConfiguration
		}//userData
		// console.log('reportConfig :',reportConfig);
		return reportConfig;
	},

	isCheckedenquiry: function(scaleProcess) {
      return (this.enquiry === scaleProcess) ? "checked" : "";
    },

    isCheckedrating:function(ratingProcess){
    	return (this.rating === ratingProcess) ? "checked" : "";
    },

    isCheckedfollow:function(followProcess){
    	return (this.follow === followProcess) ? "checked" : "";
    },

    // isCheckedunfollow:function(unfollowProcess){
    // 	return (this.unfollow === unfollowProcess) ? "checked" : "";
    // },

    isCheckedlike:function(likeProcess){
    	return (this.like === likeProcess) ? "checked" : "";
    },

    // isCheckedunlike:function(unlikeProcess){
    // 	return (this.unlike === unlikeProcess) ? "checked" : "";
    // },

    isCheckedcomment:function(commentProcess){
    	return (this.comment === commentProcess) ? "checked" : "";
    }, 

    isCheckededitbusiness:function(editbusinessProcess){
    	// console.log("editbusinessProcess:",editbusinessProcess);
    	return (this.editbusiness === editbusinessProcess) ? "checked" : "";
    },
    isCheckedreport:function(reportProcess){
    	// console.log("reportProcess:",reportProcess);
    	return (this.report === reportProcess) ? "checked" : "";
    },
});

notificationConfigForm = function () {  
  BlazeLayout.render("profileSettingLayout",{profileSettings: 'notificationConfig'});
  // Blaze.render(Template.userLayout,document.body);
}
export { notificationConfigForm }