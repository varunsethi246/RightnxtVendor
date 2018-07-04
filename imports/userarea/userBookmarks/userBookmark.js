import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from '../../api/businessMaster.js';
import { Bookmark } from '../../api/bookmarkMaster.js';
import { BusinessImgUploadS3 } from '/client/cfsjs/businessImage.js';
import { UserReviewStoreS3New } from '/client/cfsjs/UserReviewS3.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../userLayout.js';
import '../../vendor/vendorBusinessDetails/businessEventIcons.html';
import './userBookmarks.html';

sortBookmarkDateAscending = function(){
    var products = $('.bookmarkImg');
    products.sort(function(a, b){ return $(a).data("date")-$(b).data("date")});
    $("#bookmarkDateSort").html(products);

}

sortBookmarkDateDescending = function(){
    var products = $('.bookmarkImg');
    products.sort(function(a, b){ return $(b).data("date") - $(a).data("date")});
    $("#bookmarkDateSort").html(products);

}

Template.userBookmarks.helpers({
	checkBookmarkLoading(){
		var id = '';
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('/');
		if(checkIdExists[2] != '' && checkIdExists[2]){
			id = produceURLid(checkIdExists[2]);
		}else{
			id = Meteor.userId();
		}
		var businessBookmark = Bookmark.find({"userId":id}).count();
		
		if(businessBookmark <= 0){
			return true;
		}else{
			return false;
		}
	},
	bookmarkData: function(){
		var id = '';
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('/');
		if(checkIdExists[2] != '' && checkIdExists[2]){
			id = produceURLid(checkIdExists[2]);
		}else{
			id = Meteor.userId();
		}
		var bookmarkdataArr = [];
		var userID  = id;
		var businessBookmark = Bookmark.find({"userId":userID}).fetch();
		if(businessBookmark){
			// console.log('businessBookmark ' , businessBookmark);

			for(i=0; i<businessBookmark.length; i++){

				var businessId = businessBookmark[i].businessId;
				var businessObj = Business.findOne({"_id":businessId, "status":'active'});
				
				if(businessObj){
					// console.log('businessObj :',businessObj);
					var bookmarkDateNumber = businessBookmark[i].createdAt;
					businessBookmark[i].bookmarkDateNumber = bookmarkDateNumber.getTime();
					if(businessObj.businesscategories){
					// console.log('businessObj.businesscategories :',businessObj.businesscategories);

						var categories = getCategory(businessObj.businesscategories);
						if(categories){
							// console.log('categories :',categories);
							businessBookmark[i].categoryClasses = categories;
						}else{
							businessBookmark[i].categoryClasses = '';
						}

						businessBookmark[i].businessName = businessObj.businessTitle;
						businessBookmark[i].businessArea = businessObj.businessArea;

						businessObj.businessArea 	= businessObj.businessArea.split(' ').join('-');
						businessBookmark[i].AreaClasses 	= businessObj.businessArea.split('.').join('-');

						businessBookmark[i].businessCity = businessObj.businessCity;
						businessBookmark[i].businessLink = businessObj.businessLink;

						if(businessObj.businessImages){
							if(businessObj.businessImages.length>0){
								var pic = BusinessImgUploadS3.findOne({"_id":businessObj.businessImages[0].img});
								var pic1 = UserReviewStoreS3New.findOne({"_id":businessObj.businessImages[0].img});
								if(pic){
									businessBookmark[i].ownerPhoto = pic.url();
								}else if(pic1){
									businessBookmark[i].ownerPhoto = pic1.url();
								}else{
									businessBookmark[i].ownerPhoto = '../images/rightnxt_image_nocontent.jpg'
								}	
							}else{
								businessBookmark[i].ownerPhoto = '../images/rightnxt_image_nocontent.jpg'
							}
						}
						else{
							businessBookmark[i].ownerPhoto = '../images/rightnxt_image_nocontent.jpg'
						}
					}
					bookmarkdataArr.push(businessBookmark[i]);
				}
			}
			console.log('businessBookmark ' , businessBookmark);
			return bookmarkdataArr;	
		}
	},

	businessBookmarkCategoriesList(){
		var id = '';
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('/');
		if(checkIdExists[2] != '' && checkIdExists[2]){
			id = checkIdExists[2];
		}else{
			id = Meteor.userId();
		}
		var userId     = id;
		var categories =[];
		var businessObj = Bookmark.find({"userId":userId}).fetch();
		if(businessObj){
			for (var i = 0; i < businessObj.length; i++) {
				var businessLinkVar	= businessObj[i].businessLink;
				var businessData   	= Business.findOne({'businessLink':businessLinkVar});
				if (businessData){
					if(businessData.businesscategories){
						var categoriesCount = businessData.businesscategories.length;
						for(j = 0 ; j < categoriesCount ; j++)
						{
							var levelDataObject =  businessData.businesscategories[j];
							// console.log('levels data : '+ levelData);
							var levelData =  String(levelDataObject);
							if (levelData) {
								var levels = levelData.split('>');
								if(levels[1]){
									var level1 = levels[1].trim();
									categories.push(level1);
								}
							}									
						}
					}
				}
			}
			var busCategories = _.uniq(categories);
			// console.log('categories: '+ JSON.stringify(busCategories,4,null));
			return busCategories;
		}

	},

	businessBookmarkLocationList(){
		var id = '';
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('/');
		if(checkIdExists[2] != '' && checkIdExists[2]){
			id = checkIdExists[2];
		}else{
			id = Meteor.userId();
		}
		var userId     = id;
		var location =[];
		var businessObj = Bookmark.find({"userId":userId}).fetch();
		if(businessObj){
			for (var i = 0; i < businessObj.length; i++) {
				var businessLinkVar	= businessObj[i].businessLink;
				var businessData   	= Business.findOne({'businessLink':businessLinkVar});
				if(businessData){
					if(businessData.businessArea){
						location.push(businessData.businessArea);
					}
				}
			}
			var busLocation = _.uniq(location);
			return busLocation;
		}

	},
	
});


