import './userProfile.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { FollowUser } from '/imports/api/userFollowMaster.js';
import { VendorImage } from '/imports/videoUploadClient/vendorImageClient.js';
import ImageCompressor from 'image-compressor.js';

Template.userProfile.onCreated(function() {
    this.currentUpload = new ReactiveVar(false);
    this.subscribe('vendorImage');
});

Template.userProfile.helpers({
	currentUpload: function() {
        return Template.instance().currentUpload.get();
    },

	'userDetails' : function(){
		if(Session.get("updateUserTimeline")==true){
			var id = Meteor.userId();
			if(!Roles.userIsInRole(id, ['Vendor'])){
				var url = FlowRouter.current().path;
				var checkIdExists = url.split('/');
				if(checkIdExists[2] != '' && checkIdExists[2]){
					id = produceURLid(checkIdExists[2]);
				}
			}
			// console.log('userprofile|'+id+'|');
	
			if(id){
				var data = Meteor.users.findOne({"_id":id},{"profile":1});
				if(data){
					// data.aboutText =  data.profile.aboutMe;
					var pic = VendorImage.findOne({"_id":data.profile.userProfilePic});
					if(pic){
						if(pic.type=='image/png'){
							data.checkPng = 'bkgImgNone';	
						}else{
							data.checkPng = '';	
						}
						data.profile.userProfilePic = pic.link();	
					}
					else{
						data.profile.userProfilePic = "/users/profile/profile_image_dummy.svg";	
					}
					if(Roles.userIsInRole(id, ['Vendor'])){
						data.statusClass = 'show';
					}else{
						if(checkIdExists[2] != '' && checkIdExists[2]){
							data.statusClass = 'hide';
						}else{
							data.statusClass = 'show';
						}
					}
					if(data.profile.city == '-'){
						data.profile.city = false;
					}
	
					var url = FlowRouter.current().path;
	
					if(url=='/profileSetting' || url== '/notificationConfiguration' || url=="/editProfile"){
						data.statusClassPro = 'hide';
						data.statusClassProSet = 'show';
					}else{
						data.statusClassPro = 'show';
						data.statusClassProSet = 'hide';
					}

					if(url.split('/')[2]){
						data.followButton = 'hideFollowButton';
					}else{
						data.followButton = '';
						data.followButtonText 	= "Follow";
						data.followButtonClass = "";
						var verifyFollow = FollowUser.findOne({
																"userId": Meteor.userId(),
																"followUserId": data._id
															 });
						if(verifyFollow){
							data.followButtonText 	= "Following";
							data.followButtonClass = "alreadyFollowing";
						}
					}
					return data;
				}			
			}
		}else{
			var id = Meteor.userId();
			if(!Roles.userIsInRole(id, ['Vendor'])){
				var url = FlowRouter.current().path;
				var checkIdExists = url.split('/');
				// console.log("checkIdExists: ",checkIdExists);
	
				if(checkIdExists[2] != '' && checkIdExists[2]){
					id = produceURLid(checkIdExists[2]);
				}
			}
			// console.log('userprofile|'+id+'|');
	
			if(id){
				var data = Meteor.users.findOne({"_id":id},{"profile":1});
				if(data){
					// data.aboutText =  data.profile.aboutMe;
					var pic = VendorImage.findOne({"_id":data.profile.userProfilePic});
					if(pic){
						if(pic.type=='image/png'){
							data.checkPng = 'bkgImgNone';	
						}else{
							data.checkPng = '';	
						}
						data.profile.userProfilePic = pic.link();	
					}
					else{
						data.profile.userProfilePic = "/users/profile/profile_image_dummy.svg";	
					}
					if(Roles.userIsInRole(id, ['Vendor'])){
						data.statusClass = 'show';
					}else{
						if(checkIdExists[2] != '' && checkIdExists[2]){
							data.statusClass = 'hide';
						}else{
							data.statusClass = 'show';
						}
					}
					if(data.profile.city == '-'){
						data.profile.city = false;
					}
	
					var url = FlowRouter.current().path;
	
					if(url=='/profileSetting' || url== '/notificationConfiguration' || url=="/editProfile"){
						data.statusClassPro = 'hide';
						data.statusClassProSet = 'show';
					}else{
						data.statusClassPro = 'show';
						data.statusClassProSet = 'hide';
					}

					if(!url.split('/')[2]){
						data.followButton = 'hideFollowButton';
					}else{
						data.followButton = '';
						data.followButtonText 	= "Follow";
						data.followButtonClass = "";
						var verifyFollow = FollowUser.findOne({
																"userId": Meteor.userId(),
																"followUserId": data._id
															 });
						if(verifyFollow){
							data.followButtonText 	= "Following";
							data.followButtonClass = "alreadyFollowing";
						}
					}

					return data;
				}			
			}
		}
		
	},

	'displayUserProfile' : function(id){
		if(id){
			return true;
		}
		else{
			return false;
		}
	},
});



