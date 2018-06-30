import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';

import { Business } from '/imports/api/businessMaster.js';
import { Likes } from '/imports/api/likesMaster.js';
import { Bookmark } from '/imports/api/bookmarkMaster.js';
import { BeenThere } from '/imports/api/beenThereMaster.js';
import { Review } from '/imports/api/reviewMaster.js';
import { FollowUser } from '../../api/userFollowMaster.js';
import { UserReviewStoreS3New } from '/client/UserReviewS3.js';
import { SavedOffer } from '/imports/api/savedOffersMaster.js';
import { Enquiry } from '/imports/api/enquiryMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './userSidebar.html';

Template.userSidebar.events({
	'click .userMenuItem':function(event){       
        $('.userMenuItem').removeClass('active');
        $(event.currentTarget).addClass('active');
        $("html,body").scrollTop(0);
	},
});

Template.userSidebar.helpers({
	'hideShowMenu':function(){
		if(Session.get("updateUserTimeline")==true){
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				data.statusClass = 'hide';
				data.activeClass = 'active';
				data.changeHref = '/'+(checkIdExists[2]);
			}else{
				data.statusClass = '';
				data.activeClass = '';
				data.changeHref = '';
			}
			return data;
		}else {
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				data.statusClass = 'hide';
				data.activeClass = 'active';
				data.changeHref = '/'+(checkIdExists[2]);
			}else{
				data.statusClass = '';
				data.activeClass = '';
				data.changeHref = '';
			}
			return data;
		}			
		
	},

	'siderbarLikesCount':function(){
		if(Session.get("updateUserTimeline")==true){
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var count = 0;
			var likesData = Likes.find({"userid":id}).fetch();	
			if(likesData){
				for(i=0;i<likesData.length;i++){
					var bussdata = Business.findOne({'_id':likesData[i].businessId,"status":'active'});
						if(bussdata){
							count++;
						}
					}
					var likedDataReturn = {
						noofLikes		: count,
					}
					// console.log("likedDataReturn:",likedDataReturn);
				return likedDataReturn;
			}
		}else {
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var count = 0;
			var likesData = Likes.find({"userid":id}).fetch();	
			if(likesData){
				for(i=0;i<likesData.length;i++){
					var bussdata = Business.findOne({'_id':likesData[i].businessId,"status":'active'});
					// console.log('bussdata')
						if(bussdata){
							count++;
						}
					}
					var likedDataReturn = {
						noofLikes		: count,
					}
					// console.log("likedDataReturn 2:",likedDataReturn);
					var current = window.location.host;
				// console.log("window.location : ",current );
				return likedDataReturn;
			}
		}
		
	},

	'siderbarBookmarkCount':function(){
		if(Session.get("updateUserTimeline")==true){
			$("html,body").scrollTop(0);
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var count = 0;
			var bookmarkData = Bookmark.find({"userId":id}).fetch();
				if(bookmarkData){
					for(i=0;i<bookmarkData.length;i++){
						var bussdata = Business.findOne({'businessLink':bookmarkData[i].businessLink,"status":'active'});
							if(bussdata){
								count++;
							}
						}
					var bookmarkDataReturn = {
						noofBookmark		: count,
					}
					return bookmarkDataReturn;
				}
			}else {
				$("html,body").scrollTop(0);
				var id ='';
				var url = FlowRouter.current().path;
				var checkIdExists = url.split('/');
				var data = {};
				if(checkIdExists[2] != '' && checkIdExists[2]){
					id = produceURLid(checkIdExists[2]);
				}else{
					id = Meteor.userId();
				}
				var count = 0;
				var bookmarkData = Bookmark.find({"userId":id}).fetch();
				if(bookmarkData){	
					for(i=0;i<bookmarkData.length;i++){
					var bussdata = Business.findOne({'businessLink':bookmarkData[i].businessLink,"status":'active'});
					// consosle.log('bussdata 1:',bussdata);
						if(bussdata){
							count++;
						}
					}

				// return likedDataReturn;	
					var bookmarkDataReturn = {
						noofBookmark		: count,
					}
					// console.log('bookmarkDataReturn 2 :',bookmarkDataReturn);
					
					return bookmarkDataReturn;
				}
			}
	
	},

	'siderbarBeenThereCount':function(){
		if(Session.get("updateUserTimeline")==true){
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			count =0;
			var beenThereData = BeenThere.find({"userId":id}).fetch();	
			if(beenThereData){
				for(i=0;i<beenThereData.length;i++){
					var bussdata = Business.findOne({'businessLink':beenThereData[i].businessLink,"status":'active'});
						if(bussdata){
							count++;
						}
					}
				var beenThereDataReturn = {
					noofBeenThere		: count,
				}
				return beenThereDataReturn;
			}
		}else {
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			count = 0;
			var beenThereData = BeenThere.find({"userId":id}).fetch();	
			if(beenThereData){
				for(i=0;i<beenThereData.length;i++){
					var bussdata = Business.findOne({'businessLink':beenThereData[i].businessLink,"status":'active'});
						if(bussdata){
							count++;
						}
					}
				var beenThereDataReturn = {
					noofBeenThere		: count,
				}
				return beenThereDataReturn;
			}
		}
		
	},

	'siderbarOffersCount':function(){
		if(Session.get("updateUserTimeline")==true){
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var offersData = SavedOffer.find({"userId":id}).fetch();
			if(offersData){
				var noofoffers	=  offersData.length;
				return noofoffers;
			}else{
				var noofoffers = 0;
				return noofoffers;
			}
		}else {
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var offersData = SavedOffer.find({"userId":id}).fetch();
			if(offersData){
				var noofoffers	=  offersData.length;
				return noofoffers;
			}else{
				var noofoffers = 0;
				return noofoffers;
			}
		}
	
	},

	'siderbarPhotosCount':function(){
		if(Session.get("updateUserTimeline")==true){
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var photoData = Review.find({"userId":id}).fetch();
			var	noofPics = 0;
			if(photoData){
				for (var i = 0; i < photoData.length; i++) {
					if(photoData[i].reviewImages){
						var imgListCount = photoData[i].reviewImages.length;
						for(j = 0 ; j < imgListCount ; j++)
						{
							var imgId =  photoData[i].reviewImages[j];
							var imgData = UserReviewStoreS3New.findOne({"_id":imgId.img});
							if(imgData){
								noofPics++;
							}
						}
					}
				}
				return noofPics;
			}else{
				return noofPics;
			}
		}else {
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var photoData = Review.find({"userId":id}).fetch();
			var	noofPics = 0;
			if(photoData){
				for (var i = 0; i < photoData.length; i++) {
					if(photoData[i].reviewImages){
						var imgListCount = photoData[i].reviewImages.length;
						for(j = 0 ; j < imgListCount ; j++)
						{
							var imgId =  photoData[i].reviewImages[j];
							var imgData = UserReviewStoreS3New.findOne({"_id":imgId.img});
							if(imgData){
								noofPics++;
							}
						}
					}
				}
				return noofPics;
			}else{
				return noofPics;
			}
		}
		
	},

	'followers':function(){
		if(Session.get("updateUserTimeline")==true){
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			return FollowUser.find({'followUserId':id}).count();
		}else {
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			return FollowUser.find({'followUserId':id}).count();
		}
		
	},

	'siderbarReviewCount':function(){
		if(Session.get("updateUserTimeline")==true){
			console.log('inside update Session if');
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var count = 0;
			var ReviewData = Review.find({"userId":id}).fetch();
			if(ReviewData){
				for(i=0;i<ReviewData.length;i++){
					var bussdata = Business.findOne({'_id':ReviewData[i].businessLink,"status":'active'});
					// console.log('bussdata')
						if(bussdata){
							count++;
						}
					}
					var ReviewDataReturn = {
						noofReviews		: count,
					}
					// console.log("ReviewDataReturn 2:",ReviewDataReturn);
				return ReviewDataReturn;
			}
			// return ReviewData;
		}else {
			console.log('inside else');
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var count = 0;
			var ReviewData = Review.find({"userId":id}).fetch();
			console.log('reviewdata :',ReviewData);
			if(ReviewData){
				for(i=0;i<ReviewData.length;i++){
					console.log('ReviewData length :',ReviewData.length);
					console.log('ReviewData[i].businessLink :',ReviewData[i].businessLink);

					var bussdata = Business.find({'businessLink':ReviewData[i].businessLink,"status":'active'}).fetch();
					console.log('bussdata 1 :',bussdata);
						if(bussdata){
							count++;
						}
					}
					console.log('count :',count);
					var ReviewDataReturn = {
						noofReviews		: count,
					}
					// console.log("ReviewDataReturn 2:",ReviewDataReturn);
				return ReviewDataReturn;
			}
			// return ReviewData;
		}
	
	},

	'ratingsCount':function(){
		if(Session.get("updateUserTimeline")==true){
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var count = 0;
			var RatingData = Review.find({"userId":id}).fetch();	
			if(RatingData){
				for(i=0;i<RatingData.length;i++){
					var bussdata = Business.findOne({'businessLink':RatingData[i].businessLink,"status":'active'});
						if(bussdata){
							count++;
						}
					}
				var RatingDataReturn = {
					noofRatingData		: count,
				}
				return RatingDataReturn;

			// 	var	noofRatingData   = RatingData.length;
			// 	return noofRatingData;
			// }else{
			// 	var noofRatingData = 0;
			// 	return noofRatingData;
			}
		}else {
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var count = 0;
			var RatingData = Review.find({"userId":id}).fetch();	
			if(RatingData){
				for(i=0;i<RatingData.length;i++){
					var bussdata = Business.findOne({'businessLink':RatingData[i].businessLink,"status":'active'});
						if(bussdata){
							count++;
						}
					}
				var RatingDataReturn = {
					noofRatingData		: count,
				}
				return RatingDataReturn;

			// 	var	noofRatingData   = RatingData.length;
			// 	return noofRatingData;
			// }else{
			// 	var noofRatingData = 0;
			// 	return noofRatingData;
			}
		}
		

	},

	'enquiryCountUser':function(){
		if(Session.get("updateUserTimeline")==true){
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var enqCount = Enquiry.find({"enquirySentBy":id}).count();
			if(enqCount){
				var	noofEnquiryData   = enqCount;
				return noofEnquiryData;
			}else{
				var noofEnquiryData = 0;
				return noofEnquiryData;
			}
		}else {
			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
			}else{
				id = Meteor.userId();
			}
			var enqCount = Enquiry.find({"enquirySentBy":id}).count();
			if(enqCount){
				var	noofEnquiryData   = enqCount;
				return noofEnquiryData;
			}else{
				var noofEnquiryData = 0;
				return noofEnquiryData;
			}
		}
		

	},
});




// q=rightnxt+url&oq=user+data&aqs=chrome..69i57j0j69i60l2j0l2.4907j0j7|{{changeHref}}|&sourceid=chrome&ie=UTF-8 
