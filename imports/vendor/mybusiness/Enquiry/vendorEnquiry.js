import { Business } from '/imports/api/businessMaster.js';
import { Enquiry } from '/imports/api/enquiryMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { EnquiryImage } from '/imports/videoUploadClient/enquiryImageClient.js';
import ImageCompressor from 'image-compressor.js';
import { VendorImage } from '/imports/videoUploadClient/vendorImageClient.js';

import '../../vendor.js';
import './allEnquries.html';
import './enquiryDetails.html';
import './vendorEnquiry.html';

// Template.enquiryDetails.events({
// 	'click .vEnqsndEnqBtn':function(event){
// 		var elem = $(e.currentTarget).attr('.vEnqFormImgOne');
// 	    if (elem[0].scrollHeight - elem.scrollTop() == elem.outerHeight())
// 	    {
// 	        console.log("bottom");
// 	    }
// 	}
// });

// Template.vendorEnquiry.onCreated(function() {
//   // this.currentUpload = new ReactiveVar(false);
//   this.subscribe('businessEnquiryImage');
// });

// Template.vendorEnquiry.onCreated(function(){
//   this.subscribe('vendorImage');
// });
Template.vendorEnquiry.helpers({
	// Enquiry enquiryImages
	vendorEnquiryBusName:function(){
		var businessLink = FlowRouter.getParam('businessLink');
		var data = Business.findOne({"businessLink":businessLink,"status": "active"});
		return data;
	},
	vendorEnquiryActiveData:function () {
		var businessLink = FlowRouter.getParam('businessLink');
		var businessObj = Business.findOne({"businessLink":businessLink,"status": "active"});

		if(businessObj){
			var blockedUserArray = businessObj.blockedUsers;
			var tabStatusVar = Session.get("tabStatus");
			if(tabStatusVar == "archiveTab"){
				var data = Enquiry.find({"businessid":businessObj._id,"vendorArchive":"archived","enquirySentBy": { $nin: blockedUserArray }},{sort: {enquiryCreatedAt:-1}}).fetch();	
				
				if(data){
					if(Session.get("nameKey")){
						var nameKey = (Session.get("nameKey")).toUpperCase();

						var newobj = [];
						for(i=0;i<data.length;i++){
							var searchTextString = false;
							for(j=0;j<data[i].enquiryDesc.length;j++){
								if((data[i].enquiryDesc[j].comment.toUpperCase()).indexOf(nameKey) != -1){
									searchTextString = true;
								}
							}
					        if ((data[i].enquiryName.toUpperCase()).indexOf(nameKey) != -1 || searchTextString) {
					        	data[i].enquiryCreatedAt = moment(data[i].enquiryCreatedAt).fromNow();
					        	var userId = data[i].enquirySentBy;
								var userObj = Meteor.users.findOne({"_id":userId});
								if (userObj){
									if(userObj.profile.userProfilePic){
										var pic = VendorImage.findOne({"_id":userObj.profile.userProfilePic});
										if(pic){
											data[i].userProfilePic = pic.link();	
										}
										else{
											data[i].userProfilePic = "/users/profile/profile_image_dummy.svg";	
										}
									}else{
										data[i].userProfilePic = "/users/profile/profile_image_dummy.svg";
									}
								}
					        	newobj.push(data[i]);
					        } 
						}
						return newobj;

					}else{
						for(i=0;i<data.length;i++){
							data[i].enquiryCreatedAt = moment(data[i].enquiryCreatedAt).fromNow();
							var userId = data[i].enquirySentBy;
							var userObj = Meteor.users.findOne({"_id":userId});
							if (userObj){
								if(userObj.profile.userProfilePic){
									var pic = VendorImage.findOne({"_id":userObj.profile.userProfilePic});
									if(pic){
										data[i].userProfilePic = pic.link();	
									}
									else{
										data[i].userProfilePic = "/users/profile/profile_image_dummy.svg";	
									}
								}else{
									data[i].userProfilePic = "/users/profile/profile_image_dummy.svg";
								}
							}
						}
						return data;
					}
					
				}else{
					var data = "No Archive Data Available";
					console.log('data :',data);
					return data;
				}
			}else if(tabStatusVar == "flagTab"){
				var blockedUserArray = businessObj.blockedUsers;
				var data = Enquiry.find({"businessid":businessObj._id,"vendorSpecialFlag":"flag","enquirySentBy": { $nin: blockedUserArray }},{sort: {enquiryCreatedAt:-1}}).fetch();	

				
				if(data){
					if(Session.get("nameKey")){
						var nameKey = (Session.get("nameKey")).toUpperCase();

						var newobj = [];
						for(i=0;i<data.length;i++){
							var searchTextString = false;
							for(j=0;j<data[i].enquiryDesc.length;j++){
								if((data[i].enquiryDesc[j].comment.toUpperCase()).indexOf(nameKey) != -1){
									searchTextString = true;
								}
							}
					        if ((data[i].enquiryName.toUpperCase()).indexOf(nameKey) != -1 || searchTextString) {
					        	data[i].enquiryCreatedAt = moment(data[i].enquiryCreatedAt).fromNow();
					        	var userId = data[i].enquirySentBy;
								var userObj = Meteor.users.findOne({"_id":userId});
								if (userObj){
									if(userObj.profile.userProfilePic){
										var pic = VendorImage.findOne({"_id":userObj.profile.userProfilePic});
										if(pic){
											data[i].userProfilePic = pic.link();	
										}
										else{
											data[i].userProfilePic = "/users/profile/profile_image_dummy.svg";	
										}
									}else{
										data[i].userProfilePic = "/users/profile/profile_image_dummy.svg";
									}
								}
					        	newobj.push(data[i]);
					        } 
						}
						return newobj;

					}else{
						for(i=0;i<data.length;i++){
							data[i].enquiryCreatedAt = moment(data[i].enquiryCreatedAt).fromNow();
							var userId = data[i].enquirySentBy;
							var userObj = Meteor.users.findOne({"_id":userId});
							if (userObj){
								if(userObj.profile.userProfilePic){
									var pic = VendorImage.findOne({"_id":userObj.profile.userProfilePic});
									if(pic){
										data[i].userProfilePic = pic.link();	
									}
									else{
										data[i].userProfilePic = "/users/profile/profile_image_dummy.svg";	
									}
								}else{
									data[i].userProfilePic = "/users/profile/profile_image_dummy.svg";
								}
							}
						}
						return data;
					}
				}else{
					var data = "No Flag Data Available";
					console.log('data :',data);

					return data;
				}

			}else if(tabStatusVar == "activeTab"){
				var blockedUserArray = businessObj.blockedUsers;
				var data = Enquiry.find({"businessid":businessObj._id,"vendorArchive":"noArchived","enquirySentBy": { $nin: blockedUserArray }},{sort: {enquiryCreatedAt:-1}}).fetch();

				if(data){
					// Session is for Search in Enquiry search only
					if(Session.get("nameKey")){
						var nameKey = (Session.get("nameKey")).toUpperCase();

						var newobj = [];
						for(i=0;i<data.length;i++){
							var searchTextString = false;
							for(j=0;j<data[i].enquiryDesc.length;j++){
								if((data[i].enquiryDesc[j].comment.toUpperCase()).indexOf(nameKey) != -1){
									searchTextString = true;
								}
							}
					        if ((data[i].enquiryName.toUpperCase()).indexOf(nameKey) != -1 || searchTextString) {
					        	data[i].enquiryCreatedAt = moment(data[i].enquiryCreatedAt).fromNow();
					        	var userId = data[i].enquirySentBy;
								var userObj = Meteor.users.findOne({"_id":userId});
								if (userObj){
									if(userObj.profile.userProfilePic){
										var pic = VendorImage.findOne({"_id":userObj.profile.userProfilePic});
										if(pic){
											data[i].userProfilePic = pic.link();	
										}
										else{
											data[i].userProfilePic = "/users/profile/profile_image_dummy.svg";	
										}
									}else{
										data[i].userProfilePic = "/users/profile/profile_image_dummy.svg";
									}
								}
					        	newobj.push(data[i]);
					        } 
						}
						return newobj;

					}else{
						for(i=0;i<data.length;i++){
							data[i].enquiryCreatedAt = moment(data[i].enquiryCreatedAt).fromNow();
							var userId = data[i].enquirySentBy;
							var userObj = Meteor.users.findOne({"_id":userId});
							if (userObj){
								if(userObj.profile.userProfilePic){
									var pic = VendorImage.findOne({"_id":userObj.profile.userProfilePic});
									if(pic){
										data[i].userProfilePic = pic.link();	
									}
									else{
										data[i].userProfilePic = "/users/profile/profile_image_dummy.svg";	
									}
								}else{
									data[i].userProfilePic = "/users/profile/profile_image_dummy.svg";
								}
							}	
						}
						return data;
					}
				}else{
					var data = "No Active Data Available";
					// console.log('data :',data);

					return data;
				}
			}
		}
	},
	vendorEnquirySortBy: function(){
		var vendorSort = Session.get('vendorSort');
		var vendorSortTitle = Session.get('vendorSortTitle');
		var data = {
			vendorSort 		: vendorSort,
			vendorSortTitle	: vendorSortTitle,
		}
		return data;
	},
	vendorEnquiryCount: function(){
		var businessLink = FlowRouter.getParam('businessLink');
		// console.log('businessLink :',businessLink);
		if (businessLink) {

			var businessObj = Business.findOne({"businessLink":businessLink,"status": "active"});
			
			var blockedUserArray;
			if(businessObj){
				// console.log('businessObj :',businessObj);
				blockedUserArray = businessObj.blockedUsers;
			}
			var enqCount = Enquiry.find({"businessid":businessObj._id,'enquirySentBy': { $nin: blockedUserArray }}).count();	
					

			var data = {
				vendorcount : enqCount,	
			}
			return data;
		}
	},
	vendorEnquiryDetails:function () {
		if(Session.get("EnqIDSes")){
			id = Session.get("EnqIDSes");
		}else{
			id = '';
		}
		var enqData = Enquiry.findOne({'_id':id});
		if(enqData){
			if(enqData.enquiryDesc){
				for(i=0; i<enqData.enquiryDesc.length; i++){
					enqData.enquiryDesc[i].commentsTS = moment(enqData.enquiryDesc[i].commentsTS).fromNow();

					if(enqData.enquiryDesc[i].commentImage != ''){
						var enquiryImage =	EnquiryImage.findOne({"_id":enqData.enquiryDesc[i].commentImage});
						if(enquiryImage){
							enqData.enquiryDesc[i].enquiryPhoto = enquiryImage.link();
						}
						enqData.enquiryDesc[i].enquiryImgVal = true;
					}else{
						enqData.enquiryDesc[i].enquiryImgVal = false;
					}

					if(enqData.enquiryDesc[i].commentBy == 'User'){
						enqData.enquiryDesc[i].posClass = "pull-left";
						enqData.enquiryDesc[i].posClassTringl = "vEnqTriangleleft";
						// $('.vEnqTriangleleft').animate({ scrollTop: $(document).height() }, 1);
					}else{
						enqData.enquiryDesc[i].posClass = "pull-right";
						enqData.enquiryDesc[i].posClassTringl = "vEnqTriangleRight";
						// $('.vEnqTriangleRight').animate({ scrollTop: $(document).height() }, 1);
						
					}
				}
			}
			// $('.vEnqFormImgOne').animate({ scrollTop: $(document).height() }, 1);
			return enqData;			
		}
	},
	
});

