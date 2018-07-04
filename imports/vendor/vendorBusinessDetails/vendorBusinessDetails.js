import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';
import { ReactiveVar } from 'meteor/reactive-var';
import { BizVideo } from '/imports/videoUploadClient/videoUpload.js';
import { Business } from '/imports/api/businessMaster.js';
import { Offers } from '/imports/api/offersMaster.js';
import { Review } from '/imports/api/reviewMaster.js';
import { Bookmark } from '/imports/api/bookmarkMaster.js';
import { BeenThere } from '/imports/api/beenThereMaster.js';
import { OfferImagesS3 } from '/client/cfsjs/offersImagesS3.js';
import { BusinessVideoUpload } from '/client/cfsjs/businessVideo.js';
import { Likes } from '/imports/api/likesMaster.js';
import { BussImgLikes } from '/imports/api/businessImageLikesMaster.js';
import { UserStatistics } from '/imports/api/userViewMaster.js';
import { UserLatLng } from '/imports/api/userViewMaster.js';
import { BusinessMenuUpload } from '/client/cfsjs/businessMenu.js';
import { BusinessImgUploadS3 } from '/client/cfsjs/businessImage.js';
import { UserReviewStoreS3New } from '/client/cfsjs/UserReviewS3.js';
import { SavedOffer } from '/imports/api/savedOffersMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../BusinessEnquiry/businessEnquiry.js';
import './vendorBusinessLayout.html';
import './vendorBusinessCarousel.js';
import './imageReports/imageReports.js';
import './imageReports/imageReports.html';
import '/imports/common/common.js';


/* leftSidebar */
import './businessLeftSidebar.html';
import './businessModeOfPayment.html';
import './businessContactDetails.html';
import './businessContactDetails.js';
import './businessOfferDetails.html';
import './businessTimingDetails.html';

/* mainContent*/
import './businessMainContent.html';
import './descriptionTabContent.html';
import './businessEventIcons.html';
import './businessEvntIcons2.html';
import './businessEventIcons.js';

import './reportModalForm.html';
import './reportModalForm.js';

import './businessInformation.html';
import './businessInformation.js';
import './addReviewTemplate.html';
import './addReviewTemplate.js';
import './userReviewTemplate.html';
import './userReviewTemplate.js';
import './vendorLayoutOne.html';

import './offersTabContent.html';
import './offersTabContent.js';
import './descriptionTabContent.js';
import './bookmarkBusiness.js';


/* rightSidebar */
import './businessRightSidebar.html';
import './businessLocation.html';
import './nearbyBusiness.html';
import './nearbyBusiness.js';
import '../../common/loading.html'
import '../../common/header.html'
import '../../common/footer.html'
import '../../common/generalHeader.js'
import '../../common/vendorSignUpForm.js'


/*image Carousel*/
// import './imageCarouselItems.js' 
import './imageReports/imageReports.js' 


if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load({ v: '3', key: 'AIzaSyBmAGm7dbq4Mz7TxFQjJnmyi9aJ3U5SndU', libraries: 'geometry,places' });
  });
}

Template.businessLocation.onRendered(function() {
  GoogleMaps.load();
});


Template.businessLocation.helpers({
    businessMapLocation: function() {
      if (GoogleMaps.loaded()) {
        var businessLink = FlowRouter.getParam('businessurl');
	    var businessData = Business.findOne({'businessLink':businessLink});
	    var busLat = businessData.businessLatitude;
	    var busLong = businessData.businessLongitude;
	        return {
	          // marker
	          center: new google.maps.LatLng(busLat, busLong),
	          zoom: 14
	        };
      }
    },
  });

Template.businessLocation.onCreated(function() {
 
  GoogleMaps.ready('exampleMap', function(map) {
      if(GoogleMaps.loaded()){
     
     	var businessLink = FlowRouter.getParam('businessurl');
	    var businessData = Business.findOne({'businessLink':businessLink});
	    if(businessData){
	    	var area = businessData.businessArea;
	    	var addr = businessData.businessAddress;
        	var city = businessData.businessCity;
        	var state = businessData.businessState;
	        var pincode = businessData.businessZipCode;
		    var marker = new google.maps.Marker({
		      position: map.options.center,
		      map: map.instance
		    });
		     var contentString = '<div id="content">'+'<p>'+addr+','+city+'</p>'+'<p>'+state+'-'+pincode+'</p>'+'</div>';
		      var infowindow = new google.maps.InfoWindow({
		        content: contentString
		      });
		      marker.addListener('click', function() {
		        infowindow.open(map, marker);
		      });
		}//businessData
      }
    });
});

