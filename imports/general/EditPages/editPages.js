import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

import { GeneralContent } from '../../api/webPages/generalContentMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import '../../admin/commonAdmin/commonAdmin.js';
import './editPages.html';
import '../aboutUs/aboutUs.js';
import '../FAQ/faq.js';
import '../generalLayout/generalLayout.js';

Template.generalContentForm.onRendered( function() {
   CKEDITOR.replace( 'textarea' );
});

Template.aboutUsForm.onRendered( function() {
   CKEDITOR.replace( 'focus' );
});

Template.faqForm.onRendered( function() {
   CKEDITOR.replace( 'select' );
});

Template.editPages.helpers({
	editWebpages(){
		var allPages = [];
		allPages = GeneralContent.find({},{'contentBody':0, sort: {contentType: 1}}).fetch();
		if(allPages){
			for(i=0;i<allPages.length;i++){
				if(allPages[i].contentType == 'generalContent'){
					allPages[i].title = allPages[i].title;	
				}
				if(allPages[i].contentType == 'Faq' || allPages[i].contentType == 'aboutUs'){
					var x = allPages[i].title + ' - ' + allPages[i].tabName + ' - ' + allPages[i].sectionHeading;
					allPages[i].title = x;	
				}
				if(allPages[i].contentType == 'Faq'){
					allPages[i].faqType = 'true';	
				}else{
					allPages[i].faqType = 'false';
				}
			}
			return allPages;			
		}
	}
});

Template.editPages.events({
	'click .edit': function(event){
		event.preventDefault();
		$('html, body').scrollTop(0);
		$('.aboutUs-form').css('margin-bottom','-2%');
		$("body").scrollTop(0);
		
		var id = event.currentTarget.id;
		Session.set('id',id);

		var type = $('#'+id).attr('class');
		var types = type.split(' ');
		var contentType = types[1];
		
		if(contentType=='aboutUs'){
			$('.aboutUsForm').show();
			$('.generalContentForm').hide();
			$('.faqForm').hide();

			var input1 = $('#input1');
			var input2 = $('#input2');
			var input3 = $('#input3');

			$($(".aboutUsForm")[1]).find(input1).val(GeneralContent.findOne({"_id":id}).title);
			$($(".aboutUsForm")[1]).find(input2).val(GeneralContent.findOne({"_id":id}).tabName);
			$($(".aboutUsForm")[1]).find(input3).val(GeneralContent.findOne({"_id":id}).sectionHeading);
			CKEDITOR.instances.focus.setData(GeneralContent.findOne({"_id":id}).contentBody);
		}

		if(contentType=='generalContent'){
			$('.generalContentForm').show();
			$('.aboutUsForm').hide();
			$('.faqForm').hide();

			$($(".generalContentForm")[1]).find('input[type=text]').val(GeneralContent.findOne({"_id":id}).title);
			CKEDITOR.instances.textarea.setData(GeneralContent.findOne({"_id":id}).contentBody);
		}
		
		if(contentType=='Faq'){
			$('.faqForm').show();
			$('.aboutUsForm').hide();
			$('.generalContentForm').hide();

			$($("#faqadminForm")[0]).find("select").val(GeneralContent.findOne({"_id":id}).tabName);
			$($("#faqadminForm")[0]).find('textarea').val(GeneralContent.findOne({"_id":id}).sectionHeading);
			CKEDITOR.instances.select.setData(GeneralContent.findOne({"_id":id}).contentBody);	
		}
	},

	'click .delete':function(event){
		event.preventDefault();
		var id = event.currentTarget.id;
		
		Meteor.call('deleteWebPages',id,
		function(error,result){
			if(error){
				Bert.alert(error.reason,"danger","growl-top-right");
			}else{
				Bert.alert('Data deleted successfully.','success',"growl-top-right");
				$('.modal-backdrop').hide();
			}
		});
	},
	
});

Template.editPages.onRendered(function(){
	$("body").scrollTop(0);
});

editPagesForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'editPages'});
  // Blaze.render(Template.vendorLayout,document.body);
}

export { editPagesForm };