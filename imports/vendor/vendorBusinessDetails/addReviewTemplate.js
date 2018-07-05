import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';

import {Review} from '/imports/api/reviewMaster.js';
import { Business } from '/imports/api/businessMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { VendorImage } from '/imports/videoUploadClient/vendorImageClient.js';
import { ReviewImage } from '/imports/videoUploadClient/reviewImageClient.js';
import ImageCompressor from 'image-compressor.js';

var filesR = [];
var counterImg = 0;

var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
// var fields = ['profile.name' , 'emails[0].address'];
var fields = ['profile.name'];

tagFriend1 = new SearchSource('tagFriend', fields, options);
// var tagedFriends = [];
tagedFriends = [];

// Template.addReviewTemplate.onCreated(function(){
//   this.subscribe('vendorImage');
// });
Template.addReviewTemplate.onRendered(function(){
	counterImg = 0;
});

Template.addReviewTemplate.events({ 
	// 'focusout #frndsList' : function(event){
	// 	var data = event.currentTarget.value;
	// 	// alert(data);
	// },

	'keydown #review':function(event){
      setTimeout(function() {
         var comment = $('#review').val();
         if(comment){
            var commentlen = comment.length;
            var remainText = 140 - commentlen;
            if(remainText < 0){
	            $('.textRemain').css('display','none');
			    $('.newReviewMsg').css('display','none');

            }else{
	            $('.textRemain').css('display','block');
			    $('.newReviewMsg').css('display','block');
	            $('.textRemain').text(remainText + ' /140');
            }
         }else{
            $('.textRemain').text('0 /140');
         }
      }, 1);
   },
	"click .tagFrndLi" : function(e){
		// $('.tagFrndUl').removeClass('searchDisplayHide').addClass('searchDisplayShow');
		
		var selectedUser = $(e.currentTarget).attr('data-userName');
		var frndId = $(e.currentTarget).attr('id');
		var userImage = $(e.currentTarget).attr('data-photo');
		// console.log('userImage :',userImage);
    	selectedUser = selectedUser.trim();
		tagedFriends.push({'selectedUser':selectedUser, 'selectedUserId':frndId, 'userImage':userImage});
		$('#searchFrnds').trigger('keyup');  
		$('#searchFrnds').val("");
		
	},

	"click .bunchTagFrndCross":function(e){
		var userId = $(e.currentTarget).attr('data-userId');
		var tagfrnd = [];
		for(var i = 0 ; i < tagedFriends.length; i++ ){
			if(tagedFriends[i].selectedUserId != userId){
				tagfrnd.push(tagedFriends[i])
			}
		}
		$('#searchFrnds').trigger('keyup');
		tagedFriends = tagfrnd;
	},
	"click .tagFrndClose":function(e){
		e.preventDefault();
		$('.modal-backdrop').hide();
	},
	"keydown #searchFrnds":function(e){
		//For Up and Down arrow selection in dropdown
		$('.tagFrndUl').removeClass('searchDisplayHide').addClass('searchDisplayShow');
		
		if(e.keyCode == 9) {
			e.preventDefault();
		}

		var current_index = $('.selectedSearch').index();
	    var $number_list = $('.tagFrndUl');
	    var $options = $number_list.find('.tagFrndLi');
	    var items_total = $options.length;

		if (e.keyCode == 40) {
	        if (current_index + 1 < items_total) {
	            current_index++;
	            change_selection();
	        }
	    } else if (e.keyCode == 38) {
	        if (current_index > 0) {
	            current_index--;
	            change_selection();
	        }
	    }
	    var selectedUser = $('.selectedSearch').attr('data-username');
		var frndId = $('.selectedSearch').attr('id');
		var userImage = $('.selectedSearch').attr('data-photo');


	    if(e.keyCode===9 &&selectedUser.length>0){
	    	selectedUser = selectedUser.trim();
	    	tagedFriends.push({
	    		'selectedUser'	:selectedUser, 
	    		'selectedUserId':frndId, 
	    		'userImage'		:userImage

	    	});
	    	// console.log('tagedFriends :',tagedFriends);
			$('#searchFrnds').val("");
	    }

	    function change_selection() {
		    $options.removeClass('selectedSearch');
			$options.eq(current_index).addClass('selectedSearch');
			

			// To scroll the selection
			var $s = $('.tagFrndUl');
			var optionTop = $('.selectedSearch').offset().top;
			var selectTop = $s.offset().top;
			$s.scrollTop($s.scrollTop() + (optionTop - selectTop)-4);
		}
	},

	
	"keyup #searchFrnds": _.throttle(function(e) {
		$('.tagFrndUl').removeClass('searchDisplayHide').addClass('searchDisplayShow');
		
	    var text = $('#searchFrnds').val();
	    if (text) {
			$('.tagFrndLiFrieldList').css('display','block');

	    	tagFriend1.search(text);
	    }
	  }, 200),

	'click .addFriends': function(event){
		$('.frnds').css('display','block');
	},
	'click #searchFrnds': function(){
		$('.tagFrndUl').removeClass('searchDisplayHide').addClass('searchDisplayShow');
	},
	'click .tagFrndUl': function(event){
		event.stopPropagation();
	},

	'click .fa-star-half': function(event){
		var id = event.currentTarget.id;
		$('#'+id).addClass('selectedStar');
		// console.log(id);
	},

	'submit .reviewformClass': function(event){
		event.preventDefault();
		var tagedFriendsList = [];
		for(var i = 0 ; i < tagedFriends.length; i++ ){
			tagedFriendsList.push(tagedFriends[i].selectedUserId)
		}

		var businessUrl = FlowRouter.getParam('businessurl');

		var starRating = $('.starRatingWrapper .fixStar1').length;
		// console.log('starRating on add review :',starRating);
		starRating = starRating + $('.starRatingWrapper .fixStar2').length;
		var rating = parseFloat(starRating) / 2;

		var formValues = {
			"businessLink" 			: FlowRouter.getParam('businessurl'),
			"rating" 				    : rating,
			"reviewComment" 		: event.target.review.value,
			"tagedFriends"      : tagedFriendsList,
		};

		if(rating == 0){
			$('.passwordWrongSpan').text("Please rate the business before submitting the review!");
      		$('.passwordWrongSpan').addClass('passwordWrongWar');
			$('.openReviewBox').show();
			$('.publishReview').hide();			
		}else{
			if(formValues.reviewComment.length >=0 && formValues.reviewComment.length<=140){

				$('.passwordWrongSpan').text("Your comment is too short, please write min 140 characters.");

	            $('.passwordWrongSpan').addClass('passwordWrongWar');
				$('.openReviewBox').show();
				$('.publishReview').hide();
			}else{
			    $('.passwordWrongSpan').removeClass('passwordWrongWar');
			    $('.passwordWrongSpan').css('display','none');
			    // $('.newReviewMsg').css('display','none');
				$('.openReview').removeClass('maxopenReviewHeight');
				$('.openReview').addClass('minopenReviewHeight');
			
				Meteor.call('insertReview', formValues,
					function(error,result){
						if(error){
							// Bert.alert('There is some error', 'danger', 'growl-top-right' );
							return;
						}else{
							event.target.review.value	= '';
							// Bert.alert('Your message submitted successfully!!! ', 'success', 'growl-top-right' );	
							var reviewId = result;
							// console.log("reviewId: ",reviewId);

							//============================================================
							// 			Notification Email / SMS / InApp
							//============================================================
							// tagedFriends = [];
							
					        var businessData = Business.findOne({"businessLink":businessUrl});

					        if(businessData){
								var admin = Meteor.users.findOne({'roles':'admin'});
							    if(admin){
							    	var adminId = admin._id;
							    }
								var reviewData 	= Review.findOne({"_id":reviewId});
						        //Send Mail and SMS to Vendor
								if(reviewData){
									var userId 	= reviewData.userId;
									var userVar = Meteor.users.findOne({'_id':userId});
				                	if(userVar){
				                		var username 	= userVar.profile.name;
				                		var date 		= new Date();
				                		var currentDate = moment(date).format('DD/MM/YYYY');
				                		var msgvariable = {
											'[username]' 		: username,
						   					'[currentDate]'		: currentDate,
						   					'[businessName]'	: businessData.businessTitle
						               	};

										var inputObj = {
											from         : adminId,
										    to           : userId,
										    templateName : 'User Review and Rating',
										    variables    : msgvariable,
										}
										sendMailNotification(inputObj); 
									}
							    }//reviewData  

						        //Send Notification, Mail and SMS to Vendor
						        var reviewVar = Review.findOne({"_id":reviewId});
						        if(reviewVar){
						        	var businessLink = reviewVar.businessLink;
						        		var businessOwnerId = businessData.businessOwnerId;
						        		var userDetail = Meteor.users.findOne({'_id':businessOwnerId});

			                        	if(userDetail){
			                        		var username 	= userDetail.profile.name;
					                		var date 		= new Date();
					                		var currentDate = moment(date).format('DD/MM/YYYY');
					                		var msgvariable = {
												'[username]' 	: username,
							   					'[currentDate]'	: currentDate,
						   						'[businessName]': businessData.businessTitle
							               	};

											var inputObj = {
												notifPath	 : businessUrl,
											    to           : businessOwnerId,
											    templateName : 'Vendor Review and Rating',
											    variables    : msgvariable,
											}
											sendInAppNotification(inputObj);

											var inputObj = {
												from         : adminId,
											    to           : businessOwnerId,
											    templateName : 'Vendor Review and Rating',
											    variables    : msgvariable,
											}
											sendMailNotification(inputObj); 
										}
							    }//reviewVar

						        //Send Notification, Mail and SMS to taged friends
							        // tagedFriendsList
							    for(var i = 0 ; i < tagedFriendsList.length ; i++){
						        	var userDetail = Meteor.users.findOne({'_id':tagedFriendsList[i]});
						        	if(userDetail){
						        		var msgvariable = {
											'[username]' 	: userDetail.profile.name,
											'[tagedFriends]': tagedFriendsList[i],
						   					'[currentDate]'	: currentDate,
					   						'[businessName]': businessData.businessTitle
						               	};

										var inputObj = {
											notifPath	 : businessUrl,
										    to           : tagedFriendsList[i],
										    templateName : 'You have been Tagged',
										    variables    : msgvariable,
										}
										sendInAppNotification(inputObj);

										var inputObj = {
											from         : adminId,
										    to           : tagedFriendsList[i],
										    templateName : 'You have been Tagged',
										    variables    : msgvariable,
										}
										sendMailNotification(inputObj);
						        	}
							    }//i

					        }
					        //============================================================
							// 			End Notification Email / Text / InApp
							//============================================================

						    if(filesR){
								for(i = 0 ; i < filesR.length; i++){
									const imageCompressor = new ImageCompressor();
								    imageCompressor.compress(filesR[i])
								        .then((result) => {
								          // console.log(result);

								          // Handle the compressed image file.
								          // We upload only one file, in case
								        // multiple files were selected
								        const upload = ReviewImage.insert({
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
								            Bert.alert('Review Image uploaded.','success','growl-top-right');
								            // console.log(fileObj._id);
								            // Session.set("vendorImgFilePath",fileObj._id);
								            var imgId =  fileObj._id ;
									        Meteor.call("updateReviewBulkImg", reviewId, imgId,
									          function(error1, result1) { 
									              if(error1) {
									                console.log ('Error Message: ' + error ); 
									              }else{
													// console.log('img upload ', fileObj._id);	
													// console.log('img added');
													$('.publishReview').show();
													$('.openReviewBox').hide();
													$('.reviewImages').hide();
													event.target.review.value	= '';
									              }
									        });
								          }
								          // template.currentUpload.set(false);
								        });

								        upload.start();
								        })
								        .catch((err) => {
								          // Handle the error
								    })		
								}
								filesR = [];
								counterImg = 0;
						    }

							//======================================================================
							// For quick retrieval of business rating, we will also 
							// store the latest rating of the business into 'business' collection. 
							// Calculate latest rating as the average rating of all reviews so far. 
							//======================================================================
							var allReviews = Review.find({"businessLink" : businessLink}).fetch();
							if(allReviews){						
								var totalRating = 0;
								var totalVote = allReviews.length;
								for(i=0; i<allReviews.length; i++){
									totalRating = totalRating + allReviews[i].rating;
								}
								totalRating = totalRating / allReviews.length ;
								// console.log('totalRating: ',totalRating);
								var business = Business.findOne({"businessLink" : businessLink});
								if(business){
									// console.log('business._id: ',business._id);
									// console.log('totalRating: ',totalRating);
									// console.log('totalVote: ',totalVote);
									Meteor.call('updateBusinessForRating',business._id,totalRating, totalVote, function(err,rslt){
										if(err){
											console.log('error occured in updating business for rating only: ', err);
										}else{
											// console.log('Business updated with latest rating');
										}
									});						
								}
							}
							event.target.review.value	= '';
							$('.takeRating').removeClass('boxStar1');
							$('.takeRating').removeClass('boxStar2');
							$('#reviewImglist').empty();
							$('.openReviewBox').hide();
							// $('.publishReview').show();
							return;
						}
					}	
				);
			}
		}
	},

	'click .shareImg': function(event){
		$('.socailShare').toggle();				

	},
	'click .publish2': function(event){
		$('.openReview').hide();
		$('.publishReview').show();

	},

	// 'click .reviewImages':function(event){
	// 	// console.log("hi review");
	// 	// if ($('.tagFrnd').css('display') !== 'block') {
	// 	// 	console.log("in review If")
 //  //     $('.tagFrnd').css('display','none');
 //  //     $('.reviewImages').css('display','block');
	// 	// }else{
	// 	// 	console.log("in review else")
 //  //     $('.reviewImages').css('display','block');
	// 	// } 
	// 	$('#reviewImgDiv').show();
	// 	$('#tagImgDiv').css('display','none');
	// },
	// 'click .tagFrnd':function(event){
	// 	// console.log("hi tag");
	// 	// if ($('.reviewImages').css('display') !== 'block') {
	// 	// 	console.log("in tag If");
 //  //     $('.reviewImages').css('display','none');
 //  //     $('.tagFrnd').css('display','block');
	// 	// }else{
	// 	// 		console.log("in tag else");
 //  //     $('.tagFrnd').css('display','block');
	// 	// } 

	// 	$('#tagImgDiv').show();
	// 	$('#reviewImgDiv').css('display','none');
	// },
	
	'click .publishReview': function(event){
		var busLink = FlowRouter.getParam("businessurl");
		if(Meteor.userId()){
		var userReview = Review.findOne({"userId":Meteor.userId(),"businessLink":busLink});
		if(userReview){
			// businessObj.alreadyReviewed = true;
			
			$('.passwordWrongSpan').text("You have already reviewed this Business. Hence more review is not allowed.");
            $('.passwordWrongSpan').addClass('reviewWrngErrorMsg');	

			}else{
			// businessObj.alreadyReviewed = false;
				$('.openReview').show();
				$('.publishReview').hide();
				$('.socailShare').hide();	
			}
		}
			
	},
	'click .NopublishReview': function(event){
		var busLink = FlowRouter.getParam("businessurl");
		if(Meteor.userId()){
			var userReview = Review.findOne({"userId":Meteor.userId(),"businessLink":busLink});
			// console.log('userReview',userReview);
			if(userReview){
			// businessObj.alreadyReviewed = true;
			$('.passwordWrongSpan').text("You have already reviewed this Business. Hence more review is not allowed.");
            $('.passwordWrongSpan').addClass('reviewWrngErrorMsg');	

			}else{
			// businessObj.alreadyReviewed = false;
				$('.openReview').show();
				$('.publishReview').hide();
				$('.socailShare').hide();	
			}
		}
			
	},
	'click .reviewClose': function(event){
	    $('.reviewClose').parent('.openReview').hide();
	    $('.publishReview').show();
		$('.newReviewMsg').css('display','none');
		$('.passwordWrongSpan').css('display','none');
		$('.openReviewBox').hide();
		$('.boxbg').removeClass('fixStar1');
		$('.boxbg').removeClass('fixStar2');
	},	

	'click .uploadImg': function(event){
		// console.log("hi uploadImg");
		// $('.reviewImages').toggle();
		// var div1 = document.getElementsByClassName("tagImg");
	 //  var div2 = document.getElementsByClassName("reviewImages");
    if($('.tagFrnd').css('display') == 'block'){
    	$('.tagFrnd').css("display", "none");
      	$('.reviewImages').css("display", "block");
		$('.openReview').addClass('maxopenReviewHeight');			
    }else if ($('.tagFrnd').css('display') == 'none') {
     	$('.reviewImages').toggle();
     	if( $('.openReview').hasClass('maxopenReviewHeight') ){
				$('.openReview').removeClass('maxopenReviewHeight');
				$('.openReview').addClass('minopenReviewHeight');
				}else{
					$('.openReview').removeClass('minopenReviewHeight');
					$('.openReview').addClass('maxopenReviewHeight');			
			}
    }

		// if( $('.openReview').hasClass('maxopenReviewHeight') ){
		// 	$('.openReview').removeClass('maxopenReviewHeight');
		// 	$('.openReview').addClass('minopenReviewHeight');
		// }else{
		// 	$('.openReview').removeClass('minopenReviewHeight');
		// 	$('.openReview').addClass('maxopenReviewHeight');			
		// }
	},
	'click .tagImg': function(event){
	 if($('.reviewImages').css('display') == 'block'){
    	$('.reviewImages').css("display", "none");
      $('.tagFrnd').css("display", "block");
				$('.openReview').addClass('maxopenReviewHeight');			
    }else if ($('.reviewImages').css('display') == 'none') {
     	$('.tagFrnd').toggle();
     	if( $('.openReview').hasClass('maxopenReviewHeight') ){
					$('.openReview').removeClass('maxopenReviewHeight');
					$('.openReview').addClass('minopenReviewHeight');
				}else{
					$('.openReview').removeClass('minopenReviewHeight');
					$('.openReview').addClass('maxopenReviewHeight');			
				}
    }
		 
		// if( $('.openReview').hasClass('maxopenReviewHeight') ){
		// 	$('.openReview').removeClass('maxopenReviewHeight');
		// 	$('.openReview').addClass('minopenReviewHeight');
		// }else{
		// 	$('.openReview').removeClass('minopenReviewHeight');
		// 	$('.openReview').addClass('maxopenReviewHeight');			
		// }
	},

	'change #reviewImgfiles' : function(event){
			$('#reviewImgtext').hide();
			// files = event.target.files; // FileList object\
			var file = event.target.files; // FileList object\
			// console.log('file ',file);
			for(var j = 0 , f1;f1 = file[j]; j++){
				filesR[counterImg] = file[j];
				counterImg = counterImg + 1;
			}
			// console.log('filesR ',filesR);

			// Loop through the FileList and render image files as thumbnails.
			for (var i = 0, f; f = file[i]; i++) {
				// filesR[i].businessLink = Session.get('SessionBusinessLink');
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
			        span.innerHTML = ['<img class="draggedReviewImg" src="', e.target.result,
			                          '" title="', escape(theFile.name), '"/>'].join('');
			        document.getElementById('reviewImglist').insertBefore(span, null);
			      };
			    })(f); //end of onload
			    // Read in the image file as a data URL.
			    reader.readAsDataURL(f);		    
			}// end of for loop
		},	

});