Template.vendorBusinessLayout.events({
	'click .openToBusOfferSec': function(event){
		console.log('im here');
		// offersData
		// $(".offersData").trigger("click");
		var getOfferDiv = $(".offersData").attr('class');
		console.log("getOfferDiv: ",getOfferDiv);
		$(".descData").removeClass('active');
		$(".offersData").addClass('active');
		$("#description").removeClass('active in');
		$("#offers").addClass('active in');
	},
	'click .bussScrollTop' : function(event){
    	var $this = $(event.target);
		$('html, body').animate({
   		     scrollTop: $('body').offset().top
      		}, 1000,
  		);
    },
    'click .offer_showmore': function(event){
		event.preventDefault();
		$('.nav-tabs a[href="#offers"]').tab('show');
		var scrollHeight = 150;
  		var windowWidth = $( window ).width();
  		if(windowWidth >= 320 && windowWidth < 450){
  			scrollHeight = 670;
  		}else if(windowWidth >= 451 && windowWidth < 767){
  			scrollHeight = 660;
  		}

  		$('html, body').animate({
   	 		'scrollTop' : scrollHeight }, 500
		);
	},

});

Template.vendorBusinessLayout.onRendered(function(){
	$(window).scroll(function() {
     	if ($(document).scrollTop() > 80) {
	    	$('.bussScrollTop').fadeIn("slow");
	    } else {
	    	$('.bussScrollTop').fadeOut("slow");
	    }
    });

	var businessLink = FlowRouter.getParam('businessurl');
	var count = 1;
	
	var now = moment();
	var date = moment(now).format('DD/MM/YYYY');
	Meteor.call('insertUserStatistics',date,count,businessLink,function(error,result){
		if(error){
			console.log(error);
		}else{
		}
	});

	navigator.geolocation.getCurrentPosition(success, error);
     function success(position) {
         var GEOCODING = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + position.coords.latitude + '%2C' + position.coords.longitude + '&language=en';
         $.getJSON(GEOCODING).done(function(location) {
		  
			if(location.results.length > 0){
				for(var i=0; i< location.results[0].address_components.length; i++){
					if( location.results[0].address_components[i].types[0] == 'postal_code' ){
						var lat = location.results[0].geometry.location.lat;
						var lng = location.results[0].geometry.location.lng;
			 
					}            
				}
		  
				for (var j=0; j<location.results[0].address_components.length; j++) {
					for (var b=0;b<location.results[0].address_components[j].types.length;b++) {
						if (location.results[0].address_components[j].types[b] == "sublocality_level_1") {
							city= location.results[0].address_components[j];
							var cityName = city.long_name;
						}
					}
				}

				var businessUrl = FlowRouter.getParam('businessurl');
				
				Meteor.call('insertUserCity',lat,lng,cityName,businessUrl,function(err,result){
					if(err){
						console.log(err);
					}else{
						// console.log('inserted');
					}
				});

			}

        })
     }
     function error(err) {
     };
});

Template.vendorBusinessLayout.helpers({
   	isReady: function(){
   		// console.log("hi... ", FlowRouter.subsReady('userfunction'));
       // if(FlowRouter.subsReady('userfunction')){
       // 		return FlowRouter.subsReady('userfunction');
       // }else{
       // 	return false;
       // }
       // console.log(Meteor.subscribe('userfunction').ready());
        return Meteor.subscribe('userfunction').ready();
    },
});

