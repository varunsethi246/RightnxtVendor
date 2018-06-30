import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { FollowUser } from '../../api/userFollowMaster.js';
import { Review } from '../../api/reviewMaster.js';
import { UserProfileStoreS3New } from '/client/UserProfileS3.js';
// import  'lib/collections/userCollection.js';
// import swal from 'sweetalert2'
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../userLayout.js';
import './findYourFriends.html';
import './suggestedFollowUsers.html';
import './userFollowers.html'

userCity = 'Pune';
var options = {
  keepHistory: 0,
  localSearch: false
};
// var fields = ['profile.name' , 'emails[0].address'];
var fields = ['emails.address'];

userSearch = new SearchSource('users', fields, options);

Template.userFollowers.helpers({
	followShowHide(){
		var id = '';
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('/');
		if(checkIdExists[2] != '' && checkIdExists[2]){
			id = produceURLid(checkIdExists[2]);
		}else{
			id = Meteor.userId();
		}
		var currentUser = Meteor.userId();
		if(currentUser == id){
			return true;
		}else{
			return false;
		}
	},
	checkNetworkFlwrLoading(count){
		if(count<=0){
			return true;
		}else{
			return false;
		}
	},
	checkNetworkFlwLoading(count){
		if(count<=0){
			return true;
		}else{
			return false;
		}
	},
	'followerCountDis':function(){
		var userIdFoll = Session.get('finduserIdFoll');
		var follCounts  = FollowUser.find({'followUserId': userIdFoll}).count();
		// console.log('follCounts : ',follCounts);
		if (follCounts > 1) {
			// console.log('in if');
			return true;
		}else{
			// console.log('in else');
			return false;
		}

	},
	'reviewCountDis':function(){
		var userIdFoll = Session.get('finduserIdFoll');
		// var revieFollCounts  = FollowUser.find({'followUserId': userIdFoll}).count();
		var revieFollCounts    = Review.find({'userId': userIdFoll}).count();

		// console.log('revieFollCounts : ',revieFollCounts);
		if (revieFollCounts > 1) {
			// console.log('in if review' );
			return true;
		}else{
			// console.log('in else review');
			return false;
		}

	},
	'userFollowerData': function(){
		var id = '';
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('/');
		var data = {};
		if(checkIdExists[2] != '' && checkIdExists[2]){
			id = produceURLid(checkIdExists[2]);
		}else{
			id = Meteor.userId();
		}
		var userId        = id;
		var userArray     = [];
		if(Session.get('loadmore')){
				limitFollows = Session.get('loadmore');
			}else{
				limitFollows = 5;
			}

		var followUserObjTotalCount = FollowUser.find({"followUserId":userId},{sort: {followingDate:-1}}).count();
		var followUserObj = FollowUser.find({"followUserId":userId},{sort: {followingDate:-1}, limit:limitFollows}).fetch();
		if(followUserObj){
			if(followUserObj.length < 5 || followUserObj.length == followUserObjTotalCount){
				userArray.showLoadMoreFollow = 'hideFollowButton';
			}else{
				userArray.showLoadMoreFollow = '';
			}

			for(var i=0;i<followUserObj.length;i++){
				var id      = followUserObj[i].userId;
				Session.set('finduserIdFoll',id);
				var UserDataObj = Meteor.users.findOne({"_id":id});
				if(UserDataObj){
					var name           = UserDataObj.profile.name;
					var pic = UserProfileStoreS3New.findOne({"_id":UserDataObj.profile.userProfilePic});
					if(pic){
						UserDataObj.profile.userProfilePic = pic.url();	
					}
					else{
						UserDataObj.profile.userProfilePic = "/users/profile/profile_image_dummy.svg";	
					}
					
					var fId            = UserDataObj._id;
					var followerCount  = FollowUser.find({'followUserId': id}).count();
					var reviewCount    = Review.find({'userId': id}).count();
					userArray.push({
						'id'              : fId,
						'followerInt'     : name,
						'UserFollowerImg' : UserDataObj.profile.userProfilePic,
						'userFollowFol'   : followerCount,
						'UserFollowerRev' : reviewCount,
						'redirectid'	  : generateURLid(fId),
					})
				}//UserDataObj
			}//i
		}//followUserObj
		return userArray;
	},

	'userFollowerCount':function(){
		var id = '';
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('/');
		var data = {};
		if(checkIdExists[2] != '' && checkIdExists[2]){
			id = produceURLid(checkIdExists[2]);

		}else{
			id = Meteor.userId();
		}

		var userId        = id;
		var followUserObj = FollowUser.find({"followUserId":userId}).count();
		if(followUserObj){
			$('.addBoxs').addClass('followerBoxWrap');
			return followUserObj;
		}else{
			$('.addBoxs').removeClass('followerBoxWrap');
			return "0";
		}
	},

	'userFollowingData': function(){
		var id = '';
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('/');
		var data = {};
		if(checkIdExists[2] != '' && checkIdExists[2]){
			id = produceURLid(checkIdExists[2]);
		}else{
			id = Meteor.userId();
		}
		// console.log('id',id);
		var userId        = id;
		var userArray     = [];
		var followUserObj = FollowUser.find({"userId":userId}).fetch();
		if(followUserObj){
			for(var i=0;i<followUserObj.length;i++){
				var id      = followUserObj[i].followUserId;
				var UserDataObj = Meteor.users.findOne({"_id":id});
				if(UserDataObj){
					var name           = UserDataObj.profile.name;
					// var userProfilePic = UserDataObj.profile.userProfilePic;
					var fId            = UserDataObj._id;
					var pic            = UserProfileStoreS3New.findOne({"_id":UserDataObj.profile.userProfilePic});
					if(pic){
						UserDataObj.profile.userProfilePic = pic.url();	
					}
					else{
						UserDataObj.profile.userProfilePic = "/users/profile/user-one.png";	
					}
					var followerCount  = FollowUser.find({'followUserId': id}).count();
					var reviewCount    = Review.find({'userId': id}).count();
					userArray.push({
						'id'               : fId,
						'followingInt'     : name,
						'UserFollowingImg' : UserDataObj.profile.userProfilePic,
						'userFollowingFol' : followerCount,
						'UserFollowingRev' : reviewCount,
						'redirectid'       : generateURLid(fId),
						'followId'		   : followUserObj[i]._id,
					})
				}//UserDataObj
			}//i
		}//followUserObj
		// console.log('userArray id: ',userArray );
		return userArray;
	},

	'userFollowingCount':function(){
		// var userId        = Meteor.userId();
		var id = '';
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('/');
		var data = {};
		if(checkIdExists[2] != '' && checkIdExists[2]){
			id = produceURLid(checkIdExists[2]);

		}else{
			id = Meteor.userId();
		}

		var userId        = id;
		// console.log(userId);
		var followUserObj = FollowUser.find({"userId":userId}).count();
		if (followUserObj >8) {
			$('.addBox').addClass('followingBoxWrap');
		}else{
			$('.addBox').removeClass('followingBoxWrap');
		}
		return followUserObj;
	},
});

