import { Business } from '/imports/api/businessMaster.js';
import { Enquiry } from '/imports/api/enquiryMaster.js';
import { EnquiryImgUploadS3 } from '/client/enquiryImages.js';
import { BusinessImgUploadS3 } from '/client/businessImage.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../userLayout.js';
import './userEnquiry.html';
import './userEnquiryDetails.html';
import './userEnquiryPage.html';

Template.userEnquiryPage.onRendered(function(){
	Session.set("tabStatus","activeTab");
	Session.set('userSort','All');
	Session.set('userSortTitle','Active');

});

Template.userEnquiry.onRendered(function(){
	Session.set("EnqIDSes",'');
	$('#deleteSelected').hide();
	$('#restoreArchive').hide();
});

Template.userEnquiryPage.helpers({
	checkEnquirykLoading(count){
		if(count<=0){
			return true;
		}else{
			return false;
		}
	},
	userEnquiryActiveData: function () {
		var currentUser = Meteor.userId();

		if(currentUser){
			var tabStatusVar = Session.get("tabStatus");
			if(tabStatusVar == "archiveTab"){
				
				var enqList = Enquiry.find({"enquirySentBy":currentUser,"userArchive":"archived"},{sort: {enquiryCreatedAt:-1}}).fetch();
				if(enqList){
					if(Session.get("nameKeyUser")){
						var nameKey = (Session.get("nameKeyUser")).toUpperCase();

						var newobj = [];
						for(i=0;i<enqList.length;i++){
							var searchTextString = false;
							for(j=0;j<enqList[i].enquiryDesc.length;j++){
								if((enqList[i].enquiryDesc[j].comment.toUpperCase()).indexOf(nameKey) != -1){
									searchTextString = true;
								}
							}
					        if ((enqList[i].businessTitle.toUpperCase()).indexOf(nameKey) != -1 || searchTextString) {
					        	enqList[i].enquiryCreatedAt = moment(enqList[i].enquiryCreatedAt).fromNow();
					        	var businessLink = enqList[i].businessLink;
								var userObj = Business.findOne({"businessLink":businessLink});
								if (userObj){
									if(userObj.businessImages){
										if(userObj.businessImages.length>0){
											var pic = BusinessImgUploadS3.findOne({"_id":userObj.businessImages[0].img});
											if(pic){
												enqList[i].userProfilePic = pic.url();	
											}
											else{
												enqList[i].userProfilePic = "/images/rightnxt_image_nocontent.jpg";	
											}
										}else{
											enqList[i].userProfilePic = "/images/rightnxt_image_nocontent.jpg";	
										}
									}else{
										enqList[i].userProfilePic = "/images/rightnxt_image_nocontent.jpg";
									}
								}
					        	newobj.push(enqList[i]);
					        } 
						}
						return newobj;

					}else{
						for(i=0;i<enqList.length;i++){
							enqList[i].enquiryCreatedAt = moment(enqList[i].enquiryCreatedAt).fromNow();

							var businessLink = enqList[i].businessLink;
							var userObj = Business.findOne({"businessLink":businessLink});
							if (userObj){
								if(userObj.businessImages){
									if(userObj.businessImages.length>0){
										var pic = BusinessImgUploadS3.findOne({"_id":userObj.businessImages[0].img});
										if(pic){
											enqList[i].userProfilePic = pic.url();	
										}
										else{
											enqList[i].userProfilePic = "/images/rightnxt_image_nocontent.jpg";	
										}
									}else{
										enqList[i].userProfilePic = "/images/rightnxt_image_nocontent.jpg";	
									}
								}else{
									enqList[i].userProfilePic = "/images/rightnxt_image_nocontent.jpg";
								}
							}
						}
						return enqList;
					}
				}
			}
			else if(tabStatusVar == "flagTab"){
				var enqList = Enquiry.find({"enquirySentBy":currentUser,"userSpecialFlag":"flag"},{sort: {enquiryCreatedAt:-1}}).fetch();
				if(enqList){
					if(Session.get("nameKeyUser")){
						var nameKey = (Session.get("nameKeyUser")).toUpperCase();

						var newobj = [];
						for(i=0;i<enqList.length;i++){
							var searchTextString = false;
							for(j=0;j<enqList[i].enquiryDesc.length;j++){
								if((enqList[i].enquiryDesc[j].comment.toUpperCase()).indexOf(nameKey) != -1){
									searchTextString = true;
								}
							}
					        if ((enqList[i].businessTitle.toUpperCase()).indexOf(nameKey) != -1 || searchTextString) {
					        	enqList[i].enquiryCreatedAt = moment(enqList[i].enquiryCreatedAt).fromNow();
					        	var businessLink = enqList[i].businessLink;
								var userObj = Business.findOne({"businessLink":businessLink});
								if (userObj){
									if(userObj.businessImages){
										if(userObj.businessImages.length>0){
											var pic = BusinessImgUploadS3.findOne({"_id":userObj.businessImages[0].img});
											if(pic){
												enqList[i].userProfilePic = pic.url();	
											}
											else{
												enqList[i].userProfilePic = "/images/rightnxt_image_nocontent.jpg";	
											}
										}else{
											enqList[i].userProfilePic = "/images/rightnxt_image_nocontent.jpg";	
										}
									}else{
										enqList[i].userProfilePic = "/images/rightnxt_image_nocontent.jpg";
									}
								}
					        	newobj.push(enqList[i]);
					        } 
						}
						return newobj;

					}else{
						for(i=0;i<enqList.length;i++){
							enqList[i].enquiryCreatedAt = moment(enqList[i].enquiryCreatedAt).fromNow();

							var businessLink = enqList[i].businessLink;
							var userObj = Business.findOne({"businessLink":businessLink});
							if (userObj){
								if(userObj.businessImages){
									if(userObj.businessImages.length>0){
										var pic = BusinessImgUploadS3.findOne({"_id":userObj.businessImages[0].img});
										if(pic){
											enqList[i].userProfilePic = pic.url();	
										}
										else{
											enqList[i].userProfilePic = "/images/rightnxt_image_nocontent.jpg";	
										}
									}else{
										enqList[i].userProfilePic = "/images/rightnxt_image_nocontent.jpg";	
									}
								}else{
									enqList[i].userProfilePic = "/images/rightnxt_image_nocontent.jpg";
								}
							}
						}
						return enqList;
					}

					
				}
			}else if(tabStatusVar == "activeTab"){
				var enqList = Enquiry.find({"enquirySentBy":currentUser,"userArchive":"noArchived"},{sort: {enquiryCreatedAt:-1}}).fetch();
				if(enqList){
					if(Session.get("nameKeyUser")){
						var nameKey = (Session.get("nameKeyUser")).toUpperCase();

						var newobj = [];
						for(i=0;i<enqList.length;i++){
							var searchTextString = false;
							for(j=0;j<enqList[i].enquiryDesc.length;j++){
								if((enqList[i].enquiryDesc[j].comment.toUpperCase()).indexOf(nameKey) != -1){
									searchTextString = true;
								}
							}
					        if ((enqList[i].businessTitle.toUpperCase()).indexOf(nameKey) != -1 || searchTextString) {
					        	enqList[i].enquiryCreatedAt = moment(enqList[i].enquiryCreatedAt).fromNow();
					        	var businessLink = enqList[i].businessLink;
								var userObj = Business.findOne({"businessLink":businessLink});
								if (userObj){
									if(userObj.businessImages){
										if(userObj.businessImages.length>0){
											var pic = BusinessImgUploadS3.findOne({"_id":userObj.businessImages[0].img});
											if(pic){
												enqList[i].userProfilePic = pic.url();	
											}
											else{
												enqList[i].userProfilePic = "/images/rightnxt_image_nocontent.jpg";	
											}
										}else{
											enqList[i].userProfilePic = "/images/rightnxt_image_nocontent.jpg";	
										}
									}else{
										enqList[i].userProfilePic = "/images/rightnxt_image_nocontent.jpg";
									}
								}
					        	newobj.push(enqList[i]);
					        } 
						}
						return newobj;

					}else{
						for(i=0;i<enqList.length;i++){
							enqList[i].enquiryCreatedAt = moment(enqList[i].enquiryCreatedAt).fromNow();

							var businessLink = enqList[i].businessLink;
							var userObj = Business.findOne({"businessLink":businessLink});
							if (userObj){
								if(userObj.businessImages){
									if(userObj.businessImages.length>0){
										var pic = BusinessImgUploadS3.findOne({"_id":userObj.businessImages[0].img});
										if(pic){
											enqList[i].userProfilePic = pic.url();	
										}
										else{
											enqList[i].userProfilePic = "/images/rightnxt_image_nocontent.jpg";	
										}
									}else{
										enqList[i].userProfilePic = "/images/rightnxt_image_nocontent.jpg";	
									}
								}else{
									enqList[i].userProfilePic = "/images/rightnxt_image_nocontent.jpg";
								}
							}
						}
						return enqList;	
					}

					
					
				}
			}
		}
	},
	userEnquiryDetailsData: function(){
		var currentUser = Meteor.userId();

		if(Session.get("EnqIDSes")){
			id = Session.get("EnqIDSes");
		}else{
			id = '';
		}
		var enqData = Enquiry.findOne({"enquirySentBy":currentUser,'_id':id});
		if(enqData){
			if(enqData.enquiryDesc){
				for(i=0; i<enqData.enquiryDesc.length; i++){
					if(enqData.enquiryDesc[i].commentImage != ''){
						enqData.enquiryDesc[i].enquiryPhoto = EnquiryImgUploadS3.findOne({"_id":enqData.enquiryDesc[i].commentImage}).url();
						enqData.enquiryDesc[i].enquiryImgVal = true;
					}else{
						enqData.enquiryDesc[i].enquiryImgVal = false;
					}

					if(enqData.enquiryDesc[i].commentBy == 'User'){
						enqData.enquiryDesc[i].posClass = "pull-right";
						enqData.enquiryDesc[i].posClassTringl = "vEnqTriangleRight";
					}else{
						enqData.enquiryDesc[i].posClass = "pull-left";
						enqData.enquiryDesc[i].posClassTringl = "vEnqTriangleleft";
					}
				}

			}
			var businessLink = enqData.businessLink;
			var busObj = Business.findOne({"businessLink":businessLink,"status": "active"});
			if(busObj) {
				if(busObj.businessMobile){
					enqData.enquiryPhone = busObj.businessMobile;
				}else{
					enqData.enquiryPhone = busObj.businessLandline;
				}
				enqData.enquiryEmail = busObj.businessEmailId;
			}
			return enqData;			
		}
		
	},
	userEnquirySortBy: function(){
		var userSort = Session.get('userSort');
		var userSortTitle = Session.get('userSortTitle');

		var data = {
			userSort 		: userSort,
			userSortTitle	: userSortTitle,	
		}
		return data;
	},
	userEnquiryCount: function(){
		var currentUser = Meteor.userId();
		var enqCount = Enquiry.find({"enquirySentBy":currentUser}).count();


		var data = {
			userEnqcount : enqCount,	
		}
		return data;
	},
});

