import { Enquiry } from '/imports/api/enquiryMaster.js';
import { Review } from '/imports/api/reviewMaster.js';
import { Offers } from '/imports/api/offersMaster.js';
import { Business } from '/imports/api/businessMaster.js';
import { EnquiryImgUploadS3 } from '/client/cfsjs/enquiryImages.js';
import { BusinessImgUploadS3 } from '/client/cfsjs/businessImage.js';
import { Bert } from 'meteor/themeteorchef:bert';
import { BusinessBanner } from '/imports/api/businessBannerMaster.js';
import { BusinessAds } from '/imports/api/businessAdsMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../../common/searchinitialisation.js'
import './businessList.html'
import './allbusinessList.html';
import './sidebarBusinessList.html';
import './thumbnailBusinessList.html';
import './rightSidebarBusList.html';
import './businessListSearchbar.html';
import './businessMapView/businessMapView.js';
import './businessSearchList.js';
import '../../common/header.html';
import '../../common/generalHeader.js';
import '../../common/vendorSignUpForm.js';
import '../../common/common.js';
import '../BusinessEnquiry/businessEnquiry.js';
import './businessMapView/businessMapView.js';


Session.set('showMapView',false);
Session.set('showGridView',true);


var options = {
	keepHistory: 0,
	localSearch: true
};
var fields = ['businessTitle','tags','businesscategories'];
businessSearchbanner1 = new SearchSource('sidebarBusinessBanners', fields, options);


Template.businessList.onRendered(function(){
    $("html,body").scrollTop(0);

	$('.mapViewBusList').hide();
	$('.gridVwBus').addClass('bkgOrange');
    Session.set('searchLevelText','');
   	GoogleMaps.load();

	var city = '';
	var area = '';	 

	
	var sesCity = FlowRouter.getParam('city');
	if(sesCity){
		city = sesCity;
	}else {
		city = 'Pune';
	}
	$('.hiddenCitySearchInpBox').val(city);
	// console.log("$('.hiddenCitySearchInpBox').val(city);",$('.hiddenCitySearchInpBox').val())

	var sesArea= FlowRouter.getParam('area');
	if(sesArea){
		area = sesArea;
	}else {
		area = 'All Areas';
	}
	
	var category = FlowRouter.getParam('category');
	var searchText = FlowRouter.getParam('searchText');
	var searchTextVar = city + '|' + area + '|' + searchText;
	businessSearch1.search(searchTextVar);
	businessSearchbanner1.search(searchTextVar);

	Session.set("showGridOnMainPageSearch",true);
	if(searchText){
		$('#gridSearchBusiness').val(searchText);
	}else{
		$('#gridSearchBusiness').val("");
	}

});



