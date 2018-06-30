import { BusinessAds } from '/imports/api/businessAdsMaster.js';
import { Session } from 'meteor/session';
import { Business } from '/imports/api/businessMaster.js';
import { Bert } from 'meteor/themeteorchef:bert';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '/imports/admin/commonAdmin/commonAdmin.js';
import './businessAdsList.html';



Template.businessAdsList.onRendered(function(){
	$('.activeBanner').addClass('activeBannerColor');
	Session.set("activeAds","active");
});



Template.businessAdsList.helpers({
	adsDetails: function(){
		var bannerStatus = '';
		var bannerListDetails = [];
		if(Session.get("activeAds")=="active"){
			bannerStatus = "active";
		}else if(Session.get("activeAds")=="new"){
			bannerStatus = "new";
		} else {
			bannerStatus = "inactive";
		}
		
    	var adsData = BusinessAds.find({"status":bannerStatus}).fetch();
    	// console.log('adsData:',adsData);
    	if(adsData){
    		var data = _.uniq(adsData, function(p){ return p.businessLink; });
    		for(i=0;i<data.length;i++){
    			var categoryArr = [];
    			var positionArr = [];
    			for(j=0;j<adsData.length;j++){
	    			if(data[i].businessLink==adsData[j].businessLink){
	    				categoryArr.push(adsData[j].category);
	    				positionArr.push(adsData[j].position);
	    			}
	    		}

	    		var buttonStatus = '';
	    		var buttonStatusText = '';
	    		if(data[i].status=="active"){
	    			buttonStatus = "danger";
	    			buttonStatusText = "Deactivate";
	    		}else{
	    			buttonStatus = "success";
	    			buttonStatusText = "Activate";
	    		}

	    		var objData = {
    				categoryArrList		: categoryArr,
    				businessLink		: data[i].businessLink,
    				bussinessTitle		: data[i].businessTitle,
    				businessPosition	: positionArr,
    				bannerDuration		: data[i].noOfMonths,
    				buttonStatusText 	: buttonStatusText,
					buttonStatus 		: buttonStatus,
					startDate			: moment(data[i].startDate).format('DD/MM/YYYY'),
					endDate				: moment(data[i].endDate).format('DD/MM/YYYY'),
    			};
    			
    			bannerListDetails.push(objData);
	    		
    		}
    	}

    	// Search by Business Title or Business Category
    	if(Session.get('adsTextSearch')){
    		var textSearch = (Session.get('adsTextSearch')).toUpperCase();
    		filteredArr = [];
    		for(i=0;i<bannerListDetails.length;i++){

				var searchTextString = false;
				for(j=0;j<bannerListDetails[i].categoryArrList.length;j++){
					if(((bannerListDetails[i].categoryArrList[j]).toUpperCase()).indexOf(textSearch) != -1){
						searchTextString = true;
					}
				}

				if((bannerListDetails[i].bussinessTitle.toUpperCase()).indexOf(textSearch) != -1 || searchTextString){
					filteredArr.push(bannerListDetails[i]);
				}
    		}
			return filteredArr;
    	}


    	
    	return bannerListDetails;
	},
});

Template.businessAdsList.events({
	'click .activeBanner':function(){
		$('.bannerComClass').removeClass('activeBannerColor');
		$('.activeBanner').addClass('activeBannerColor');
		Session.set("activeAds","active");
	},
	'click .newBanner':function(){
		$('.bannerComClass').removeClass('activeBannerColor');
		$('.newBanner').addClass('activeBannerColor');
		Session.set("activeAds","new");
	},
	'click .inactiveBanner':function(){
		$('.bannerComClass').removeClass('activeBannerColor');
		$('.inactiveBanner').addClass('activeBannerColor');
		Session.set("activeAds","inactive");
	},
	'keyup .listBannerSearch': function(){
		var textBanner = $('.listBannerSearch').val();
		Session.set('adsTextSearch',textBanner);
	},
	'click .btnStatAction': function(event){
		var businessLink = $(event.currentTarget).parent().parent().parent().parent().parent().parent().siblings('.bannerTitleFont').children('.bannerLinkFont').text();
    	var bannerData = BusinessAds.find({"businessLink":businessLink}).fetch();

		if(bannerData){
			if($('.activeBanner').hasClass('activeBannerColor')){
				for(i=0;i<bannerData.length;i++){
					var catg = bannerData[i].category;

					Meteor.call('deactivateAdsPayment', businessLink, catg, function(error,position){
						if(error){
							// console.log('Error occured while removing Business Banner: ', error);
						}else{
							// console.log('Business Bannerremoved successfully');
							$('.modal-backdrop').hide();
						}
					});
				}
			} else if($('.newBanner').hasClass('activeBannerColor')){
				for(i=0;i<bannerData.length;i++){
					var catg = bannerData[i].category;
					var checkBus = Business.findOne({'businessLink':businessLink},{fields:{"status":1}});
					// console.log("checkBus: ",checkBus);
					if(checkBus.status != "inactive"){
						Meteor.call('activateAdsPayment', businessLink, catg, function(error,position){
							if(error){
								console.log('Error occured while removing Business Banner: ', error);
							}else{
								// console.log('Business Bannerremoved successfully');
								$('.modal-backdrop').hide();
							}
						});
					}else{
						Bert.alert('Activate the Business First','danger','growl-top-right');
					}
					
				}
			} else if($('.inactiveBanner').hasClass('activeBannerColor')){
				for(i=0;i<bannerData.length;i++){
					var catg = bannerData[i].category;
					var checkBus = Business.findOne({'businessLink':businessLink},{fields:{"status":1}});
					if(checkBus.status != "inactive"){
						Meteor.call('activateAdsPayment', businessLink, catg, function(error,position){
							if(error){
								console.log('Error occured while removing Business Banner: ', error);
							}else{
								// console.log('Business Bannerremoved successfully');
								$('.modal-backdrop').hide();
							}
						});
					}else{
						Bert.alert('Activate the Business First','danger','growl-top-right');
					}
					
				}
			}


			
		}
	},
	'click .btnDeleteAction': function(event){
		var businessLink = $(event.currentTarget).parent().parent().parent().parent().parent().parent().siblings('.bannerTitleFont').children('.bannerLinkFont').text();
    	var bannerData = BusinessAds.find({"businessLink":businessLink}).fetch();
    	
		for(i=0;i<bannerData.length;i++){
			var catg = bannerData[i].category;
			Meteor.call('removeBusinessAdsAll', businessLink, catg, function(error,position){
				if(error){
					console.log('Error occured while removing Business Banner: ', error);
				}else{
					console.log('Business Bannerremoved successfully');
					$('.modal-backdrop').hide();
				}
			});
		}
	},
});

businessAdsListForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'businessAdsList'});
}

export { businessAdsListForm }