Template.userEnquiry.events({
	// Read, Unread enquiry: done
	'click .readEnClass':function(event){
		var thisrow = event.currentTarget;
		var id = $(thisrow).parent().attr('id');
		Session.set("EnqIDSes",id);

		$('.vEnqRowTwo').removeClass('selectedEnq');

		$("#"+id).addClass('selectedEnqRead');
		$("#"+id).addClass('selectedEnq');

		Meteor.call('updateEnquiryForUserRead',id,'read',function(err,rslt){});
	},
	
	// Flag, Unflag and Delete Enquiry Events: done
	'click .flagEnquiry':function(event){
		var thisFlag = event.currentTarget;
		id = $(thisFlag).parent().parent().attr('id');
		Meteor.call('updateEnquiryForUserFlag',id,'noflag',function(err,rslt){});
	},
	'click .noflagEnquiry':function(event){
		var thisFlag = event.currentTarget;
		id = $(thisFlag).parent().parent().attr('id');
		Meteor.call('updateEnquiryForUserFlag',id,'flag',function(err,rslt){});
	},
	'click .deleteEnqBtn': function(event){
		var thisid = event.currentTarget;
		var id = $(thisid).parent().parent().parent().parent().parent().parent().parent().attr('id');
		Meteor.call('deleteUserEnquiry',id ,function(err,rslt){
		});	
		$('.modal-backdrop').hide();
	},

	// Hover over the Enquiry and change color to gray on mouseover and mouseleave: done
	'mouseover .readEnClass':function(event){
		var thisid = event.currentTarget;
		var id = $(thisid).parent().attr('id');
		var applyClass = "#"+id ;
		$(applyClass).children().css('background','#ccc');
	},
	'mouseleave .readEnClass':function(event){
		var thisid = event.currentTarget;
		var id = $(thisid).parent().attr('id');
		var applyClass = "#"+id ;
		$(applyClass).children().css('background','');
	},	
});