Template.thumbnailBusinessList.helpers({	
	gridviewBusinessList() {
		var listCategory = [];
		var busList = businessSearch1.getData();
		//**************************************************************
		//*******************To get Current Location********************
		//**************************************************************
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(geoSuccess);
			function geoSuccess(position) {
				var currentLt = position.coords.latitude;
				Session.set("currentLat",currentLt);
				var currentLg = position.coords.longitude;
				Session.set("currentLng",currentLg);
			}
		}
		var currentLat = Session.get("currentLat");
		var currentLng = Session.get("currentLng");
		//**************************************************************
		//*******************To get Current Location********************
		//**************************************************************

		if(busList){
			for(var i = 0  ; i < busList.length ; i++){
				if(busList[i].businesscategories){
					for(var j = 0 ; j < busList[i].businesscategories.length; j++){
						if(busList[i].businesscategories[j]){
							var catArrayString = (busList[i].businesscategories[j]).split('>');
							if(catArrayString[1]){
								catArrayString[1] = catArrayString[1].trim();
							}
							listCategory.push(catArrayString[1]);
						}
					}
				}


				//**************************************************************
				//*******************Calculate distance From Location***********
				//**************************************************************
				var distance = getDistanceFromLatLonInKm(currentLat,currentLng,parseFloat(busList[i].businessLatitude),parseFloat(busList[i].businessLongitude));
				function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
					var R = 6371;
					var dLat = deg2rad(lat2-lat1);  // deg2rad below
					var dLon = deg2rad(lon2-lon1); 
					var a = 
							Math.sin(dLat/2) * Math.sin(dLat/2) +
							Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
							Math.sin(dLon/2) * Math.sin(dLon/2);

					var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
					var d = R * c; // Distance in km
					return d;
				}
				function deg2rad(deg) {
					return deg * (Math.PI/180)
				}
				busList[i].busDist = Number((distance).toFixed(1));
				//**************************************************************
				//*******************Calculate distance From Location***********
				//**************************************************************

				
			}

			for(var i =0 ; i<listCategory.length;i++){
				listCategory = jQuery.unique( listCategory );
			}

			// Filter out all 'falsy' values like {'', null, NaN}
			listCategory = listCategory.filter(Boolean);
			Session.set("searchLevelText",listCategory);
			

			if(busList.length>0){
				$('.busList').css('display','block');
				$('.didNotMatchQuery').css('display','none');
			}

		//*********************************************************************
		//***************************To Show And Hide Div**********************
		//*********************************************************************
		if(Session.get('searchQueryText')){
			$('.noSearchText').css('display','none');
			$('.busList').css('display','none');
			if(busList.length==0){
				$('.didNotMatchQuery').css('display','block');
			}else{
				$('.busList').css('display','block');
				$('.didNotMatchQuery').css('display','none');
			}			
		}else{
			$('.noSearchText').css('display','block');
			$('.didNotMatchQuery').css('display','none');
			$('.busList').css('display','none');
			if(busList.length!=0){
				$('.busList').css('display','block');
				$('.noSearchText').css('display','none');
			}
		}
		//*********************************************************************
		//***************************To Show And Hide Div**********************
		//*********************************************************************

		}

		return busList;

	},

	isGridViewVisible(){
		if(Session.get('showGridView')){
			return true;
		}
	},

	isMapViewVisible(){
		if(Session.get('showMapView')){
			return true;
		}
	},
});

Template.rightSidebarBusList.helpers({
	'gridVRightBusList': function(){
		var busList = businessSearchbanner1.getData();
		return busList;
	},
});


var filesM = [];