Template.vendorBusinessLayout.helpers({
	businessData(){
		var currentUrl = FlowRouter.getParam('businessurl');
		var userId = Meteor.userId();
		var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
		var bookmarkBusiness	= Bookmark.findOne({"userId":userId , "businessLink": currentUrl});
		var beenThereUser		= BeenThere.findOne({"userId":userId , "businessLink": currentUrl});
		var userLikes			= Likes.findOne({"userid":userId , "businessLink": currentUrl});
		var businessObj			= Business.findOne({'businessLink':currentUrl});

		if(businessObj){
			if(businessObj.status == 'inactive' ){
				businessObj.showBusinessContent = 'hide';
				businessObj.showNoContent = 'show';
			}else{
				businessObj.showBusinessContent = 'show';
				businessObj.showNoContent = 'hide';
			}
			if(businessObj.businessTimings){
		
				busTimArrLength 	= businessObj.businessTimings.length;
				var xtoday 			= 0;
				var currentDate 	= new Date();
				var currentDay 		= currentDate.getDay();
				var openCloseTime	= [
										{"day":"Mon","timing":[]},
										{"day":"Tue","timing":[]},
										{"day":"Wed","timing":[]},
										{"day":"Thu","timing":[]},
										{"day":"Fri","timing":[]},
										{"day":"Sat","timing":[]},
										{"day":"Sun","timing":[]},
									];
				for(i=0; i<busTimArrLength; i++){
					for(j=0;j<openCloseTime.length;j++){
						if(businessObj.businessTimings[i].day.substring(0,3) == openCloseTime[j].day){
							openCloseTime[j].timing.push({
										"fromTime": businessObj.businessTimings[i].fromTime, 
										"toTime": businessObj.businessTimings[i].toTime, 
									});
						}
					}
					if(days[currentDay] == businessObj.businessTimings[i].day){
						if(xtoday == 0){
							businessObj.todayTimings = [{ 
								"todayFromTime" : businessObj.businessTimings[i].fromTime,
								"todayToTime"   : businessObj.businessTimings[i].toTime,
							}];							
						}else{
							businessObj.todayTimings.push({ 
								"todayFromTime" : businessObj.businessTimings[i].fromTime,
								"todayToTime"   : businessObj.businessTimings[i].toTime,
							});
						}
						xtoday++;
					}
				}

			}

			businessObj.openCloseTime = openCloseTime;
			if(bookmarkBusiness){
				businessObj.bookmarkStatus = "active";
			}
			else{
				businessObj.bookmarkStatus = "inactive";	
			}
			if(beenThereUser){
				businessObj.beenThereStatus = "active";
			}
			else{
				businessObj.beenThereStatus = "inactive";	
			}
			if(userLikes){
				businessObj.likesStatus = "active";
			}
			else{
				businessObj.likesStatus = "inactive";	
			}
			//======================================================
			//  For Business Menu & Photo Images
			//======================================================
			if(businessObj.businessMenu){
				for(var i=0; i<businessObj.businessMenu.length; i++){
					var businessImgData = BusinessMenuUpload.findOne({"_id":businessObj.businessMenu[i].menu});
					if(businessImgData){
						if(businessImgData.copies){
							if(businessImgData.copies.businessMenu.type == 'image/png'){
								businessObj.businessMenu[i].checkpngImg = 'bkgImgNone';
							}else{
								businessObj.businessMenu[i].checkpngImg = '';
							}
						}
						businessObj.businessMenu[i].menuUrl = businessImgData.url();
						if(i < 6){
							businessObj.businessMenu[i].showMenu = "";	
						}else{
							businessObj.businessMenu[i].showMenu = "hideOffer";	
						}		
						if(i == 5){
							businessObj.businessMenu[i].showMoreImg = "";
						}else{
							businessObj.businessMenu[i].showMoreImg = "hideOffer";	
						}
					}
				}
			}
			if(businessObj.businessImages){
				for(var i=0; i<businessObj.businessImages.length; i++){
					var userImgData = UserReviewStoreS3New.findOne({"_id":businessObj.businessImages[i].img});
					if(userImgData){ 
						if(userImgData.copies){
							if(userImgData.copies.userReviewS3.type == 'image/png'){
								businessObj.businessImages[i].checkpngImage = 'bkgImgNone';
							}else{
								businessObj.businessImages[i].checkpngImage = '';
							}
						}
						businessObj.businessImages[i].imgUrl  = userImgData.url() ;
						businessObj.businessImages[i].showImg  = "hideOffer" ;
					}else{
						var businessImgData = BusinessImgUploadS3.findOne({"_id":businessObj.businessImages[i].img});
						if(businessImgData){
							if(businessImgData.copies){
								if(businessImgData.copies.businessImgS3.type == 'image/png'){
									businessObj.businessImages[i].checkpngImage = 'bkgImgNone';
								}else{
									businessObj.businessImages[i].checkpngImage = '';
								}
							}	
							businessObj.businessImages[i].imgUrl = businessImgData.url();
							businessObj.businessImages[i].showImg = "hideOffer";
						}						
					}
					if(i < 6){
						businessObj.businessImages[i].showPhoto = "";	
					}else{
						businessObj.businessImages[i].showPhoto = "hideOffer";	
					}

					var busImgLikes = BussImgLikes.findOne({"userId":Meteor.userId(), "LikedImage":businessObj.businessImages[i].img});
					if(busImgLikes){
						businessObj.businessImages[i].likeIcon = "";		
					}else{
						businessObj.businessImages[i].likeIcon = "-o";		
					}

				}
				
				if(businessObj.businessImages[5]){
					businessObj.businessImages[5].showImg = "";
				}
			}

			if(businessObj.ownerPhoto){
				var businessImgData = BusinessImgUploadS3.findOne({"_id":businessObj.ownerPhoto});	
				if(businessImgData){
					businessObj.picUrl = businessImgData.url();
				}
			}

			var payObj = businessObj.businessModeOfPay;

			if(payObj){			
				var businessModeOfPayArray = [];
				for (var key in payObj){
					if(payObj[key]){
						businessModeOfPayArray.push(key);	
					}				   
				}
				businessObj.businessModeOfPayArray = businessModeOfPayArray;
			}

			if(businessObj.businessAboutBus){
				if(businessObj.businessAboutBus.length > 300){
					var aboutDesc1 = businessObj.businessAboutBus.substring(0,300);
					var aboutDesc2 = businessObj.businessAboutBus.substring(300,businessObj.businessAboutBus.length);
					businessObj.aboutOwnerDesc1 = aboutDesc1;
					businessObj.aboutOwnerDesc2 = aboutDesc2;		
				}

			}

			if(businessObj.ownerDesc){
				if(businessObj.ownerDesc.length > 300){
					var desc1 = businessObj.ownerDesc.substring(0,300);
					var desc2 = businessObj.ownerDesc.substring(300,businessObj.ownerDesc.length);
					businessObj.ownerDesc1 = desc1;
					businessObj.ownerDesc2 = desc2;					
				}
			}

			

			if(Meteor.userId()){
				var userReview = Review.findOne({"userId":Meteor.userId(),"businessLink":currentUrl});
				if(userReview){
					if(userReview.rating > 0){
						businessObj.alreadyReviewed = true;	
					}else{
						businessObj.alreadyReviewed = false;	
					}
				}
			}

			return businessObj;			
		}
	},
});