var filesM = [];

Template.userEnquiryPage.events({
	
	"keyup .userEnquiryFormSearch": _.throttle(function(e) {
	    var text = $(e.target).val().trim();
	    Session.set("nameKeyUser",text);
	    if(text==''){
	    	Session.set("nameKeyUser",'');
	    }
	    
	  }, 200),
	// Sending Enquiry image in same chatbox
	'click .vEnqsndEnqBtn': function(event) {
		$('.vEnqFormImgOne').animate({ scrollTop: $(document).height() }, 1);
		
		var enquiryPhoto = '';
		var enquiryCommentNew = $('.vEnqFormTextarea').val();
       	var id = event.currentTarget.id;
       	var enquirySentBy = $(event.currentTarget).attr("data-enquirySentBy");
       	var businessLink = $(event.currentTarget).attr("data-businessLink");

       	if(filesM.length > 0){
			for(i = 0 ; i < filesM.length; i++){
			    EnquiryImgUploadS3.insert(filesM[i], function (err, fileObj) {
		        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
		            if(err){
		              	console.log('Error : ' + err.message);
		            }else{
		              	enquiryPhoto = fileObj._id;

					  	var formValues ={
								        	"id" 				: id,
								        	"enquiryCommentNew" : enquiryCommentNew,
								        	"enquiryPhoto" 		: enquiryPhoto,
									   	}

						// if(formValues.enquiryCommentNew){
							Meteor.call('insertEnqCommentUser',formValues,function(error,result){
					      		$('.vEnqFormTextarea').val('');
					        	$('#showEnquiryImgIdC>span').hide();
					        	enquiryPhoto = '';

						        	//============================================================
									// 			Notification Email / SMS / InApp
									//============================================================
									var admin = Meteor.users.findOne({'roles':'admin'});
								    if(admin){
								    	var adminId = admin._id;
								    }
									var businessData = Business.findOne({"businessLink":businessLink});

									if(businessData){
										var vendorId = businessData.businessOwnerId;
				        				var vendorDetail = Meteor.users.findOne({'_id':vendorId});

				          	  			var userId = Meteor.userId();
				        				var userDetail = Meteor.users.findOne({'_id':userId});
				        				
				        				if(vendorDetail&&userDetail){

				        					//Send Notification, Mail and SMS to Vendor
				        					var vendorname 	= vendorDetail.profile.name;
				        					var username 	= userDetail.profile.name;
					                		var date 		= new Date();
					                		var currentDate = moment(date).format('DD/MM/YYYY');
					                		var msgvariable = {
												'[vendorname]' 	: vendorname,
												'[username]' 	: username,
							   					'[currentDate]'	: currentDate,
				   								'[businessName]': businessData.businessTitle
							               	};

											var inputObj = {
												notifPath	 : businessLink,
											    to           : vendorId,
											    templateName : 'Vendor Enquiry Message',
											    variables    : msgvariable,
											}
											sendInAppNotification(inputObj);

											var inputObj = {
												notifPath	 : businessLink,
												from         : adminId,
												to           : vendorId,
												templateName : 'Vendor Enquiry Message',
												variables    : msgvariable,
											}
											sendMailNotification(inputObj);
											 
				        				}
									}
									//============================================================
									// 			End Notification Email / SMS / InApp
									//============================================================


					      	});
						// }
			         	

		            }
		        });
		    }
		    filesM = '';

       	}else{
			var formValues = {
						        	"id" 				: id,
						        	"enquiryCommentNew" : enquiryCommentNew,
						        	"enquiryPhoto" 		: '',
							   }
			if(formValues.enquiryCommentNew){
				Meteor.call('insertEnqCommentUser',formValues,function(error,result){
			      	$('.vEnqFormTextarea').val('');
					
					//============================================================
					// 			Notification Email / SMS / InApp
					//============================================================
					var admin = Meteor.users.findOne({'roles':'admin'});
				    if(admin){
				    	var adminId = admin._id;
				    }
					var businessData = Business.findOne({"businessLink":businessLink});

					if(businessData){
						var vendorId = businessData.businessOwnerId;
        				var vendorDetail = Meteor.users.findOne({'_id':vendorId});

          	  			var userId = Meteor.userId();
        				var userDetail = Meteor.users.findOne({'_id':userId});

        				if(vendorDetail&&userDetail){

        					//Send Notification, Mail and SMS to Vendor
        					var vendorname 	= vendorDetail.profile.name;
        					var username 	= userDetail.profile.name;
	                		var date 		= new Date();
	                		var currentDate = moment(date).format('DD/MM/YYYY');
	                		var msgvariable = {
								'[vendorname]' 	: vendorname,
								'[username]' 	: username,
			   					'[currentDate]'	: currentDate,
   								'[businessName]': businessData.businessTitle
			               	};

							var inputObj = {
								notifPath	 : businessLink,
								to           : vendorId,
								templateName : 'Vendor Enquiry Message',
								variables    : msgvariable,
							}
							sendInAppNotification(inputObj);

							var inputObj = {
								notifPath	 : businessLink,
								from         : adminId,
								to           : vendorId,
								templateName : 'Vendor Enquiry Message',
								variables    : msgvariable,
							}
							sendMailNotification(inputObj);
							 
        				}
					}
					//============================================================
					// 			End Notification Email / SMS / InApp
					//============================================================

				});
			}
		    
		}
    },

	'change .vEnqupload' : function(event){
    	filesM = event.target.files; 
    	// Loop through the FileList and render image files as thumbnails.
    
	    for (var i = 0, f; f = filesM[i]; i++) {
	        // Only process image files.
	        if (!f.type.match('image.*')) {
	          continue;
	      	}

	      	var reader = new FileReader();
	      
	      	// Closure to capture the file information.
        	reader.onload = (function(theFile) {
          		return function(e) {
            	// Render thumbnail.

            	var span = document.createElement('span');

            	span.innerHTML = ['<img class="draggedImgenq img-responsive" src="', e.target.result,
                              '" title="', escape(theFile.name), '"/>'].join('');
            	document.getElementById('showEnquiryImgIdC').insertBefore(span, null);
            
          		};
        	})(f); 
	        // Read in the image file as a data URL.
	        reader.readAsDataURL(f);
	    }
  	},

	//Mark with Flag and Move to Archive Options: done
	'click #markWithFlag': function(event){
		Session.set("EnqIDSes",'');
		var selected = [];
		$('.EnqListCheckboxAll:input:checked').each(function() {
		    selected.push($(this).attr('id'));
		});
		for(i=0;i<selected.length;i++){
			var id = selected[i];
			Meteor.call('updateEnquiryForUserFlag',id,'flag',function(err,rslt){});
		}
		 $(".commonCheckbox").prop('checked', false);
	},
	'click #moveToArchive': function(event){
		Session.set("EnqIDSes",'');
		var selected = [];
		$('.EnqListCheckboxAll:input:checked').each(function() {
		    selected.push($(this).attr('id'));
		});
		for(i=0;i<selected.length;i++){
			var id = selected[i];
			Meteor.call('updateEnquiryForUserArchive',id,'archived',function(err,rslt){});
		}
		for(i=0;i<selected.length;i++){
			var id = selected[i];
			Meteor.call('updateEnquiryForUserFlag',id,'noflag',function(err,rslt){});
		}
		 $(".commonCheckbox").prop('checked', false);
	},

	//Active Flag and Archive Options: done
	'click #activeList': function(event){
		$(event.currentTarget).parent().children().removeClass('active');
		$(event.currentTarget).addClass('active');
		$('.tab-pane').attr('id','vEnqActive');
		Session.set("EnqIDSes",'');
		$(".commonCheckbox").prop('checked', false);

		var userSortTitle = $(event.currentTarget).children('.activeSelC').text();
		Session.set('userSortTitle',userSortTitle);

		Session.set("tabStatus","activeTab");
		$('#deleteSelected').hide();
		$('#restoreArchive').hide();
		$('#moveToArchive').show();
		$('#markWithFlag').show();
		$('.vEnqSpan>span').css('opacity','1');
		$(".commonCheckbox").prop('checked', false);
		$(".vEnqActiveDiv").removeClass('vEnqSpanShow');
	},
	'click #flagList': function(event){
		$(event.currentTarget).parent().children().removeClass('active');
		$(event.currentTarget).addClass('active');	Session.set("EnqIDSes",'');
		$('.tab-pane').attr('id','vEnqFlag');
		Session.set("EnqIDSes",'');

		var userSortTitle = $(event.currentTarget).children('.flagSelC').text();
		Session.set('userSortTitle',userSortTitle);

		$('.vEnqSpan>span').css('opacity','1');
		$(".commonCheckbox").prop('checked', false);
		$('#markWithFlag').hide();
		
		Session.set("tabStatus","flagTab");
		$(".vEnqActiveDiv").removeClass('vEnqSpanShow');
	},
	'click #archiveList': function(event){
		setTimeout(function() {
	        Session.set("EnqIDSes",'');
			$(".commonCheckbox").prop('checked', false);

			Session.set("tabStatus","archiveTab");

			$('.vEnqRowTwo').show();
			$('.restoreArchivei').show();
			$('#deleteSelected').css('display','inline');
			$('#restoreArchive').css('display','inline');
			$('.vEnqSpan>span').css('opacity','0');
			$('#moveToArchive').hide();
			$('#markWithFlag').hide();
			$(".commonCheckbox").prop('checked', false);
			$(".vEnqActiveDiv").removeClass('vEnqSpanShow');
		
	    }, 1);
	},

	//Move form Archive to Active
	'click .restoreArchiveii': function(event){
		var thisid = event.currentTarget;
		var id = $(thisid).parent().parent().attr('id');

		Meteor.call('updateEnquiryForUserArchive',id,'noArchived',function(err,rslt){
			$(".commonCheckbox").prop('checked', false);
		});
	},

	//Move marked in Archieved to Active OR Archieved to Delete
	'click #restoreArchive': function(event){
		Session.set("EnqIDSes",'');
		var selected = [];
		$('.EnqListCheckboxAll:input:checked').each(function() {
		    selected.push($(this).attr('id'));
		});
		for(i=0;i<selected.length;i++){
			var id = selected[i];
			Meteor.call('updateEnquiryForUserArchive',id,'noArchived',function(err,rslt){});
		}
		 $(".commonCheckbox").prop('checked', false);
	},
	'click #deleteSelected': function(event){
		Session.set("EnqIDSes",'');
		var selected = [];
		$('.EnqListCheckboxAll:input:checked').each(function() {
		    selected.push($(this).parent().parent().attr('id'));
		});
		for(i=0;i<selected.length;i++){
			var id = selected[i];
			Meteor.call('deleteUserEnquiry',id ,function(err,rslt){});	
		}
		$(".commonCheckbox").prop('checked', false);
		$('.modal-backdrop').hide();
	},

	//All, Read, Unread Options of Active and Flagged Menus: done
	'click .ADAll': function(){
		Session.set("EnqIDSes",'');
		var vSort = $(event.target).text();
		Session.set('userSort',vSort);

		$(".commonCheckbox").prop('checked', false);
		$('.vEnqRowTwo').show();
	},
	'click .ADRead': function(){
		Session.set("EnqIDSes",'');
		var vSort = $(event.target).text();
		Session.set('userSort',vSort);

		$(".commonCheckbox").prop('checked', false);
		$('.vEnqRowTwo').hide();
		$('.readEnq').show();
	},
	'click .ADUnread': function(){
		Session.set("EnqIDSes",'');
		var vSort = $(event.target).text();
		Session.set('userSort',vSort);

		$(".commonCheckbox").prop('checked', false);
		$('.vEnqRowTwo').hide();
		$('.unreadEnq').show();
	},
	'click .ADFAll': function(){
		Session.set("EnqIDSes",'');
		var vSort = $(event.target).text();
		Session.set('userSort',vSort);

		$(".commonCheckbox").prop('checked', false);
		$('.vEnqRowTwo').show();
	},
	'click .ADFRead': function(){
		Session.set("EnqIDSes",'');
		var vSort = $(event.target).text();
		Session.set('userSort',vSort);

		$(".commonCheckbox").prop('checked', false);
		$('.vEnqRowTwo').hide();
		$('.readEnq').show();
	},
	'click .ADFUnread': function(){
		Session.set("EnqIDSes",'');
		var vSort = $(event.target).text();
		Session.set('userSort',vSort);

		$(".commonCheckbox").prop('checked', false);
		$('.vEnqRowTwo').hide();
		$('.unreadEnq').show();
	},

	'click .activeDownListPre': function(event){
    	event.preventDefault();
    	// console.log('drop list');
    	event.stopPropagation();
		$('.activeDownList').toggleClass('activeDownListBlock');
		$('.activeDownListFlag').removeClass('activeDownListBlockFlag');
		$('.activeDownList').toggle();

		// $('.activeDownList').attr('style', 'display:block !important');
		// $('.activeDownList').css('display','block !important');
	},

	'click .activeDownListFlagPre': function(event){
		event.preventDefault();
    	event.stopPropagation();
		$('.activeDownListFlag').toggleClass('activeDownListBlockFlag');
		$('.activeDownList').removeClass('activeDownListBlock');
		$('.activeDownListFlag').toggle();
		
	},
	'click .activeEnquiryTabsPre': function(event){
		event.preventDefault();
		
		$('.activeDownListFlag').removeClass('activeDownListBlockFlag');
		$('.activeDownList').removeClass('activeDownListBlock');
	},

	'click .EnqListCheckbox':function(event){
		// To select all checkboxes when click on checked all
		$(".EnqListCheckboxAll").prop('checked', $('.EnqListCheckbox').prop("checked"));
	},
	'click .commonCheckbox': function(event){
		// To select and unselect all checkboxes when click on checked all
		var currentUser = Meteor.userId();
		var enqListCount = Enquiry.find({"enquirySentBy":currentUser,"userArchive":"noArchived"}).count();
		var getChecked = false;
		
		$(".vEnqListBorder").find(".commonCheckbox").each(function(){
			if ($(this).prop('checked')==true){ 
				getChecked = true;
			}
		});

		if(enqListCount>0 && getChecked){
			$(".vEnqActiveDiv").addClass('vEnqSpanShow');
			if($('.activeDownListPre').hasClass('active')){
				$('#moveToArchive').css('display','inline');
				$('#markWithFlag').css('display','inline');
			} else if($('.activeDownListFlagPre').hasClass('active')){
				$('#deleteSelected').css('display','inline');
				$('#moveToArchive').css('display','inline');
			} else if($('.activeEnquiryTabsPre').hasClass('active')){
				$('#restoreArchive').css('display','inline');
				$('#deleteSelected').css('display','inline');
			}
		}else{
			$(".vEnqActiveDiv").removeClass('vEnqSpanShow');
		}		
	},
	'click .EnqListCheckboxAll':function(){
		 $(".EnqListCheckbox").prop('checked', false); 
	},
	
});
userEnquiryPageForm = function () {  
  BlazeLayout.render("userLayout",{content: 'userEnquiryPage'});
  // Blaze.render(Template.userLayout,document.body);
}
export { userEnquiryPageForm }