Template.allbusinessList.events({
	'click .listRelevance': function(){
		$('.busListSelectedPre').removeClass('busListSelected');
		$('.listRelevance').addClass('busListSelected');
		$('.thumBusOffers').css('display','none');
		$('.thumBusDistance').css('display','none');
		$('.busNoOffer').css('display','block');

	},
	'click .listOffers': function(){
		$('.busListSelectedPre').removeClass('busListSelected');
		$('.listOffers').addClass('busListSelected');
		$('.thumBusDistance').css('display','none');
		$('.thumBusOffers').css('display','block');
		$('.busNoOffer').css('display','none');
	},
	'click .listDistance': function(){
		$('.busListSelectedPre').removeClass('busListSelected');
		$('.listDistance').addClass('busListSelected');
		$('.thumBusOffers').css('display','none');
		$('.thumBusDistance').css('display','inline-block');
		$('.busNoOffer').css('display','block');

	},
	'click .sidebarMapPre': function(){
		$('.sidebarMapPre').css('display','none');
		
        $('.displayMapView').show();
		$('.displayMapView').addClass('col-lg-5');
		$('.displayGridView').removeClass('col-lg-8');
		$('.displayGridView').addClass('col-lg-5');
		$('.displayGridBus').hide();

		$('.gridViewBusList').hide();
		$('.mapViewBusList').show();
		$('.thumbBusList').addClass('scrollMapVwBus');
		$('.gridVwBus').removeClass('bkgOrange');
		$('.mapVwPointer').addClass('bkgOrange');

		Session.set('showMapView',true);
		Session.set('showGridView',false);


		setTimeout(function() {
        	if($('.listRelevance').hasClass('busListSelected')){
				$('.listRelevance').click();
			}
			if($('.listOffers').hasClass('busListSelected')){
				$('.listOffers').click();
			}
			if($('.listDistance').hasClass('busListSelected')){
				$('.listDistance').click();
			}
      	}, 1);

	},
	'change .enquiryPhotoAll' : function(event){
	    filesM = event.target.files; // FileList object
	     $('.showEnquiryImgAll').empty();
	    for (var i = 0, f; f = filesM[i]; i++) {
	        if (!f.type.match('image.*')) {
	          continue;
	      }
	      var reader = new FileReader();
	        reader.onload = (function(theFile) {
	          return function(e) {

	            var span = document.createElement('span');
	            span.innerHTML = ['<img class="draggedImgenq img-responsive" src="', e.target.result,
	                              '" title="', escape(theFile.name), '"/>'].join('');
	            document.getElementById('showEnquiryImgIdAll').insertBefore(span, null);
	          };
	        })(f); //end of onload
	        reader.readAsDataURL(f);
	    }// end of for loop
	  },
	'click .busListEnq':function(){
		var getUserRole = Meteor.userId();
		if(getUserRole){
			var userLogData = Meteor.users.findOne({"_id":getUserRole},{fields:{"roles":1}});
			if(userLogData.roles[0] == "Vendor" || userLogData.roles[0] == "admin"){
				Bert.alert('Please Log In as User','danger','growl-top-right');
			}
		}

		if($('.gridVwBus').hasClass('bkgOrange')){
			Session.set("sendEnqToAll","sendEnqToAll");
			Session.set("sendEnqToOne","");
		}
		if($('.mapVwPointer').hasClass('bkgOrange')){
			Session.set("sendEnqToAll","sendEnqToAll");
			Session.set("sendEnqToOne","");
		}
	},
	'click .thumbEnqBtn':function(event){
		var getUserRole = Meteor.userId();
		if(getUserRole){
			var userLogData = Meteor.users.findOne({"_id":getUserRole},{fields:{"roles":1}});
			if(userLogData.roles[0] == "Vendor" || userLogData.roles[0] == "admin"){
				Bert.alert('Please Log In as User','danger','growl-top-right');
			}
		}
		
		if($('.gridVwBus').hasClass('bkgOrange')){
			var title = $(event.currentTarget).siblings('.thumImgDesc').children(".enqHelper").children().attr('data-linkUrl');
			Session.set("sendEnqToAll","");
			Session.set("sendEnqToOne",title);
		}
		if($('.mapVwPointer').hasClass('bkgOrange')){
			var title = $(event.currentTarget).siblings('.enqHelper').children().attr('data-linkUrl');
			Session.set("sendEnqToAll","");
			Session.set("sendEnqToOne",title);
		}
	},
	

	'click .SendEnqToAll':function(event){
		event.preventDefault();
		// var getUserRole = Meteor.userId();
		// if(getUserRole){
		// 	var userLogData = Meteor.users.findOne({"_id":getUserRole},{fields:{"roles":1}});
		// 	console.log("userLogData: ",userLogData);
		// }else{

		// }
		var serched = [];
    	var enquiryPhoto = '';

		var enquirySentBy = Meteor.userId();
	    var enquiryName = $('.enquiryName').val();
	    var enquiryEmail = $('.enquiryEmail').val();
	    var enquiryPhone = $('.enquiryPhone').val();
	    var enquiryDesc = $('.enquiryDesc').val();

	    var enquiryPhoneTwo = '';
	    if(enquiryPhone){
	    	enquiryPhoneTwo = '+91' + enquiryPhone;
	    }

		if(enquirySentBy){
			var enqSendByid = Meteor.users.findOne({"_id":enquirySentBy}).roles[0];
			var str = enqSendByid.toLowerCase().replace(/\b[a-z]/g, function(letter) {
				return letter.toUpperCase();
			});
			var enqSendByRole = (str);
		}else{
			var enqSendByRole = "User";
		}
	   

		if(Session.get("sendEnqToAll")){
			$('.thumImgDescP').each(function() {
			    serched.push($(this).attr('data-linkUrl'));
			});
		}
		if(Session.get("sendEnqToOne")){
			serched.push(Session.get("sendEnqToOne"));
		}

		var errorIn = '';
        	if ($(".ErrorRedText").length > 0) {
            errorIn = "true";
        }

		if(errorIn!="true" && enquiryName && enquiryEmail && enquiryPhoneTwo && enquiryDesc) {
			if(filesM.length > 0){
		      for(i = 0 ; i < filesM.length; i++){
		          	EnquiryImgUploadS3.insert(filesM[i], function (err, fileObj) {
			            if(err){

			            }	else{
			              	enquiryPhoto = fileObj._id;
				            for(j=0;j<serched.length;j++){
								var id = serched[j];
								var businessid = Business.findOne({"businessLink":id});
								if(businessid){
							    	var formValues = {
						                "businessid"        : businessid._id,
						                "businessTitle"     : businessid.businessTitle,
						                "businessLink"		: businessid.businessLink,
						                "enquirySentBy"     : enquirySentBy,
						                "enquiryName"       : enquiryName,
						                "enquiryEmail"      : enquiryEmail,
						                "enquiryPhone"      : enquiryPhoneTwo,
						                "enquiryDesc"       : enquiryDesc,
						                "enquiryPhoto"      : enquiryPhoto,
						                "enquiryType"       : enqSendByRole,
						            }

									Meteor.call('insertBusEnquiry',formValues,function(err,result){
										if(err){
						                  	Bert.alert('There is some error in sending Enquiry','danger','growl-top-right');
						                  	return;
						                }

						                else if(result){
						                	$('#vEnqModal').modal( "hide" );
	                                    	$('#vEnqModal').modal({show: false});
						                	var newBusinessId = result;
						                  	Bert.alert('Vendor will soon get back you. Thank you.','success','growl-top-right');
											
											if(!Meteor.userId()){
												$('.enquiryName').val('');
												$('.enquiryEmail').val('');
												$('.enquiryPhone').val('');
												$('.enquiryDesc').val('');
												$('.enquiryPhotoAll').val('');
											}else{
												$('.enquiryDesc').val('');
												$('.enquiryPhotoAll').val('');
											}
											
									    	
									    	$('.showEnquiryImgAll>span').replaceWith( '<i class="fa fa-camera fa-5x" aria-hidden="true"></i>');

									    	//============================================================
		                                    //          Notification Email / SMS / InApp
		                                    //============================================================
		                                  	var enquiryOld 		= Enquiry.findOne({"_id":newBusinessId});
					                        if(enquiryOld){
												var businessidNew 	= Business.findOne({"businessLink":enquiryOld.businessLink});
												if(businessidNew){
													 	var userData    = Meteor.users.findOne({'roles':'admin'});
				                                        if(userData){
				                                        	//Send Notification, Mail and SMS to Vendor
				                                            var vendormailId    = businessidNew.businessOwnerId;
				                                            var vendorname      = businessidNew.ownerFullName;
				                                            var userId        	= Meteor.userId();
					                                        var userVar       	= Meteor.users.findOne({'_id':userId});

				                                            var userDetail =    Meteor.users.findOne({'_id':vendormailId});
				                                            if(userDetail&&userVar){
				                                                var msgvariable = {
				                                                    '[username]'            : vendorname,
				                                                    '[businessTitle]'       : businessidNew.businessTitle,
				                                                    '[enquiryName]'         : userDetail.profile.name,
				                                                    '[enquiryEmail]'        : enquiryEmail,
				                                                    '[enquiryPhoneTwo]'     : enquiryPhoneTwo,
				                                                    '[enquiryDesc]'         : enquiryDesc,

				                                                };

				                                                var inputObj = {
				                                                    notifPath    : businessidNew.businessLink,
				                                                    to           : vendormailId,
				                                                    templateName : 'Vendor Business Enquiry',
				                                                    variables    : msgvariable,
				                                                }
				                                                sendInAppNotification(inputObj); 

				                                                var inputObj = {
				                                                    notifPath    : businessidNew.businessLink,
				                                                    from         : userData._id,
				                                                    to           : vendormailId,
				                                                    templateName : 'Vendor Business Enquiry',
				                                                    variables    : msgvariable,
				                                                }
				                                                sendMailNotification(inputObj); 


																if(businessidNew.ownerMobile){
																	var msgvariable = {
																	'[username]'            : vendorname,
				                                                    '[businessTitle]'       : businessidNew.businessTitle,
				                                                    '[enquiryName]'         : userDetail.profile.name,
				                                                    '[enquiryEmail]'        : enquiryEmail,
				                                                    '[enquiryPhoneTwo]'     : enquiryPhoneTwo,
				                                                    '[enquiryDesc]'         : enquiryDesc,
				                                                    '[enquiryUserName]'     : userVar.profile.name,
													               	};

																	var inputObj = {
																	    to           : vendormailId,
																	    number       : businessidNew.ownerMobile,
																	    templateName : 'Vendor Business Enquiry',
																	    variables    : msgvariable,
																	}
																	sendSMS(inputObj);

																}


				                                                var inputObj = {
			                                                        to           : userDetail._id,
			                                                        templateName : 'Business Enquiry',
			                                                        number       : businessidNew.businessMobile,
			                                                        variables    : msgvariable,
			                                                    }
			                                                    // console.log('inputObj ', inputObj);
			                                                    sendSMS(inputObj); 
				                                            }


				                                        	
					                                        if(userVar){
				                                                var msgvariable = {
				                                                        '[businessTitle]'       : businessidNew.businessTitle,
				                                                        '[enquiryName]'         : userVar.profile.name,
				                                                        '[enquiryEmail]'        : enquiryEmail,
				                                                        '[enquiryPhoneTwo]'     : enquiryPhoneTwo,
				                                                        '[enquiryDesc]'         : enquiryDesc,

				                                                };

				                                                var inputObj = {
				                                                    from         : userData._id,
				                                                    to           : userId,
				                                                    templateName : 'User Business Enquiry',
				                                                    variables    : msgvariable,
				                                                }
				                                                sendMailNotification(inputObj); 
					                                        }
					                                    }
												}
											}
		                                   
		                                    //============================================================
		                                    //          Notification Email / SMS / InApp
		                                    //============================================================
								    	}
									});
								}
							}
			            }
		          });
		      	}

		      	filesM = '';

		    } 	else {
	          	enquiryPhoto = '';
	          	for(j=0;j<serched.length;j++){
					var id = serched[j];
					var businessid = Business.findOne({"businessLink":id});

					if(businessid){
				    	var formValues = {
			                "businessid"        : businessid._id,
			                "businessTitle"     : businessid.businessTitle,
			                "businessLink"		: businessid.businessLink,
			                "enquirySentBy"     : enquirySentBy,
			                "enquiryName"       : enquiryName,
			                "enquiryEmail"      : enquiryEmail,
			                "enquiryPhone"      : enquiryPhoneTwo,
			                "enquiryDesc"       : enquiryDesc,
			                "enquiryPhoto"      : enquiryPhoto,
			                "enquiryType"       : enqSendByRole,
			              }

						Meteor.call('insertBusEnquiry',formValues, function(err,result){
							if(err){
			                  	Bert.alert('There is some error in sending Enquiry','danger','growl-top-right');
			                  	return;
			                }else if(result){
			                	$('#vEnqModal').modal( "hide" );
	                            $('#vEnqModal').modal({show: false});
			                	var newBusinessId = result;
			                  	Bert.alert('Enquiry Sent successfully!','success','growl-top-right');
								// $('.enquiryName').val('');
							    // $('.enquiryEmail').val('');
							    // $('.enquiryPhone').val('');
								// $('.enquiryDesc').val('');
								if(!Meteor.userId()){
									$('.enquiryName').val('');
									$('.enquiryEmail').val('');
									$('.enquiryPhone').val('');
									$('.enquiryDesc').val('');
									// $('.enquiryPhotoAll').val('');
								}else{
									$('.enquiryDesc').val('');
									$('.enquiryPhotoAll').val('');
								}
								//============================================================
		                        //          Notification Email / SMS / InApp
		                        //============================================================
		                        var enquiryOld 		= Enquiry.findOne({"_id":newBusinessId});
		                        if(enquiryOld){
									var businessidNew 	= Business.findOne({"businessLink":enquiryOld.businessLink});
									if(businessidNew){
										var userData    = Meteor.users.findOne({'roles':'admin'});
			                            if(userData){

				                            //Send Notification, Mail and SMS to Vendor
			                                var vendormailId    = businessidNew.businessOwnerId;
			                                var vendorname      = businessidNew.ownerFullName;

			                                var userDetail =    Meteor.users.findOne({'_id':vendormailId});
			                                var userId        = Meteor.userId();
		                                    var userVar       = Meteor.users.findOne({'_id':userId});

			                                if(userDetail){
			                                    var msgvariable = {
			                                        '[username]'            : vendorname,
			                                        '[businessTitle]'       : businessidNew.businessTitle,
			                                        '[enquiryName]'         : userDetail.profile.name,
			                                        '[enquiryEmail]'        : enquiryEmail,
			                                        '[enquiryPhoneTwo]'     : enquiryPhoneTwo,
			                                        '[enquiryDesc]'         : enquiryDesc,

			                                    };

			                                    var inputObj = {
			                                        notifPath    : businessidNew.businessLink,
			                                        to           : vendormailId,
			                                        templateName : 'Vendor Business Enquiry',
			                                        variables    : msgvariable,
			                                    }

			                                    sendInAppNotification(inputObj); 

			                                    var inputObj = {
			                                        notifPath    : businessidNew.businessLink,
			                                        from         : userData._id,
			                                        to           : vendormailId,
			                                        templateName : 'Vendor Business Enquiry',
			                                        variables    : msgvariable,
			                                    }
			                                    sendMailNotification(inputObj); 
			                                }

			                                if(businessidNew.ownerMobile){
												var msgvariable = {
												'[username]'            : vendorname,
                                                '[businessTitle]'       : businessidNew.businessTitle,
                                                '[enquiryName]'         : userDetail.profile.name,
                                                '[enquiryEmail]'        : enquiryEmail,
                                                '[enquiryPhoneTwo]'     : enquiryPhoneTwo,
                                                '[enquiryDesc]'         : enquiryDesc,
				                                '[enquiryUserName]'     : userVar.profile.name,

								               	};
								               	
												var inputObj = {
												    to           : vendormailId,
												    number       : businessidNew.ownerMobile,
												    templateName : 'Vendor Business Enquiry',
												    variables    : msgvariable,
												}
												sendSMS(inputObj);
											}
				   
	                                        	
		                                        if(userVar){
	                                                var msgvariable = {
	                                                        '[businessTitle]'       : businessidNew.businessTitle,
	                                                        '[enquiryName]'         : userVar.profile.name,
	                                                        '[enquiryEmail]'        : enquiryEmail,
	                                                        '[enquiryPhoneTwo]'     : enquiryPhoneTwo,
	                                                        '[enquiryDesc]'         : enquiryDesc,

	                                                };

	                                                var inputObj = {
	                                                    from         : userData._id,
	                                                    to           : userId,
	                                                    templateName : 'User Business Enquiry',
	                                                    variables    : msgvariable,
	                                                }
	                                                sendMailNotification(inputObj); 
		                                        }
	                                        // }
			                            } 
									}
		                        }
		                        //============================================================
		                        //          Notification Email / SMS / InApp
		                        //============================================================
		    				}
						});
					}
				}
		    }
		}else{
			if (!enquiryName) {
                $(".spanEnqName").addClass("ErrorRedText");
                $(".enquiryName").addClass("SpanLandLineRedBorder");
                $(".spanEnqName").text("Please Enter Valid Name" );
            }
            if (!enquiryEmail) {
                $(".spanEnqEmail").addClass("ErrorRedText");
                $(".enquiryEmail").addClass("SpanLandLineRedBorder");
                $( ".spanEnqEmail" ).text("Please Enter Valid Business Email Id" );
            }
            if (!enquiryPhoneTwo) {
                $(".spanEnqPhone").addClass("ErrorRedText");
                $(".enquiryPhone").addClass("SpanLandLineRedBorder");
                $(".spanEnqPhone").text("Please Enter Valid 10 digit Mobile Number" );
            }
            if (!enquiryDesc) {
                $(".spanEnqDesc").addClass("ErrorRedText");
                $(".enquiryDesc").addClass("SpanLandLineRedBorder");
                $( ".spanEnqDesc" ).text("Please enter the description of the product you are looking for." );
            }
            $('.SpanLandLineRedBorder:visible:first').focus();
		}
	},
});