Template.userFollowers.events({
	'click .unfollowUserBtnMod': function(event){
		var currentId = $(event.currentTarget).attr('data-follow');
		
		Meteor.call('removeUserFollow', currentId, (error, result)=>{
			if(result){
				
			}
			$('.modal-backdrop').hide();
		});
	},
	'click .loadmore': function(event){
		if(Session.get('loadmore')){			
			var currentLimit = Session.get('loadmore');
			// console.log("currentLimit",currentLimit);
			var newLimit = currentLimit + 5;
		}else{
			var newLimit = 10;
		}

		Session.set('loadmore',newLimit);

	},

	'click .followI':function(event){
		var value  = this;
		var id     = value.id;
		var userFollowdata = FollowUser.findOne({'userId':Meteor.userId() , 'followUserId': id});
		if(userFollowdata){
			swal("You are already following this person!");
		}else{
			Meteor.call('insertUserFollow',id,(error,result)=>{
				if(error){
					console.log(error.reason);
				}else{
					Bert.alert('Follow User Successfull!','success','growl-top-right');
					var getResult = result;
					$(event.currentTarget).css('display','none');
					//send mail to the user//
	             	var followData = FollowUser.findOne({"_id":getResult});
	              	if(followData){
	                	var usermailId = followData.followUserId;
	                	var userVar = Meteor.users.findOne({'_id':usermailId});
		                if(userVar){
		                    var notifConfig = userVar.notificationConfiguration.follow;
		                    if(notifConfig == "true"){
			                	var inputObj = {
			                        roles       : 'user',
			                        to          : usermailId,
			                        templateName: 'Follow',
			                        OrderId     : getResult,
			                	}
			                	sendMailnNotif(inputObj);
			                }
			            }
	              	}//followData 
				}
			});
		}
		
	},
});