Template.userProfile.events({
	// for follower
	// 'click .follow' : function(event){
	// 	var value  = this;
	// 	var id     = value.id;
	// 	var userFollowdata = FollowUser.findOne({'userId':Meteor.userId() , 'followUserId': id});
	// 	if(userFollowdata){
	// 		swal("You are already following this person!");
	// 	}else{
	// 		Meteor.call('insertUserFollow',id,(error,result)=>{
	// 			if(error){
	// 				console.log(error.reason);
	// 			}else{
	// 				Bert.alert('Follow User Successfull!','success','growl-top-right');
	// 				var getResult = result;
	// 				$(event.currentTarget).css('display','none');
	// 				//send mail to the user//
	//              	var followData = FollowUser.findOne({"_id":getResult});
	//               	if(followData){
	//                 	var usermailId = followData.followUserId;
	//                 	var userVar = Meteor.users.findOne({'_id':usermailId});
	// 	                if(userVar){
	// 	                    var notifConfig = userVar.notificationConfiguration.follow;
	// 	                    if(notifConfig == "true"){
	// 		                	var inputObj = {
	// 		                        roles       : 'user',
	// 		                        to          : usermailId,
	// 		                        templateName: 'Follow',
	// 		                        OrderId     : getResult,
	// 		                	}
	// 		                	sendMailnNotif(inputObj);
	// 		                }
	// 		            }
	//               	}//followData 
	// 			}
	// 		});
	// 	}
	// },

	'click .showAddPhotoTxt' : function(event){
		
		// console.log('showAddPhotoTxt');
		$("input[id='uploadImg']").click();
	},
	
	'change .userProfileImg': function(event,template){
	    // event.preventDefault();
	    if(event.currentTarget.files[0]){  
	    	// console.log(event.currentTarget.files[0].size);
	    	$('#userPic').removeClass('bkgImgNone');
	    	$('#userPic').attr('src','');
	    	const imageCompressor = new ImageCompressor();

			imageCompressor.compress(event.currentTarget.files[0])
			  .then((result) => {
			    // console.log(result);

			    // Handle the compressed image file.
			    // We upload only one file, in case
				// multiple files were selected
				const upload = VendorImage.insert({
					file: result,
					streams: 'dynamic',
					chunkSize: 'dynamic',
					// imagetype: 'profile',
				}, false);

				upload.on('start', function () {
					template.currentUpload.set(this);
				});

				upload.on('end', function (error, fileObj) {
					if (error) {
					  // alert('Error during upload: ' + error);
					   console.log('Error during upload 1: ' + error);
					   console.log('Error during upload 1: ' + error.reason);
					} else {
				  		// alert('File "' + fileObj._id + '" successfully uploaded');
				    	Bert.alert('Vendor Image uploaded.','success','growl-top-right');
				  	
					  	// console.log(fileObj._id);
					  	Meteor.call("updateUserProfileImage", fileObj._id,
					        function(error, result) { 
					            if(error) {
					              console.log ('Error Message: ' +error ); 
					            }else{
					                // Bert.alert( 'Image Updated successfully!!!!', 'success', 'growl-top-right' );
					                // $('.editBlogImage').hide();
					        }
					    });
					}
					template.currentUpload.set(false);
				});

				upload.start();
			  })
			  .catch((err) => {
			    // Handle the error
			})    
	    }
	},
	'click .userFollow' : function(event){
		event.preventDefault();
		var followid = event.currentTarget.id.split('-');
		var followUserId = followid[1];
		var userId = Meteor.userId();
		var verifyFollow = FollowUser.findOne({"userId": Meteor.userId(),"followUserId": followUserId});
		
		if(verifyFollow){
			var id = verifyFollow._id;
			Meteor.call('removeUserFollow',id,function(error,result){
				if (error) {
					console.log(error);
				}else{
					var admin = Meteor.users.findOne({'roles':'admin'});
				    if(admin){
				    	var adminId = admin._id;
				    }//admin

	                	var userVar    = Meteor.users.findOne({'_id':followUserId});
	                	if(userVar){
	        				var username 	= userVar.profile.name;
	                		var date 		= new Date();
	                		var currentDate = moment(date).format('DD/MM/YYYY');
	                		var msgvariable = {
								'[username]' 	: username,
			   					'[currentDate]'	: currentDate
			               	};
							var inputObj = {
							    to           : followUserId,
							    templateName : 'UnFollow',
							    variables    : msgvariable,
							}
							sendInAppNotification(inputObj);

							var inputObj = {
								from         : adminId,
							    to           : followUserId,
							    templateName : 'UnFollow',
							    variables    : msgvariable,
							}

							sendMailNotification(inputObj);
	                	}//userVar
				}
			});
		}else{
			Meteor.call('insertUserFollow',followUserId, function(error, result){
			if(error){
				// Bert.alert('Some technical issue happened... You couldn\'t follow', 'danger', 'growl-top-right');
			}else{
				var admin = Meteor.users.findOne({'roles':'admin'});
			    if(admin){
			    	var adminId = admin._id;
			    }//admin 
				var getResult = result;
				var followData = FollowUser.findOne({"_id":getResult});
              	if(followData){
                	var usermailId = followData.followUserId;
                	var userVar    = Meteor.users.findOne({'_id':usermailId});
                	if(userVar){
        				var username 	= userVar.profile.name;
                		var date 		= new Date();
                		var currentDate = moment(date).format('DD/MM/YYYY');
                		var msgvariable = {
							'[username]' 	: username,
		   					'[currentDate]'	: currentDate
		               	};
						var inputObj = {
						    to           : usermailId,
						    templateName : 'Follow',
						    variables    : msgvariable,
						}
						sendInAppNotification(inputObj);
						var inputObj = {
							from         : adminId,
						    to           : usermailId,
						    templateName : 'Follow',
						    variables    : msgvariable,
						}
						sendMailNotification(inputObj);
                	}//userVar
              	}//followData 
			}
		});
		}
	},

});