getCategory = function(categoriesArray){
	var categories = [];
	if(categoriesArray){
		// console.log(categoriesArray);
		var categoriesCount = categoriesArray.length;
		// console.log(categoriesCount);
		for(j = 0 ; j < categoriesCount ; j++)
		{
			var levelDataObject =  categoriesArray[j];
			// console.log('levels data : ', levelData);
			// console.log(typeof levelData);
			var levelData  =  String(levelDataObject);
			if (levelData) {
			  var levels     =  levelData.split('>');
				if(levels[1]){
					// console.log(levels[1]);
					var level1 = levels[1].trim();
					// console.log(level1);
					categories.push(level1);
					// levelData = '';
				}	
			}
		}
		// console.log(categories);
		var busCategories = _.uniq(categories);
		var categoryClasses = '';
		for(k=0;k<busCategories.length;k++){
			var businessSplit = busCategories[k].split(' ').join('-');
			categoryClasses = categoryClasses + ' ' + businessSplit;
		}
		return categoryClasses;
	}
}

Template.userBookmarks.events({
	'change #sortBookmarkDate' : function(){
		var sortDate = $('#sortBookmarkDate').val();
		if(sortDate == 'oldestRevFirst'){
			sortBookmarkDateAscending();
		}else{
			sortBookmarkDateDescending();
		}
	},

	'change .categorySelect' : function(event){
		event.preventDefault();
		var categoryValueSelected = $(event.target).val();
		var showCat = categoryValueSelected.split(' ').join('-');
		if(categoryValueSelected == '-'){
			$('.bookmarkImg').show();
		}else{
			$('.bookmarkImg').hide();
			$('.'+showCat).show();			
		}
	},

	'change .locationSelect' : function(event){
		event.preventDefault();
		var LocationValueSelected = $(event.target).val();
		var showLoc = LocationValueSelected.split(' ').join('-');
		var showLoc = showLoc.split('.').join('-');
		if(LocationValueSelected == '-'){
			$('.bookmarkImg').show();
		}else{
			$('.bookmarkImg').hide();
			$('.'+showLoc).show();			
		}
	},
});

userBookmarksForm = function () {  
  BlazeLayout.render("userLayout",{content: 'userBookmarks'});
  // Blaze.render(Template.userLayout,document.body);
}
export { userBookmarksForm }