Template.addReviewTemplate.helpers({
	//Get Friends list
	'getFrndsList' : function(){
		var data =  tagFriend1.getData();
		// console.log("data: ",data);
		
	    var data1 = [];
		if(tagedFriends.length > 0){
			for(var i = 0 ; i < data.length ; i++){
				var temp = 0 ;
				for(var j = 0 ; j < tagedFriends.length; j++){
					if(tagedFriends[j].selectedUserId == data[i]._id){
						temp = 1;
						break;
					}
				}
				if(temp == 0 ){
					data1.push(data[i]);
				}
			}
			data = data1;
			var result =  {data,tagedFriends};
		}else{
			var result =  {data,tagedFriends};
		}
	    return result;
	},

	'userProfilePic' : function(){
		var id = Meteor.userId();
		if(id){
			var data = Meteor.users.findOne({"_id":id},{"profile":1});
			if(data){
				
				var pic = VendorImage.findOne({"_id":data.profile.userProfilePic});
				if(pic){
					// console.log(pic);
					data.profile.userProfilePic = pic.link();	
				}
				else{
					data.profile.userProfilePic = "/users/profile/profile_image_dummy.svg";	
				}
				// console.log('data ', data);
			}else{
				data.profile.userProfilePic = "/users/profile/profile_image_dummy.svg";
			}

			return data;
			
		}
	},
	'reviewData' : function(){
		var businessLink = FlowRouter.getParam('businessurl');
		var reviewObj = Review.findOne({'businessLink':businessLink});
		if(reviewObj){
			return true;
		}else{
			return false;
		}
	}
});


$(document).on("click",function() {
    if( $(".tagFrndUl").hasClass('searchDisplayShow')&&!($("#searchFrnds").is(":focus"))){
		$('.tagFrndUl').addClass('searchDisplayHide').removeClass('searchDisplayShow');
    }
});