import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';
import { Tracker } from 'meteor/tracker';

import { GeneralContent } from '../../api/webPages/generalContentMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import '../../admin/commonAdmin/commonAdmin.js';

import './generalLayout.html';
import './generalLayoutWithImage.html';
import './generalContentForm.html';
import './comingSoon.html';
import '../../common/header.html';
import '../../common/generalHeader.js';
import '../../common/searchbar.js';
import '../../common/vendorSignUpForm.js';

//Meteor.subscribe('generalContent');

Template.generalContentForm.events({
  'submit .generalContentForm': function(event){
    if(event.preventDefault(),event.target.title.value&&event.target.contentBody.value){var generalContentFormValues={contentType:"generalContent",title:event.target.title.value,contentBody:event.target.contentBody.value},currentURL=FlowRouter.current().path;"/editPages"==currentURL&&(generalContentFormValues.id=Session.get("id"),Meteor.call("updateGeneralContent",generalContentFormValues,function(e,t){e?Bert.alert("Form values not updated.","danger","growl-top-right"):(Bert.alert("Data updated sucessfully.","success","growl-top-right"),$(".generalContentForm").hide(),$("html,body").scrollTop(0))})),"/generalcontent-form"==currentURL&&Meteor.call("insertGeneralContent",generalContentFormValues,function(e,t){if(!e)return Bert.alert("Data inserted sucessfully.","success","growl-top-right"),event.target.title.value="",void(event.target.contentBody.value=CKEDITOR.instances.textarea.setData(""));Bert.alert("Form values not inserted.","danger","growl-top-right")})}else Bert.alert("Please enter data in the field !!!","danger","growl-top-right");  
  }
});

Template.generalLayoutWithImage.onRendered(function(){
  $("#visible-lg").removeClass("merchantGuidelineslg"),$("#visible-md").removeClass("merchantGuidelinesmd"),$("#visible-sm").removeClass("merchantGuidelinessm"),$("#visible-xs").removeClass("merchantGuidelinesxs"),$(window).scroll(function(){$(document).scrollTop()>25?($("#visible-lg").addClass("merchantGuidelineslg"),$("#visible-md").addClass("merchantGuidelinesmd"),$("#visible-sm").addClass("merchantGuidelinessm"),$("#visible-xs").addClass("merchantGuidelinesxs")):($("#visible-lg").removeClass("merchantGuidelineslg"),$("#visible-md").removeClass("merchantGuidelinesmd"),$("#visible-sm").removeClass("merchantGuidelinessm"),$("#visible-xs").removeClass("merchantGuidelinesxs"))});
});

Template.generalContentForm.onRendered(function(){
  $('html, body').scrollTop(0);
});

Template.comingSoon.onRendered(function(){
  $('html,body').scrollTop(0);
});

// Template.generalLayout.helpers({
//    isReady: function(){
//      console.log(FlowRouter.subsReady());
//       return FlowRouter.subsReady("myPost", function(){
//        var data = Post.findOne();

//           return data;
//       }); 
//    },
// });

Template.generalLayout.helpers({
    isReady: function(){
      // console.log(FlowRouter.subsReady('userfunction'));
       // if(Meteor.subscribe('userfunction')){
       //     return FlowRouter.subsReady('userfunction');
       // }else{
       //   return false;
       // }
       // console.log(Meteor.subscribe('userfunction').ready());
       return Meteor.subscribe('userfunction').ready();
   },
});

// Template.generalLayout.helpers({
//     isReady: function(){
//       console.log('isReady: ',FlowRouter.subsReady('userfunction'));
//        if(FlowRouter.subsReady('userfunction')){
//           return FlowRouter.subsReady('userfunction');
//        }else{
//         return false;
//        }
//    },
// });

comingSoonForm = function () {  
  BlazeLayout.render("generalLayout",{generalcontent: 'comingSoon'});
  // Blaze.render(Template.vendorLayout,document.body);
}

export { comingSoonForm };

generalContentForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'generalContentForm'});
  // Blaze.render(Template.vendorLayout,document.body);
}

export { generalContentForm };


generalLayoutWithImageForm = function () {  
  BlazeLayout.render("generalLayoutWithImage",{adminLayout: 'generalContentForm'});
  // Blaze.render(Template.vendorLayout,document.body);
}

export { generalLayoutWithImageForm };