Template.businessList.events({
	'click .catListShowHide': function(event){
		$( ".listofType" ).toggleClass("listofTypeHide");
		if($('.listofType').hasClass('listofTypeHide')){
			$('.catListShowHide').text('Show Category List');
			$('.catListShowHide').addClass('listofTypeGreen').removeClass('listofTypeRed');
		} else {
			$('.catListShowHide').text('Hide Category List');
			$('.catListShowHide').removeClass('listofTypeGreen').addClass('listofTypeRed');
		}
	},
	"click .optionOfAreaG": function(event){
		var area = $(event.currentTarget).val();
		Session.set("userSelectedArea",area);	
		 // Set Area Cookie
    	var areaCookie = "getCurrentAreaName="+area;
    	document.cookie = areaCookie;
	},

	// Map View Click Events
	'click .mapVwPointer': function() {
		$('.displayMapView').show();
		$('.displayMapView').addClass('col-lg-5');
		$('.displayGridView').removeClass('col-lg-8');
		$('.displayGridView').addClass('col-lg-5');
		$('.displayGridBus').hide();

		$('.gridViewBusList').hide();
		$('.mapViewBusList').show();
		$('.thumbBusList').addClass('scrollMapVwBus');
		$('.gridVwBus').removeClass('bkgOrange');
		$('.mapVwPointer').addClass('bkgOrange');

		Session.set('showMapView',true);
		Session.set('showGridView',false);

		var searchText = FlowRouter.getParam('searchText');
		
		if(searchText){
			var flowGo = "/search/"+FlowRouter.getParam('city')+"/"+FlowRouter.getParam('area')+"/"+searchText;
			FlowRouter.go(flowGo);
		}else{
			var flowGo = "/search/"+FlowRouter.getParam('city')+"/"+FlowRouter.getParam('area');
			FlowRouter.go(flowGo);
		}

		


		setTimeout(function() {
        	if($('.listRelevance').hasClass('busListSelected')){
				$('.listRelevance').click();
			}
			if($('.listOffers').hasClass('busListSelected')){
				$('.listOffers').click();
			}
			if($('.listDistance').hasClass('busListSelected')){
				$('.listDistance').click();
			}
      	}, 1);

		
	},
	// Grid View Click Events
	'click .gridVwBus': function() {
		$('.sidebarMapPre').css('display','block');
		$('.displayMapView').hide();
		$('.displayGridView').addClass('col-lg-8');
		$('.displayGridView').removeClass('col-lg-5');
		$('.displayGridBus').show();
		$('.gridViewBusList').show();
		$('.mapViewBusList').hide();
		$('.thumbBusList').removeClass('scrollMapVwBus');
		$('.gridVwBus').addClass('bkgOrange');
		$('.mapVwPointer').removeClass('bkgOrange');
		Session.set('showMapView',false);
		Session.set('showGridView',true);

		var searchText = FlowRouter.getParam('searchText');

		if(searchText){
			var flowGo = "/search/"+FlowRouter.getParam('city')+"/"+FlowRouter.getParam('area')+"/"+searchText;
			FlowRouter.go(flowGo);
		}else{
			var flowGo = "/search/"+FlowRouter.getParam('city')+"/"+FlowRouter.getParam('area');
			FlowRouter.go(flowGo);
		}
		


		setTimeout(function() {
        	if($('.listRelevance').hasClass('busListSelected')){
				$('.listRelevance').click();
			}
			if($('.listOffers').hasClass('busListSelected')){
				$('.listOffers').click();
			}
			if($('.listDistance').hasClass('busListSelected')){
				$('.listDistance').click();
			}
      	}, 1);
	},
	'click .listofTypeSearch':function(event){
		var	area = $('#getArea').val();
		var userId = Meteor.userId();
		if(userId){
			var cityObject = Meteor.users.findOne({"_id":userId});
			if(cityObject.selectedCity){
				var currentCity = cityObject.selectedCity;
			}else {
				var currentCity = "Pune";
			}
		}else{
			var currentCity = FlowRouter.getParam('city');
		}
		
		var category = $(event.currentTarget).text();
		var searchText = currentCity + '|' + area + '|' + category;
		var path =  "/search/"+currentCity+"/"+area+"/"+category;
		FlowRouter.go(path);

		businessSearch1.search(searchText);
		businessSearchbanner1.search(searchText);
		// $('#gridSearchBusiness').val('');
		$('#gridSearchBusiness').val(category); 
		
	},

});