Template.allEnquries.onRendered(function(){
	Session.set("EnqIDSes",'');
	$('#deleteSelected').hide();
	$('#restoreArchive').hide();
	Session.set('vendorSortTitle','Active');

});

Template.vendorEnquiry.onRendered(function(){
	Session.set("tabStatus","activeTab");
	Session.set('vendorSort','All');
});

Template.allEnquries.events({
	
	'click .readEnClass':function(event){
		var id = $(event.currentTarget).parent().attr('id');
		Session.set("EnqIDSes",id);

		$('.vEnqRowTwo').removeClass('selectedEnq');

		$("#"+id).addClass('selectedEnqRead');
		$("#"+id).addClass('selectedEnq');

		Meteor.call('updateEnquiryForRead',id,'read',function(err,rslt){});
	},
	'click .flagEnquiry':function(event){
		var thisFlag = event.currentTarget;
		id = $(thisFlag).parent().parent().attr('id');
		Meteor.call('updateEnquiryForFlag',id,'noflag',function(err,rslt){});
	},
	'click .noflagEnquiry':function(event){
		var thisFlag = event.currentTarget;
		id = $(thisFlag).parent().parent().attr('id');
		Meteor.call('updateEnquiryForFlag',id,'flag',function(err,rslt){});
	},
	'click .deleteEnqBtn': function(event){
		var thisid = event.currentTarget;
		var id = $(thisid).parent().parent().parent().parent().parent().parent().parent().attr('id');
		Meteor.call('deleteEnquiry',id ,function(err,rslt){
		});	
		$('.modal-backdrop').hide();
	},
	
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

Template.vendorEnquiry.events({

	"keyup .vendorEnquiryFormSearch": _.throttle(function(e) {
	    var text = $(e.target).val().trim();
	    Session.set("nameKey",text);
	    if(text==''){
	    	Session.set("nameKey",'');
	    }
	    
	  }, 200),

	'click .blockedUsers': function(event){
		var businessUser = $(event.currentTarget).attr('id');
		var currentUserArray = businessUser.split("-");

		formValues = {
			'currentBusiness' 	: currentUserArray[0],
			'currentUser'  		: currentUserArray[1]
		}

		var data = Business.findOne({"_id":formValues.currentBusiness,"status": "active"});
		if(data){
			var allBlockusers = $.inArray(formValues.currentUser,data.blockedUsers);
			if(allBlockusers == -1) {
				Meteor.call('updateBlockUser',formValues,function(error,result){});
				Session.set("EnqIDSes",'');
				$('.modal-backdrop').hide();
			}
		}
		
		 
	},

	'click .vEnqsndEnqBtn': function(event,template) {
		// event.preventDefault();
		// var elem = $(event.currentTarget).attr('.vEnqFormImgOne');
		// console.log(elem);
		// console.log('elem.outerHeight():',elem.outerHeight());
		// console.log('elem[0].scrollHeight:',elem[0].scrollHeight);
		// console.log('elem.scrollTop():',elem.scrollTop());
		// elem.animate({ scrollTop: elem.prop('scrollHeight') }, 300);
		    // if (elem[0].scrollHeight - elem.scrollTop() == elem.outerHeight())
		    // {
		    //     console.log("bottom");
		    // }
// // 	}
		$('.vEnqFormImgOne').animate({ scrollTop: $(document).height() }, 1);
		var enquiryPhoto = '';
		var enquiryCommentNew = $('.vEnqFormTextarea').val();
       	var id = event.currentTarget.id;
       	// console.log('id :',id);
       	var enquirySentBy = $(event.currentTarget).attr("data-enquirySentBy");
       	// console.log('enquiryName :',enquirySentBy);
       	var businessLink = $(event.currentTarget).attr("data-businessLink");
       	// console.log('hi');
		var elem = $(event.currentTarget).attr('.vEnqFormImgOne');
	    // if (elem[0].scrollHeight - elem.scrollTop() == elem.outerHeight())
	    // {
	    //     console.log("bottom");
	    // }
       	if(filesM.length > 0){
			for(i = 0 ; i < filesM.length; i++){

				const imageCompressor = new ImageCompressor();
			    imageCompressor.compress(filesM[i])
			        .then((result) => {
			          // console.log(result);

			          // Handle the compressed image file.
			          // We upload only one file, in case
			        // multiple files were selected
			        const upload = EnquiryImage.insert({
			          file: result,
			          streams: 'dynamic',
			          chunkSize: 'dynamic',
			          // imagetype: 'profile',
			        }, false);

			        upload.on('start', function () {
			          // template.currentUpload.set(this);
			        });

			        upload.on('end', function (error, fileObj) {
			          if (error) {
			            // alert('Error during upload: ' + error);
			            console.log('Error during upload 1: ' + error);
			            console.log('Error during upload 1: ' + error.reason);
			          } else {
			            // alert('File "' + fileObj._id + '" successfully uploaded');
			            Bert.alert('Enquiry Image uploaded.','success','growl-top-right');
			            // console.log(fileObj._id);
			            enquiryPhoto = fileObj._id;
				  		var formValues ={
				        	"id" 				: id,
				        	"enquiryCommentNew" : enquiryCommentNew,
				        	"enquiryPhoto" 		: enquiryPhoto,
					   	}
						// if(formValues.enquiryCommentNew){
							Meteor.call('insertEnqCommentVendor',formValues,function(error,result){
					      		$('.vEnqFormTextarea').val('');
	        					$('#showEnquiryImgIdV>span').hide();
					        	enquiryPhoto = '';

					        	//============================================================
								// 			Notification Email / SMS / InApp
								//============================================================
								var admin = Meteor.users.findOne({'roles':'admin'});
							    if(admin){
							    	// console.log('admin:',admin);
							    	var adminId = admin._id;
							    }
								var businessData = Business.findOne({"businessLink":businessLink});
								if(businessData){
									var vendorId = businessData.businessOwnerId;
									// console.log('vendor: ',vendorId);
			        				var vendorDetail = Meteor.users.findOne({'_id':vendorId});
			          	  			var userId = enquirySentBy;
			          	  			// cosnole.log('userId:',userId);
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
											to           : enquirySentBy,
											templateName : 'User Enquiry Messages',
											variables    : msgvariable,
										}
										sendInAppNotification(inputObj);
			
			
										var inputObj = {
											notifPath	 : businessLink,
											from         : adminId,
											to           : enquirySentBy,
											templateName : 'User Enquiry Messages',
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
			          // template.currentUpload.set(false);
			        });

			        upload.start();
			        })
			        .catch((err) => {
			          // Handle the error
			    })
		    }
		    filesM = '';

       	}else{
			var formValues = {
						        	"id" 				: id,
						        	"enquiryCommentNew" : enquiryCommentNew,
						        	"enquiryPhoto" 		: '',
							   }

			if(formValues.enquiryCommentNew){
				Meteor.call('insertEnqCommentVendor',formValues,function(error,result){
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
						console.log('vendorId :',vendorId);
        				var vendorDetail = Meteor.users.findOne({'_id':vendorId});

						// var userId = Meteor.userId();
						var userId = enquirySentBy;
							console.log('userId :',userId);
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
							    to           : userId,
							    templateName : 'User Enquiry Messages',
							    variables    : msgvariable,
							}
							sendInAppNotification(inputObj);


							var inputObj = {
								notifPath	 : businessLink,
								from         : adminId,
								to           : userId,
								templateName : 'User Enquiry Messages',
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
	    for (var i = 0, f; f = filesM[i]; i++) {
	        if (!f.type.match('image.*')) {
	        	// console.log('not image file one');
	        	alert('Please select image only!!!');
	          continue;
	      	}else{
	    		console.log('image file');
		    	var reader = new FileReader();
		        reader.onload = (function(theFile) {
		          	return function(e) {
		            // Render thumbnail.

		            var span = document.createElement('span');

		            span.innerHTML = ['<img class="draggedImgenq img-responsive" src="', e.target.result,
		                              '" title="', escape(theFile.name), '"/>'].join('');
		            document.getElementById('showEnquiryImgIdV').insertBefore(span, null);
		          };
		        })(f); 

		        // Read in the image file as a data URL.
		        reader.readAsDataURL(f);
	    	}

	    }
    },
	
	//Mark with Flag and Move to Archive Options
	'click #markWithFlag': function(event){
		Session.set("EnqIDSes",'');
		var selected = [];
		$('.EnqListCheckboxAll:input:checked').each(function() {
		    selected.push($(this).attr('id'));
		});
		for(i=0;i<selected.length;i++){
			var id = selected[i];
			Meteor.call('updateEnquiryForFlag',id,'flag',function(err,rslt){});
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
			Meteor.call('updateEnquiryForArchive',id,'archived',function(err,rslt){});
		}
		for(i=0;i<selected.length;i++){
			var id = selected[i];
			Meteor.call('updateEnquiryForFlag',id,'noflag',function(err,rslt){});
		}
		 $(".commonCheckbox").prop('checked', false);
	},
	

	//Active Flag and Archive Options
	'click #activeList': function(event){
		$(event.currentTarget).parent().children().removeClass('active');
		$(event.currentTarget).addClass('active');
		$('.tab-pane').attr('id','vEnqActive');
		var vendorSortTitle = $(event.currentTarget).children('.activeSelC').text();
		Session.set('vendorSortTitle',vendorSortTitle);
		Session.set("EnqIDSes",'');
		$(".commonCheckbox").prop('checked', false);
		Session.set("tabStatus","activeTab");
		$('#deleteSelected').hide();
		$('#restoreArchive').hide();
		$('#moveToArchive').show();
		$('#markWithFlag').show();
		$('.vEnqSpan>span').css('opacity','1');
		$(".vEnqActiveDiv").removeClass('vEnqSpanShow');
		
	},
	'click #flagList': function(event){
		$(event.currentTarget).parent().children().removeClass('active');
		$(event.currentTarget).addClass('active');	Session.set("EnqIDSes",'');
		$('.tab-pane').attr('id','vEnqFlag');
		$(".commonCheckbox").prop('checked', false);
		Session.set("tabStatus","flagTab");
		$('#markWithFlag').hide();
		var vendorSortTitle = $(event.currentTarget).children('.flagSelC').text();
		Session.set('vendorSortTitle',vendorSortTitle);
		$('#deleteSelected').hide();
		$('#restoreArchive').hide();
		$('#moveToArchive').show();
		$('#markWithFlag').hide();
		$('.vEnqSpan>span').css('opacity','1');
		$(".vEnqActiveDiv").removeClass('vEnqSpanShow');
		
	},
	'click #archiveList': function(event){
		$(event.currentTarget).parent().children().removeClass('active');
		$(event.currentTarget).addClass('active');
		setTimeout(function() {
			$('.restoreArchivei').show();
			$('.vEnqSpan').show();
			$('.restoreArchivei').show();
			$('#deleteSelected').css('display','inline');
			$('#restoreArchive').css('display','inline');
			$('.vEnqSpan>span').css('opacity','0');
			$('#moveToArchive').hide();
			$('#markWithFlag').hide();
			$(".vEnqActiveDiv").removeClass('vEnqSpanShow');
			
			
			$(".commonCheckbox").prop('checked', false);
			Session.set("EnqIDSes",'');
			Session.set("tabStatus","archiveTab");
		},1);
	},

	//Move form Archive to Active
	'click .restoreArchiveii': function(event){
		var thisid = event.currentTarget;
		// console.log("Acr lict: ",thisid);
		var id = $(thisid).parent().parent().attr('id');
		Meteor.call('updateEnquiryForArchive',id,'noArchived',function(err,rslt){});
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
			Meteor.call('updateEnquiryForArchive',id,'noArchived',function(err,rslt){});
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
			Meteor.call('deleteEnquiry',id ,function(err,rslt){});	
		}
		$(".commonCheckbox").prop('checked', false);
		$('.modal-backdrop').hide();
	},

	//All, Read, Unread Options of Active and Flagged Menus
	'click .ADAll': function(){
		Session.set("EnqIDSes",'');
		var vSort = $(event.target).text();
		Session.set('vendorSort',vSort);

		$(".commonCheckbox").prop('checked', false);
		$('.vEnqRowTwo').show();
	},
	'click .ADRead': function(){
		Session.set("EnqIDSes",'');
		var vSort = $(event.target).text();
		Session.set('vendorSort',vSort);

		$(".commonCheckbox").prop('checked', false);
		$('.vEnqRowTwo').hide();
		$('.readEnq').show();
	},
	'click .ADUnread': function(){
		Session.set("EnqIDSes",'');
		var vSort = $(event.target).text();
		Session.set('vendorSort',vSort);

		$(".commonCheckbox").prop('checked', false);
		$('.vEnqRowTwo').hide();
		$('.unreadEnq').show();
	},
	'click .ADFAll': function(){
		Session.set("EnqIDSes",'');
		var vSort = $(event.target).text();
		Session.set('vendorSort',vSort);

		$(".commonCheckbox").prop('checked', false);
		$('.vEnqRowTwo').show();
	},
	'click .ADFRead': function(){
		Session.set("EnqIDSes",'');
		var vSort = $(event.target).text();
		Session.set('vendorSort',vSort);

		$(".commonCheckbox").prop('checked', false);
		$('.vEnqRowTwo').hide();
		$('.readEnq').show();
	},
	'click .ADFUnread': function(){
		Session.set("EnqIDSes",'');
		var vSort = $(event.target).text();
		Session.set('vendorSort',vSort);

		$(".commonCheckbox").prop('checked', false);
		$('.vEnqRowTwo').hide();
		$('.unreadEnq').show();
	},

	// Selected Items Click Events
	'click .activeDownListPre': function(event){
    	event.preventDefault();
    	event.stopPropagation();

		$('.activeDownList').toggleClass('activeDownListBlock');
		$('.activeDownListFlag').removeClass('activeDownListBlockFlag');
		$('.activeDownList').toggle();
	},
	'click .activeDownListFlagPre': function(){
    	event.preventDefault();
    	event.stopPropagation();

		$('.activeDownListFlag').toggleClass('activeDownListBlockFlag');
		$('.activeDownList').removeClass('activeDownListBlock');
		$('.activeDownListFlag').toggle();
	},
	'click .activeEnquiryTabsPre': function(){
		$('.activeDownListFlag').removeClass('activeDownListBlockFlag');
		$('.activeDownList').removeClass('activeDownListBlock');
	},

	// Checked Items Click Events
	'click .EnqListCheckbox':function(){
		 $(".EnqListCheckboxAll").prop('checked', $('.EnqListCheckbox').prop("checked"));
	},
	'click .commonCheckbox': function(){
		// To select and unselect all checkboxes when click on checked all
		var businessLink = FlowRouter.getParam('businessLink');
		var enqListCount = Enquiry.find({"businessLink":businessLink,"vendorArchive":"noArchived"}).count();
		var getChecked = false;
		console.log("enqListCount: ",enqListCount);
		$(".vEnqListBorder").find(".commonCheckbox").each(function(){
			if ($(this).prop('checked')==true){ 
				getChecked = true;
			}
		});
		console.log("getChecked: ",getChecked);
		console.log("businessLink: ",businessLink);
		

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


vendorEnquiryForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'vendorEnquiry'});
}

export { vendorEnquiryForm };