Template.businessMainContent.helpers({
	offersBussData(){
		var businessLink = FlowRouter.getParam('businessurl');
	  	var businessObj = Business.findOne({"businessLink": businessLink, 'status': 'active'});

	  	if(businessObj){
			var businessOffers = Offers.findOne({"businessId" : businessObj._id, "offerStatus":'Active'});
			if( businessOffers ){
				return true;
			}else{
				return false;
			}
		}
	},	
});

Template.businessOfferDetails.helpers({
	offersData(){
		var businessLink = FlowRouter.getParam('businessurl');
	  	var businessObj = Business.findOne({"businessLink": businessLink});
	  	if(businessObj){
			var businessOffers = Offers.find({"businessId" : businessObj._id, "offerStatus":'Active'}).fetch();
			if(businessOffers){
				for(i=0; i<businessOffers.length; i++){
					var date = businessOffers[i].expirationFromDate;
					var toDate = businessOffers[i].expirationToDate;
					if(i < 3){
						businessOffers[i].class = "";
						businessOffers[i].expirationFromDate = moment(date).format("DD MMM");
						businessOffers[i].expirationToDate = moment(toDate).format("DD MMM YYYY");	
					}else{
						businessOffers[i].class = "hideOffer";
						businessOffers[i].expirationFromDate = moment(date).format("DD MMM"); 	
						businessOffers[i].expirationToDate = moment(toDate).format("DD MMM YYYY");	
					}		
					if(i == 2){
						businessOffers[i].bussShow = "bussShowMore";
					}
				}
				return businessOffers;
			}
		}
	},

	offersGreaterThan3(){
		var businessLink = FlowRouter.getParam('businessurl');
	  	var businessObj = Business.findOne({"businessLink": businessLink});
	  	if(businessObj){
			var businessOffers = Offers.find({"businessId" : businessObj._id, "offerStatus":'Active'}).count();
			if(businessOffers > 3){
				return true;
			}else{
				return false;
			}
		}		
	},
});

	
Template.offersTabContent.helpers({
	vendorOffersData(){
		var businessLink = FlowRouter.getParam('businessurl');
	  	var businessObj = Business.findOne({"businessLink": businessLink, 'status': 'active'});
		var userSavedOffer = SavedOffer.findOne({"userId":Meteor.userId() , "businessLink": businessLink});

	  	if(businessObj){
			var businessOffers = Offers.find({"businessId" : businessObj._id, "offerStatus":'Active'}).fetch();
			if( businessOffers){
				for(i=0; i<businessOffers.length; i++){
					var date = businessOffers[i].expirationFromDate;
					var toDate = businessOffers[i].expirationToDate;
					businessOffers[i].index = i;
					businessOffers[i].expirationFromDate = moment(date).format("DD MMM");
					businessOffers[i].expirationToDate = moment(toDate).format("DD MMM YYYY");

					if(userSavedOffer){
						if(userSavedOffer.offerId == businessOffers[i]._id){
							businessOffers[i].savedOfferStatus = "active";
						}
						else{
							businessOffers[i].savedOfferStatus = "inactive";	
						}
					}else{
						businessOffers[i].savedOfferStatus = "inactive";
					}
				}
			}
			return businessOffers;
		}
	},
	offerImgData(){
		var businessOffers = Offers.findOne({"_id" : this._id, "offerStatus":'Active'});
		if(businessOffers){
			var pic = OfferImagesS3.findOne({'_id' : businessOffers.offerImage});
			if(pic){
				return pic;
			}	
		}
	},
});

