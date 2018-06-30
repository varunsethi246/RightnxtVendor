import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';
// import {Accounts} from 'meteor/accounts-base';

if(Meteor.isServer){
	Meteor.publish('userProfile' , function userspublish(userId){
		return Meteor.users.find({"_id":userId});
	});
	// Meteor.publish('userProfileAll' , function userspublish(){
	// 	return Meteor.users.find({});
	// });

	Meteor.publish('noOfUserCount', function() {
		Counts.publish(this, 'noOfUserCount', Meteor.users.find({"roles":"user"}));
	});
	
	Meteor.publish('noOfVendorCount', function() {
		Counts.publish(this, 'noOfVendorCount', Meteor.users.find({"roles":"Vendor"}));
	});
	Meteor.publish('noOfUser', function() {
		Counts.publish(this, 'noOfUser', Meteor.users.find({}));
	});

}

Meteor.methods({
	'storeUserSelectedCity': function(userId, city){
		Meteor.users.update(
			{'_id': userId},
			{$set:
				{
				'selectedCity' : city,
				}
			},
			function(error,result){
				if(error){
					return error;
				}else{
					return result;
				}
			}
		);
	},
	'fbLogin' : function(newId){
		var userInfo = Meteor.users.findOne({"_id":newId});
		if(userInfo)
		{
			console.log('userInfo.services.facebook.email ',userInfo.services.facebook.email);
			if(!userInfo.emails){
				console.log("userInfo.emails:",userInfo.emails);
				Meteor.users.update(
					{'_id': newId},
					{$push:
						{"emails":{
									"address"  : userInfo.services.facebook.email,
									"verified" : true
								  }
						}
					},
					function(error,result){
						if(error){
							return error;
						}else{
							console.log('executed');
							return result;
						}
					}
				);
			}
		}
	},
	'removeReverse' : function(newId){
		Meteor.users.update(
			{'_id': newId},
			{$set:
				{
				'profile.reverse' : '',
				}
			},
			function(error,result){
				if(error){
					return error;
				}else{
					return result;
				}
			}
		);
	},
	'addOTP' : function(newId,otp){
		Meteor.users.update(
			{'_id': newId},
			{$set:
				{
				'profile.otp' : otp,
				}
			},
			function(error,result){
				if(error){
					return error;
				}else{
					return result;
				}
			}
		);
	},
	'addEmailOTP' : function(newId,otp){
		Meteor.users.update(
			{'_id': newId},
			{$set:
				{
				'profile.emailotp' : otp,
				}
			},
			function(error,result){
				if(error){
					console.log('server error ',error);
					return error;
				}else{
					// console.log('server result ',result);
					return result;
				}
			}
		);
	},


	'activeUser' : function(userId){
		Meteor.users.update(
			{'_id': userId},
			{$set:
				{
				'emails.0.verified' : true,
				'profile.emailotp'  : 0,
				'profile.otp'       : 0,
				}
			},
			function(error,result){
				if(error){
					console.log('error api ',error);
					return error;
				}else{
					return result;
				}
			}
		);
	},

	'updateUserProfileImage' : function(fileData){
		var userId = Meteor.userId();
		Meteor.users.update(
			{'_id': userId},
			{$set:
				{
				'profile.userProfilePic' : fileData,
				}
			},
			function(error,result){
				if(error){
					return error;
				}else{
					return result;
				}
			}
		);
	},

	'updateUserProfile' : function(formValues){
		Meteor.users.update(
					{"_id": Meteor.userId()},
					{
						$set: { profile : 
								{
									"name"		: formValues.name,
									"mobile"	: formValues.mobile,
									"state"		: formValues.state,
									"city"		: formValues.city,
									"area"		: formValues.area,
									"pincode"	: formValues.pincode,
									"aboutMe"  	: formValues.aboutMe,
									"status"	: formValues.status,
									"userProfilePic" : formValues.userProfilePic,
								}
							}
					},function(error,result){
						if(error){
							return error;
						}else{
							return result;
						}
					});
	},

	'changeMyPassword': function(newPwd){
		var userId = Meteor.userId();
	 	// Meteor.users.update({'_id': userId});
	 	Accounts.setPassword(userId,newPwd);
	},

	checkPassword: function(digest) {
	    check(digest, String);
	    if (this.userId) {
	    	// console.log("in checkPassword");
	      	var user = Meteor.user();
	      	var password = {digest: digest, algorithm: 'sha-256'};
	      	// console.log('password :',password);
	      	var result = Accounts._checkPassword(user, password);
	      	// console.log("result : ", result);
	      	return result.error == null;
	      
	    } else {
	    	console.log("in false statement");
	      	return false;
	    }
	},

	'insertUserNotifConfig' : function(Enquiry,Rating,Follow,Like,Comment,editbusiness,report){
		Meteor.users.update(
					{"_id": Meteor.userId()},
					{
						$set: { notificationConfiguration : 
								{
									"enquiry"		: Enquiry,
									"invoice"		: "true",
									"rating"		: Rating,
									"payment"   	: "true",
									"follow"    	: Follow,
									// "unfollow"  : UnFollow,
									"like"	    	: Like,
									// "unlike"	: UnLike,
									"comment"  		: Comment,
									"editbusiness"  : editbusiness,
									"report"  		: report,
								}
							}
					},function(error,result){
						if(error){
							return error;
						}else{
							return result;
						}
					});
	},

	blockUser: function(){
      Meteor.users.update({'_id': Meteor.userId() },
						        {
						          $set:{
						              "profile.status": 'Blocked' ,
						              } //End of set
						        }); //end of update			
	  }, //end of blockuser function

	  // assignRole : function(role){
	  // 	Meteor.users.update(
	  // 		{"_id": Meteor.userId()},
	  // 		{
	  // 			$push: { roles :{ "users" }

	  // 			},function(error,result){
			// 			if(error){
			// 				return error;
			// 			}else{
			// 				return result;
			// 			}
	  // 		});
	  // },

	  addRoleNotifEmailOTPsendVerifyLink : function(newID,defaultRoleconfig){
	  	Meteor.call('addRoles', newID , defaultRoleconfig,function(error,result){
        	if(error){
            	console.log(error);
          	}else{
          		Meteor.call('addNotifConfig',newID,function(error,result){
                	if(error){
                    	//Bert.alert("Something went wrong");
                    	console.log(error);
                  	}else{
                  		var otp      = Math.floor(1000 + Math.random() * 9000);
                    	Meteor.call('addEmailOTP',newID,otp,function(error,result){
                      		if(error){
                       			console.log(error);
                      		}else{
                      			Meteor.call('sendVerificationLink', newID, function(error,result){
                          			if(error){
                            			Bert.alert(error.reason);
                          			}else{
                          				return newID;
                          			} 
                          		});
                          	}
                        });
                    }
                });
          	}
        });
	  },



});