Template.suggestedFollowUsers.events({
	'click .followI':function(event){
		var value  = this;
		var id     = value._id;
		var userFollowdata = FollowUser.findOne({'userId':Meteor.userId() , 'followUserId': id});
		if(userFollowdata){
			swal("You are already following this person!");
		}else{
			Meteor.call('insertUserFollow',id,(error,result)=>{
				if(error){
					console.log(error.reason);
				}else{
					Bert.alert('Follow User Successfull!','success','growl-top-right');
					$(event.currentTarget).css('display','none');
    				//============================================================
					// 			Notification Email / SMS / InApp
					//============================================================
					var admin = Meteor.users.findOne({'roles':'admin'});
				    if(admin){
				    	var adminId = admin._id;
				    }
					
					var followedUser 	= id;
    				var followDetail 	= Meteor.users.findOne({'_id':followedUser});
					var currentUser  	= Meteor.userId();
    				var currentDetail 	= Meteor.users.findOne({'_id':currentUser});

    				if(followDetail&&currentDetail){

    					var followname 	= followDetail.profile.name;
    					var currentname = currentDetail.profile.name;

    					//Send Notification, Mail and SMS to Followed User
                		var date 		= new Date();
                		var currentDate = moment(date).format('DD/MM/YYYY');
                		var msgvariable = {
							'[username]' 	: followname,
							'[otheruser]'	: currentname,
		   					'[currentDate]'	: currentDate,
		               	};

						var inputObj = {
							notifPath	 : "",
						    to           : followedUser,
						    templateName : 'Follow User Other',
						    variables    : msgvariable,
						}
						sendInAppNotification(inputObj);

						var inputObj = {
							notifPath	 : "",
							from         : adminId,
						    to           : followedUser,
						    templateName : 'Follow User Other',
						    variables    : msgvariable,
						}
						sendMailNotification(inputObj);

						//Send Notification, Mail and SMS to Current User
                		var date 		= new Date();
                		var currentDate = moment(date).format('DD/MM/YYYY');
                		var msgvariable = {
							'[username]' 	: currentname,
							'[otheruser]'	: followname,
		   					'[currentDate]'	: currentDate,
		               	};

						var inputObj = {
							notifPath	 : "",
							from         : adminId,
						    to           : currentUser,
						    templateName : 'Follow User Current',
						    variables    : msgvariable,
						}
						sendMailNotification(inputObj);
    				}
					//============================================================
					// 			End Notification Email / SMS / InApp
					//============================================================
				}
			});
		}
	},
});