Template.offersTabContent.events({
	'click .offerSave': function(event){
		event.preventDefault();
		var id = event.currentTarget.id;
		var usersData = Meteor.users.findOne({"_id":Meteor.userId()});
		// console.log('usersData: ',usersData);
		if(usersData){
			if(usersData.roles){
				if(usersData.roles[0] == "user"){
					if($(event.target).hasClass('inactiveSavedOffer')){
						$(event.target).removeClass('inactiveSavedOffer');
						$(event.target).addClass('activeSavedOffer');
						
						var businessurl = FlowRouter.getParam('businessurl');
						Meteor.call('insertSavedOffer',businessurl,'active',id,
							function(error,result){
								if(error){
									Bert.alert('Some error occured while saving the offer!','danger','growl-top-right','fa-remove');
								}else{
									// Bert.alert('Thanks for saving offer!','success','growl-top-right','fa-check');
								}
							}
						);			
					}else{
						$(event.target).removeClass('activeSavedOffer');
						$(event.target).addClass('inactiveSavedOffer');			
				
						var businessurl = FlowRouter.getParam('businessurl');
						Meteor.call('insertSavedOffer',businessurl,'inactive',id,
							function(error,result){
								if(error){
									Bert.alert('Some error occured while removing offer!','danger','growl-top-right','fa-remove');
								}else{
									// Bert.alert('Ohh... sorry to see you removing offer!','success','growl-top-right','fa-check');
								}
							}
						);			
					}
				}else{
					$('#noserreview').modal('show');
				}
			}else{
				$('#loginModal').modal('show');
				$('.loginScreen').hide();
				$('.signupScreen').hide();
				$('.thankyouscreen').hide();
				$('.genLoginSignup').show();
				$('.thankyouscreen').hide();
				$('.signUpBox').hide();
			}
		}else{
			$('#loginModal').modal('show');
			$('.loginScreen').hide();
			$('.signupScreen').hide();
			$('.thankyouscreen').hide();
			$('.genLoginSignup').show();
			$('.thankyouscreen').hide();
			$('.signUpBox').hide();
		}	
	},

	'click .knowMore': function(event){
		var $this = $(event.target);
		if($this.hasClass('lessShow')){
			$this.html('Know More');
			$this.parent().parent().find('.informationHide').fadeOut();
			$this.removeClass('lessShow');
		}else{
			$this.parent().parent().find('.informationHide').fadeIn();
			$this.html('Less');
			$this.addClass('lessShow');
		}
	}
});

