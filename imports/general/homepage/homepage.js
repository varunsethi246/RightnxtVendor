import '/imports/common/common.js';

import './homepage.html';
import './homepageSearch';
import './homepageBanner';
import './homepageHowItWorks';
import './homepageProductCarousel.html';
import './homepageProductCarousel.js';
import './homepageServicesCarousel.html';
import './homepageServicesCarousel.js';
import './homepageBanner.js';

import { City } from '../../api/masterData/cityMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Template } from 'meteor/templating';

import '../mainBusinessSearch/mainBusinessSearch.js';

/*Template.homepage.onRendered({
          Meteor.subscribe('userfunction').ready();
          Meteor.subscribe('allCity').ready();
          Meteor.subscribe('area').ready();
          // Meteor.subscribe('userProfileS3OneUser').ready();
          Meteor.subscribe('categories').ready();
          Meteor.subscribe('notification').ready();
          Meteor.subscribe('notificationTemplate').ready();
          Meteor.subscribe('vendorBusiness').ready();
          Meteor.subscribe('userProfileS3').ready(); 
          Meteor.subscribe('businessImgS3').ready(); 
});*/
Template.anonymousUserLayout.onCreated(function () {
  // Use this.subscribe inside onCreated callback
  // this.subscribe('userfunction');
  this.subscribe('allCity');
  this.subscribe('area');
  this.subscribe('homeBannerVideo');
  this.subscribe('getBizVideoBanner');
  this.subscribe('categories');
  this.subscribe('notification');
  this.subscribe('notificationTemplate');
  this.subscribe('vendorBusiness');
  this.subscribe('userProfileS3OneUser'); 
  // this.subscribe('businessImgS3');
  
});

Template.homepage.helpers({
   //  isReady: function(){
   //    console.log('FlowRouter.subsReady()',FlowRouter.subsReady());
   //     return FlowRouter.subsReady();
   // },

});

Template.homepageBanner.onRendered(function(){
  $(window).scroll(function(){$(document).scrollTop()>25?$(".visible-lg").addClass("homepageBannerlg"):$(".visible-lg").removeClass("homepageBannerlg"),$(document).scrollTop()>80?$(".homeScrollTop").fadeIn("slow"):$(".homeScrollTop").fadeOut("slow"),$(document).scrollTop()>120&&($(".howWork").addClass("fadeInUp"),$(".howWork").css("animation-duration","0.9s"),$(".howWork1").addClass("fadeInUp"),$(".howWork1").css("animation-delay","0.2s"),$(".howWork1").css("animation-duration","1.2s"),$(".howWork2").addClass("fadeInUp"),$(".howWork2").css("animation-delay","0.4s"),$(".howWork2").css("animation-duration","1.5s"),$(".howWork3").addClass("fadeInUp"),$(".howWork3").css("animation-delay","0.6s"),$(".howWork3").css("animation-duration","1.8s"))}),$("body").scrollTop(0);
});

Template.homepage.events({
    'click .homeScrollTop' : function(event){
      var $this = $(event.target);
    $('html, body').animate({
           scrollTop: $('body').offset().top
          }, 1000,
      );
    },
    'focusin .getBusiness1' : function(event){
      $(".str-tag-input1").css({outline:"none",border:"1px solid #f89b1c"});
    },
    'focusout .getBusiness1' : function(event){
      $(".str-tag-input1").css({outline:"none",border:"1px solid #ccc"});
    }
});
 
Template.anonymousUserLayout.events({
  'click #how-a' : function(event){
        var $this=$(event.target.hash);if(""!==$this){event.preventDefault();var hash=$this;$("html, body").animate({scrollTop:$(hash).offset().top},800,function(){window.location.hash="howitworks"})}
    },
});

Homepage = function () {  
  BlazeLayout.render("anonymousUserLayout",{main: 'homepage'});
}

export { Homepage };