import { Session } from 'meteor/session';
import { NotificationTemplate } from '../api/NotificationTemplate.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';

import './createEmailTemplate.html';
import './viewTemplate.html';
import './editTemplate.html';
import '/imports/admin/commonAdmin/commonAdmin.js';

Template.createEmailTemplate.onRendered (function() {
	 $(document).ready(function() {

	  $('#messageContent').summernote({
        height: 140,
        maxHeight:140,
        minHeight:135,
    	});
	});

	var getId     = FlowRouter.getParam("id");
	if(getId){
		var notifContent = NotificationTemplate.findOne({'_id':getId});
		if(notifContent){
			if(!notifContent.subject){
				$('.subjectDiv').css({'display':'none'});
			}//subject
		}//notifContent
		
	}//getId	

});

Template.editTemplate.onRendered (function() {
	 $(document).ready(function() {

	  $('#editmessageContent').summernote({
        height: 140,
        maxHeight:140,
        minHeight:135,
    	});
	});

	var getId     = FlowRouter.getParam("id");
	if(getId){
		var notifContent = NotificationTemplate.findOne({'_id':getId});
		if(notifContent){
			if(!notifContent.subject){
				$('.subjectDiv').css({'display':'none'});
			}//subject
		}//notifContent
		
	}//getId	

});

Template.viewTemplate.onRendered (function() {
	 $('.contentBox').css({'display':'none'});

});

Template.editTemplate.helpers({
	'viewTemplate':function(){
		var id = FlowRouter.getParam('id');
		if(id){
			return NotificationTemplate.find({'_id':id}).fetch();
		}
	}
})


Template.createEmailTemplate.events({

	'change .templateType':function(event){
		event.preventDefault();
		if($('.templateType').val()  == 'Notification' || $('.templateType').val()  == 'SMS' ){
			console.log('$(.templateType).val()',$('.templateType').val());
			console.log('$(.templateType).val()',$('.templateType').val());
			$('.subjectRow').css({'display':'none'});
		}else{
			console.log('$(.templateType).val()',$('.templateType').val());
			console.log('$(.templateType).val()',$('.templateType').val());
			console.log('block');
			$('.subjectRow').css({'display':'block'});
		}

	},
	
	'submit .newTemplateForm':function(event){
		event.preventDefault();
		var templateType     = $('.templateType').val();
		var templateName     = $('.templateName').val();
		var subject          = $('.subject').val();
		var emailContent     = $('#messageContent').summernote('code');
		// console.log('emailContent: ',emailContent);
		// console.log('templateType: ',templateType);
		if (emailContent != "<p><br></p>" && emailContent != "") {
			var NotificationData = NotificationTemplate.findOne({'templateType':templateType,'templateName':templateName});
			if(NotificationData){
				swal("Template Name Already Exist");
			}else if(templateType == 'Notification' || templateType == 'SMS'){
				// console.log('in notification');
				Meteor.call('insertTemplate',templateType,templateName,emailContent,function(error,result){
		        	if(error){
		        		console.log(error.reason);
		        	}else if(result){
		        		// Bert.alert("Successfully Inserted..!!");
           				Bert.alert('Successfully Inserted..!!',"success","growl-top-right");

		        	}
		        });	
           				Bert.alert('Successfully Inserted..!!',"success","growl-top-right");
				
		        $('.templateName').value  = '';
		        $('#messageContent').val('');
			}else{
				// console.log('in email');
				Meteor.call('insertNewTemplate',templateType,templateName,subject,emailContent,function(error,result){
		        	if(error){
		        		console.log(error.reason);
		        	}else if(result){
		        		// Bert.alert("Successfully Inserted..!!");
           				Bert.alert('Successfully Inserted..!!',"success","growl-top-right");

		        	}
		        });	
           				Bert.alert('Successfully Inserted..!!',"success","growl-top-right");
				
		        $('.templateName').val('');
		        $('.subject').val('');
		        $('#messageContent').val('');
			}
		}else{
		        // Bert.alert("Please insert message..!");
           		Bert.alert('Please insert message..!',"success","growl-top-right");

			
		}

        
	},

	
	'click .tempCategory':function(){

		var dataToToggle = $(this).find('.fa-angle-right').toggleClass('.fa-angle-down');
		
	},

	
	'click .templateLibrary li' :function(e){
		e.preventDefault();
        $('li').removeClass('templateActivated');
        $(e.target).addClass('templateActivated');
	},


	'click .library-submenu' : function(e){
		e.preventDefault();
		$('li').removeClass('templateActivated');
	},

	
});