Template.thumbnailBusinessList.events({
	'click .thumbEnqBtn':function(event){
		event.preventDefault();
		var linkName = $(event.currentTarget).attr('data-link');
		$('.vEnqModalCShowTwo').hide();
		$('.vEnqModalCShowOne').show();
		$('.vEnqModalCShowOne').children().attr('data-link',linkName);
	},
	'click .enqRightDiv':function(event){
		var currentMarker = $(event.currentTarget).attr('cords-ids');
		$('.displayMapView').show();
		$('.displayMapView').addClass('col-lg-5');
		$('.displayGridView').removeClass('col-lg-8');
		$('.displayGridView').addClass('col-lg-5');
		$('.displayGridBus').hide();

		$('.gridViewBusList').hide();
		$('.mapViewBusList').show();
		$('.thumbBusList').addClass('scrollMapVwBus');
		$('.gridVwBus').removeClass('bkgOrange');
		$('.mapVwPointer').addClass('bkgOrange');

		Session.set('showMapView',true);
		Session.set('showGridView',false);

		setTimeout(function() {
        	if($('.listRelevance').hasClass('busListSelected')){
				$('.listRelevance').click();
			}
			if($('.listOffers').hasClass('busListSelected')){
				$('.listOffers').click();
			}
			if($('.listDistance').hasClass('busListSelected')){
				$('.listDistance').click();
			}
		  }, 1);
		  var searchText = FlowRouter.getParam('searchText');
		  if(!searchText){
			searchText = " ";
		  }
		  
		  var flowGo = "/searchMap/"+FlowRouter.getParam('city')+"/"+FlowRouter.getParam('area')+"/"+searchText+"/"+currentMarker;
		  FlowRouter.go(flowGo);

		  var data = Template.currentData(self.view);
		  Blaze.renderWithData(Template.businessMap, data, $(".mapContainer")[0]);
	}
});


businessListForm = function () {  
  BlazeLayout.render("anonymousUserLayout1",{main: 'businessList'});
  // Blaze.render(Template.businessList,document.body);
}

export { businessListForm };