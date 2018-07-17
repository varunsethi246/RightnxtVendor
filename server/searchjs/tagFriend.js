import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { VendorImage } from '/imports/videoUploadserver/vendorImageServer.js';
import { FollowUser } from '/imports/api/userFollowMaster.js';

SearchSource.defineSource('tagFriend', function(searchText, options) {
  var options = {};
  var userId = Meteor.userId();

  // =========================================================
    // ==================Get Image URL from Start ==============
    // =========================================================
    var userPageShowImage = (imgId)=> {
      if(imgId){
          var imgData = VendorImage.findOne({"_id":imgId});
          if(imgData) {
            var data = imgData.url();
          }else{
            var data = '/users/profile/profile_image_dummy.svg';
          }
          return data;
      }
    }
    // =========================================================
    // ==================Get Image URL from End ================
    // =========================================================

  if(userId){
    var regExp = buildRegExp(searchText);
    
    var data =  FollowUser.find({"userId" : userId}).fetch();
    var userList = [];
    for(i = 0 ; i < data.length ; i++){
      userList.push(data[i].followUserId);
    }
    var tagListUsers = Meteor.users.find({ $and: [{"_id" : {$in: userList}} , { "profile.name" : regExp}]}).fetch();
    if(tagListUsers){
      for(i=0;i<tagListUsers.length;i++){
        if(tagListUsers[i].profile.userProfilePic){
          tagListUsers[i].userPhoto = userPageShowImage(tagListUsers[i].profile.userProfilePic);
        }else{
          tagListUsers[i].userPhoto = '/users/profile/profile_image_dummy.svg';
        }
      }
      return tagListUsers;
    }

  }
});

function buildRegExp(searchText) {
  var words = searchText.trim().split(/[ \-\:]+/);
  var exps = _.map(words, function(word) {
    return "(?=.*" + word + ")";
  });
  var fullExp = exps.join('') + ".+";
  return new RegExp(fullExp, "i");
}