Template.businessTimingDetails.events({
	'click .time-seemore': function(event){
		$('.timingData').slideToggle();
		if($(event.target).hasClass('seeLess')){
			$(event.target).html('( See More+ )');
			$(event.target).removeClass('seeLess');
		}else{
			$(event.target).html('( See Less- )');
			$(event.target).addClass('seeLess');			
		}     
	}
});


fBshare = function(URL,title,description,image){

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1441873185871088',
      xfbml      : true,
      version    : 'v2.10'
    });

    FB.ui({
        method: 'share_open_graph',
        action_type: 'og.shares',
        action_properties: JSON.stringify({
            object : {
               'og:url'        : URL, 
               'og:title'      : title,
               'og:description': description,
               'og:image'      : image 
            }
        })
        },
      function(response) {});


  };
}

shareToGooglePlus =function(destination,title,description,imageurl){
    var go = "https://plus.google.com/share?";
    var url = "url="+encodeURIComponent(destination);
    var title = "title="+encodeURIComponent(title);
    var description = "content="+encodeURIComponent(description);
    var images = "image="+encodeURIComponent(imageurl);
    // newwindow=window.open(go+url+"&"+title+"&"+description+"&"+images,'name','height=400,width=600');
		sharelink = "https://plus.google.com/share?url="+url;
  	newwindow=window.open(sharelink,'name','height=400,width=600');
  	if (window.focus) {newwindow.focus()}                                                                                                                                
  	return false;
}

Template.businessLocation.events({
	'click #businesReportBox' : function(event){
		if(!(Meteor.userId())){
			$('#loginModal').modal('show');
			$('#businessReport').hide();
			$('.loginScreen').hide();
			$('.signupScreen').hide();
			$('.thankyouscreen').hide();
			$('.genLoginSignup').show();
			$('.thankyouscreen').hide();
			$('.signUpBox').hide();
			$('#reportModal').modal('hide');
			$('#nousersreviews').modal('hide');
			$('.reportBox').removeAttr('data-target','#nousersreviews');
		}
	},
	'click .bussMapContainer':function(){
		var businessLink = FlowRouter.getParam('businessurl');
	    var businessData = Business.findOne({'businessLink':businessLink});
	    var busLat = businessData.businessLatitude;
	    var busLong = businessData.businessLongitude;
	    var urlLink = "http://maps.google.com/maps?q="+busLat+"+"+busLong+"&t=h&z=17";
	    window.open(urlLink,'_blank');


	},
});
Template.vendorBusinessCarousel.onCreated(function() {
    this.currentUpload = new ReactiveVar(false);
    this.subscribe('getBizVideo');
});

Template.vendorBusinessCarousel.helpers({
	showVideo(){
		var businessLink = FlowRouter.getParam('businessurl');
    	var bussData = Business.findOne({"businessLink":businessLink});
    	if(bussData){
	        var data = BizVideo.find({"_id":bussData.businessVideo}).fetch();
	        return data;
	    }
	},
});



vendorBusinessLayoutForm = function () { 
	console.log('function render');
	BlazeLayout.render("vendorLayoutOne",{vendorMain: 'vendorBusinessLayout'}); 
  	// Blaze.render(Template.vendorBusinessLayout,document.body);
}

export { vendorBusinessLayoutForm };













