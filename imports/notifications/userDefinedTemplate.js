import { Session } from 'meteor/session';
import { NotificationTemplate } from '../api/NotificationTemplate.js';
import { Bert } from 'meteor/themeteorchef:bert';

import './userDefinedTemplate.html';
import '/imports/admin/commonAdmin/commonAdmin.js';

Template.userDefinedTemplate.onRendered (function() {
	 $(document).ready(function() {

	  $('#mailContent').summernote({
        height: 140,
        maxHeight:140,
        minHeight:135,
    	});
	});

});

Template.userDefinedTemplate.events({
	
'change .radioId':function(){
	var radioVal = $(".radioId:checked").val();
	Session.set("radioData",radioVal);
},

'click .sendmailbtn': function(event){
	event.preventDefault();
	var toVar = $('.tofield').val();
	var subject = $('.subjectfield').val();
	if (subject != '') {
		var body = $('#mailContent').summernote('code');
		var from  = 'social@rightnxt.com';
		var splitTo = toVar.split(',');
		for(i=0 ; i<splitTo.length ; i++){
			var to = splitTo[i];
			Meteor.call('sendEmailRightNxt',to , from, subject ,body);
		}//i
		Bert.alert("Mail Sent!",'success', 'growl-top-right');
		$('.tofield').val('');
		$('.subjectfield').val('');
		$('#mailContent').summernote('code','');
	}else{
		Bert.alert('Please enter subject.','danger','growl-top-right');
	}
},

});

Template.userDefinedTemplate.helpers({
	'toId' : function(){
		var sessionVal = Session.get("radioData");
		var emailArray = [];
		
		if(sessionVal == 'myId'){
			var userData = Meteor.users.findOne({'roles':'admin'});
			if(userData){
				var email = userData.emails[0].address;
				emailArray.push(email);
			}//userData
		}else{
			var userVar = Meteor.users.find({'roles':'user'}).fetch();
			if(userVar){
				for(i=0 ; i<userVar.length ; i++){
					if(userVar[i].profile){
						var updates = userVar[i].profile.status;
						if(updates == 'Active'){
							email = userVar[i].emails[0].address;
							emailArray.push(email);
							var value = emailArray.join();
						}//if compare
					}//userVar[i].profile
					
				}//i
			}//userVar
		}
		return emailArray;
	},
})

userDefinedTemplateForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'userDefinedTemplate'});
}
export { userDefinedTemplateForm };