import { Template } from 'meteor/templating' ;
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


import './userLayout.html';
import './userLayout.js';

import './userProfile/userProfile.js';

import './profileSetting/profileSetting.html';
import './profileSetting/profileSetting.js';

import './profileSetting/profileSettingLayout.html';
import './profileSetting/profileSettingSidebar.html';
import './profileSetting/profileSettingSidebar.js';
import './profileSetting/editProfile.html';
import './profileSetting/editProfile.js';

import './userSidebar/userSidebar.html';
import './userSidebar/userSidebar.js';

import './userPage.html';

import './userTimeline/userTimeline.html';
import './userTimeline/userTimelinePage.html';
import './userTimeline/userSuggestion.html';
import './userTimeline/userTimelinePage.js';

import './userReview/userReview.html';
import './userReview/userReviewPage.html';
import './userReview/userReviewSuggestion.html';
import './userReview/userReviewPage.js';

import './userPhotos/userPhotos.html';
import './userPhotos/userPhotos.js';

import './userFollowers/userFollowers.html';
import './userFollowers/userFollowers.js';

import './userBookmarks/userBookmarks.html';
import './userBookmarks/userBookmark.js';

import './userBeenThere/userBeenThere.html';
import './userBeenThere/userBeenThere.js';

import './userRatings/userRatings.html';
import './userRatings/userRatings.js';


import './userOffers/userOffers.html';
import './userOffers/userOffers.js';

import './userEnquiry/userEnquiry.html';
import './userEnquiry/userEnquiryDetails.html';
import './userEnquiry/userEnquiryPage.html';
import './userEnquiry/userEnquiry.js';

import './userLike/userLike.js';
import './userLike/userLike.html';
import '../notifications/notificationConfig.html';





Template.userLayout.events({
	// 'click .seachBusiness': function(){
	// 	console.log('seachBusiness click');
	//     var searchString = $('#gridSearchBusiness').val();
	//     Session.set('searchText',searchString);
	//     // FlowRouter.go('/search');
	// },
});

Template.userTimelinePage.onRendered(()=>{
		var currentURL = FlowRouter.current().path;
		var actualURL = currentURL.substring(1).split('/');
		$('.sidebarlink1').removeClass('active');
		$('.'+actualURL[0]).addClass('active');
});

Template.userLike.onRendered(()=>{
		var currentURL = FlowRouter.current().path;
		var actualURL = currentURL.substring(1).split('/');
		$('.sidebarlink1').removeClass('active');
		$('.'+actualURL[0]).addClass('active');
});

Template.userReviewPage.onRendered(()=>{
		var currentURL = FlowRouter.current().path;
		var actualURL = currentURL.substring(1).split('/');
		$('.sidebarlink1').removeClass('active');
		$('.'+actualURL[0]).addClass('active');
		// console.log('currentURL: ',currentURL,' | actualURL: ',actualURL);
});

Template.userPhotos.onRendered(()=>{
		var currentURL = FlowRouter.current().path;
		var actualURL = currentURL.substring(1).split('/');
		$('.sidebarlink1').removeClass('active');
		$('.'+actualURL[0]).addClass('active');
});

Template.userFollowers.onRendered(()=>{
		var currentURL = FlowRouter.current().path;
		var actualURL = currentURL.substring(1).split('/');
		$('.sidebarlink1').removeClass('active');
		$('.'+actualURL[0]).addClass('active');
});
Template.userBookmarks.onRendered(()=>{
		var currentURL = FlowRouter.current().path;
		var actualURL = currentURL.substring(1).split('/');
		$('.sidebarlink1').removeClass('active');
		$('.'+actualURL[0]).addClass('active');
});
Template.userBeenThere.onRendered(()=>{
		var currentURL = FlowRouter.current().path;
		var actualURL = currentURL.substring(1).split('/');
		$('.sidebarlink1').removeClass('active');
		$('.'+actualURL[0]).addClass('active');
});
Template.userRatings.onRendered(()=>{
		var currentURL = FlowRouter.current().path;
		var actualURL = currentURL.substring(1).split('/');
		$('.sidebarlink1').removeClass('active');
		$('.'+actualURL[0]).addClass('active');
});
Template.userOffers.onRendered(()=>{
		var currentURL = FlowRouter.current().path;
		var actualURL = currentURL.substring(1).split('/');
		$('.sidebarlink1').removeClass('active');
		$('.'+actualURL[0]).addClass('active');
});
Template.userEnquiryPage.onRendered(()=>{
		var currentURL = FlowRouter.current().path;
		var actualURL = currentURL.substring(1).split('/');
		$('.sidebarlink1').removeClass('active');
		$('.'+actualURL[0]).addClass('active');
});


Template.profileSetting.onRendered(()=>{
		var currentURL = FlowRouter.current().path;
		var actualURL = currentURL.substring(1).split('/');
		$('.sidebarlink1').removeClass('active');
		$('.'+actualURL[0]).addClass('active');
		// console.log('currentURL: ',currentURL,' | actualURL: ',actualURL);
});

Template.editProfile.onRendered(()=>{
		var currentURL = FlowRouter.current().path;
		var actualURL = currentURL.substring(1).split('/');
		$('.sidebarlink1').removeClass('active');
		$('.'+actualURL[0]).addClass('active');
		// console.log('currentURL: ',currentURL,' | actualURL: ',actualURL);
});

Template.notificationConfig.onRendered(()=>{
		var currentURL = FlowRouter.current().path;
		var actualURL = currentURL.substring(1).split('/');
		$('.sidebarlink1').removeClass('active');
		$('.'+actualURL[0]).addClass('active');
		// console.log('currentURL: ',currentURL,' | actualURL: ',actualURL);
});