Template.suggestedFollowUsers.helpers ({
	'userSuggestionrender':function(){
		var userId         = Meteor.userId();
		var userArray      = [];
		var followArray    = [];
		var currentUserObj = Meteor.users.findOne({"_id":userId});
		var userIdArr =[userId];

		var followUserData = FollowUser.find({"userId":userId}).fetch();
		console.log('followUserData :',followUserData);
		if(followUserData && followUserData.length>0){
			for(i=0;i<followUserData.length;i++){
				userIdArr.push(followUserData[i].followUserId);
			}
		}

			if(currentUserObj){
				userCity = currentUserObj.profile.city;
				var otherUsersData  = Meteor.users.find({"profile.city":userCity, "_id": { $nin: userIdArr }, "roles":{$nin: [ 'admin', 'Vendor']}}).fetch();
				
				if(otherUsersData){
					for(var i=0;i<otherUsersData.length;i++){
						var name    = otherUsersData[i].profile.name;
						var id      = otherUsersData[i]._id;
						var pic     = UserProfileStoreS3New.findOne({"_id":otherUsersData[i].profile.userProfilePic});
						if(pic){
							otherUsersData[i].profile.userProfilePic = pic.url();	
						}
						else{
							otherUsersData[i].profile.userProfilePic = "/users/profile/profile_image_dummy.svg";	
						}
						var followUser = FollowUser.findOne({'userId':userId , 'followUserId':id});
						if(!followUser){
							var followerCount = FollowUser.find({'followUserId': id}).count();
							var reviewCount   = Review.find({'userId': id}).count();
							userArray.push({
								'_id'               : id,
								'SuggestionInt'     : name,
								'UsersuggestionImg' : otherUsersData[i].profile.userProfilePic,
								'userSuggestionFol' : followerCount,
								'userSuggestionRev' : reviewCount,
							})
							
							
						}//!followUser
					}//i
				}//otherUsersData
			}
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			if(checkIdExists[1] != '' && checkIdExists[1]){
				var returnUserArray = userArray.filter(function(el) { 
					return el._id != checkIdExists[2]; 
				});
			}
			return returnUserArray;
	},

	'userSuggestionData': function(){
		return userSearch.getData();
	},

	'userReviewInfo': function(id){
		var data = {
			userSuggestionRev : 0 ,
		}

		var reviewCount   = Review.find({'userId': id}).count();
		if(reviewCount){
			 data = {
				userSuggestionRev : reviewCount ,
			}
			
		}
		return data;
	},

	'userFollowInfo': function(id){
		var data = {
			userSuggestionFol : 0,
		}
		var followerCount = FollowUser.find({'followUserId': id}).count();
		if(followerCount){

				 data = {
					userSuggestionFol : followerCount,
				}
				
		}
		return data;
	}
	
});

Template.findYourFriends.onRendered(function(){

/* global gapi */
// var gapi = require('gapi');

  window.onLoadCallback = function(){
    gapi.auth.init({
      client_id: '444930413096-he15o98cpej6vtdngpmn02b187k6vglq.apps.googleusercontent.com'
    });
  }

});

function checkAuth() {
  gapi.auth.authorize({
    client_id: '444930413096-he15o98cpej6vtdngpmn02b187k6vglq.apps.googleusercontent.com',
    scope: scopes,
    immediate: false
  }, handleAuthResult);
}

function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    $.get('https://www.google.com/m8/feeds/contacts/default/full?alt=json&access_token=' +
           authResult.access_token + '&max-results=700&v=3.0',
      function(response) {
         //Handle Response
      });
  }
}

Template.findYourFriends.events({

	'click .FBimport':function(event){
		// event.preventDefault();
		// $('.contentFB').hide();
		// $('.contactFB').show();
		// FacebookInviteFriends();
		event.preventDefault();
		
		var path = window.location.href;
		var splitPath = path.split('/');
		var url = splitPath[2];
		fbInvite(url);

	},

	'click .Googleimport':function(event){
		// auth();

  		gapi.client.setApiKey('xZ9z80V4EOGqiA1T1wjujWgo');
   		window.setTimeout(checkAuth, 3);

	},

	'focus #userSearch': function(){
		$('.secondDiv').hide();
		$('.firstDiv').css('display','block');
	},

	"keyup #userSearch": function(e) {
		var text = $(e.currentTarget).val().trim();
		// console.log("text: ",text);
	    userSearch.search(text);
	  },
});