Template.editTemplate.events({
	'click .updatebtn':function(event){
		event.preventDefault();
		var id = FlowRouter.getParam("id");
		var templateType     = $('.templateType').val();
		var templateName     = $('.templateName').val();
		var subject          = $('.subject').val();
		var emailContent     = $('#editmessageContent').summernote('code');

		if(templateType == 'Notification' || templateType == 'SMS'){
			Meteor.call('updateTemplate',id,templateName,emailContent,function(error,result){
	        	if(error){
	        		console.log(error.reason);
	        	}else if(result){
	        		Bert.alert("Updated Successfully..!!");
	        	}
	        });	

	        $('.templateName').val('');
	        $('#editmessageContent').summernote('code','');
		}else{
			Meteor.call('updateNewTemplate',id,templateName,subject,emailContent,function(error,result){
	        	if(error){
	        		console.log(error.reason);
	        	}else if(result){
	        		// Bert.alert("Updated Successfully..!!");
           			Bert.alert('Updated Successfully..!!',"success","growl-top-right");

	        	}
	        });	

	        $('.templateName').val('');
	        $('.subject').val('');
	        $('#editmessageContent').summernote('code','');
		}
		FlowRouter.go('/viewTemplate');
	},

})

Template.viewTemplate.helpers({
	AllTemplates:function(){
		return NotificationTemplate.find({"templateType" : "Email"}).fetch();
	},

	notificationTemplates:function(){
		return NotificationTemplate.find({"templateType" : "Notification"}).fetch();
	},

	smsTemplates:function(){
		return NotificationTemplate.find({"templateType" : "SMS"}).fetch();
	},

	AllEmailTemplates:function(){
		var id = Session.get("templateId");
		var notifArray = [];
		var notifData =  NotificationTemplate.findOne({"_id" : id});
		if(notifData){
			var text= notifData.content;
			var regex = new RegExp("</p><p>", 'g');
			text = text.replace(regex, '\n');
			var strippedText = $("<div/>").html(text).text();
			notifArray.push({
				'subject'     : notifData.subject,
				'strippedText': strippedText,
				'id'		  : notifData._id,
			})
		}//notifData
		return notifArray;
	},

	AllNotificationTemplates:function(){
		var id = Session.get("templateId");
		var notifArray = [];
		var notifData =  NotificationTemplate.findOne({"_id" : id});
		if(notifData){
			var text= notifData.content;
			var regex = new RegExp("</p><p>", 'g');
			text = text.replace(regex, '\n');
			var strippedText = $("<div/>").html(text).text();
			notifArray.push({
				'strippedText': strippedText,
				'id'		  : notifData._id,
			})
		}//notifData
		return notifArray;
	},

	AllsmsTemplates:function(){
		var id = Session.get("templateId");
		var notifArray = [];
		var notifData =  NotificationTemplate.findOne({"_id" : id});
		if(notifData){
			var text= notifData.content;
			var regex = new RegExp("</p><p>", 'g');
			text = text.replace(regex, '\n');
			var strippedText = $("<div/>").html(text).text();
			notifArray.push({
				'strippedText': strippedText,
				'id'		  : notifData._id,
			})
		}//notifData
		return notifArray;
	}
	
})

Template.viewTemplate.events({

	'click .tempCategory':function(event){
		event.preventDefault();
		$('.defaultMsg').css({'display':'none'});
		$('.inputrow').css({'display':'block'});
		$('.actionBtn').css({'display':'block'});
		$('.contentBox').css({'display':'block'});

		if($(window).width() > 780){
			$('.tempCategory').removeClass('templateActivated');
			$(event.target).addClass('templateActivated');
		}

		var id = $(event.target).attr('id');
		Session.set("templateId",id);
		
		if($(window).width() < 780){
			$('.showTemplate').css({'display':'none'});
			if ($(".templateLibraryHeader").text("Hide Template Library")){			
		      $(".templateLibraryHeader").text("Expand Template Library");
		    }
		}
	},

	'click .delTemplate':function(event){
		event.preventDefault();
		var tempId = $(event.target).attr('id');
		Meteor.call('removeTemplate',tempId,function(error,result){
			if(error){
				console.log(error);
			}else{
				// console.log('Deleted!');
	        	Bert.alert('Deleted Successfully','success','growl-top-right');
	        	$('.modal-backdrop').hide();
			}
		});
	},
	'click .smsPill':function(){
		$('.smsValue').val('');
	},
	'click .NotificationPill':function(){
		$('.notificationValue').val('');
	},
	'click .EmailPill':function(){
		$('.emailValue').val('');
	},

	// clickTemplate(){
	//   $(".showTemplate").slideToggle( "slow");
    
	//   if ($(".templateLibraryHeader").text("Expand Template Library"))
 //      {			
 //        $(".templateLibraryHeader").html("Hide Template Library");
 //      }
	//   else 
 //      {		
 //        $(".templateLibraryHeader").text("Expand Template Library");
 //      }
	    
	// },
		
});
createEmailTemplateForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'createEmailTemplate'});
}
export { createEmailTemplateForm };

editTemplateForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'editTemplate'});
}
export { editTemplateForm };

viewTemplateForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'viewTemplate'});
}
export { viewTemplateForm };