function FacebookInviteFriends(){
	// FB.ui({ method: 'send',name: 'Complete Web Tutorials - PHP, Mysql, Ajax, Jquery, HTML, CSS, facebook, twitter',link: 'http://w3lessons.info', description: 'your website description', picture: 'http://w3lessons.info/demo/web2.0.jpg'});

  //   	FB.ui({
		//    method: 'apprequests',
		//    message: 'Invite your Facebook Friends'
		//   },function(response) {
		//    if (response) {
		//     alert('Successfully Invited');
		//    } else {
		//     alert('Failed To Invite');
		//    }
		// });
}

fbInvite = function(url){

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

 //   FB.ui({
	//   method: 'feed',
	//   link: url,
	//   caption: 'Check out this site!',
	//   picture: url+'/images/logo.png',
	// }, function(response){});
	FB.ui({
	    method: 'send',
	    link: url,
	    action_properties: JSON.stringify({
            object : {
               'og:title'      : 'Check out this site',
               'og:description': 'This is the best site ever',
               'og:image'      : url+'/images/logo.png' 
            }
        })
	});


  };
}

function auth() {
    var config = {
      'client_id': '444930413096-he15o98cpej6vtdngpmn02b187k6vglq.apps.googleusercontent.com',
      'scope': 'https://www.google.com/m8/feeds'
    };
    gapi.auth.authorize(config, function() {
      fetch(gapi.auth.getToken());  
     
    });
}

function fetch(token) {
    token['g-oauth-window'] = null;
    $.ajax({
        url: 'https://www.google.com/m8/feeds/contacts/default/full?alt=json',
        dataType: 'jsonp',
        data: token
    }).done(function(data) {
        // console.log(JSON.stringify(data));
    });
}

var contactsService;

function setupContactsService() {
  contactsService = new google.gdata.contacts.ContactsService('exampleCo-exampleApp-1.0');
}

function logMeIn() {
  var scope = 'https://www.google.com/m8/feeds';
  var token = google.accounts.user.login(scope);
}

function initFunc() {
  setupContactsService();
  logMeIn();
  getMyContacts();
}

function getMyContacts() {
  var contactsFeedUri = 'https://www.google.com/m8/feeds/contacts/default/full';
  var query = new google.gdata.contacts.ContactQuery(contactsFeedUri);
  
  // Set the maximum of the result set to be 5
  query.setMaxResults(5);
  
  contactsService.getContactFeed(query, handleContactsFeed, handleError);
}

var handleContactsFeed = function(result) {
  var entries = result.feed.entry;

  for (var i = 0; i < entries.length; i++) {
    var contactEntry = entries[i];
    var emailAddresses = contactEntry.getEmailAddresses();
    
    for (var j = 0; j < emailAddresses.length; j++) {
      var emailAddress = emailAddresses[j].getAddress();
      // alert('email = ' + emailAddress);
    }    
  }
}

function authorize(){
    if($scope.authorizationResult){
      handleAuthorization($scope.authorizationResult);
    }else{
		gapi.auth.authorize({client_id: '918832832305-k5s36thpeu1p0oa5j2valpbcr3qupmce.apps.googleusercontent.com', scope: scopes, immediate:false}, handleAuthorization);
    } 
}

function checkAuth() {
  gapi.auth.authorize({
    client_id: '918832832305-k5s36thpeu1p0oa5j2valpbcr3qupmce.apps.googleusercontent.com',
    scope: 'https://www.google.com/m8/feeds',
    immediate: false
  }, handleAuthResult);
}

function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
    $.get('https://www.google.com/m8/feeds/contacts/default/full?alt=json&access_token=' +
           authResult.access_token + '&max-results=700&v=3.0',
      function(response) {
         //Handle Response
      });
  }
}


userFollowersForm = function () {  
  BlazeLayout.render("userLayout",{content: 'userFollowers'});
  // Blaze.render(Template.userLayout,document.body);
}
export { userFollowersForm }


findYourFriendsForm = function () {  
  BlazeLayout.render("userLayout",{content: 'findYourFriends'});
  // Blaze.render(Template.userLayout,document.body);
}
export { findYourFriendsForm }















