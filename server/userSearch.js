import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { FollowUser } from '/imports/api/userFollowMaster.js';


SearchSource.defineSource('users', function(searchText, options) {
  var options = {sort: {isoScore: -1}, limit: 20};
  var userId = Meteor.userId();
  var userIdArr =[userId];
  
  var followUserData = FollowUser.find({"userId":userId}).fetch();
  if(followUserData && followUserData.length>0){
    for(i=0;i<followUserData.length;i++){
      userIdArr.push(followUserData[i].followUserId);
    }
  }

  if(searchText) {
    var regExp = buildRegExp(searchText);
    var selector = { emails: { $elemMatch: { "address": regExp } },
                    "_id": { $nin: userIdArr } , 
                    "roles":{$nin: [ 'admin', 'Vendor']} };
    return Meteor.users.find(selector, options).fetch();
  } else {
    return Meteor.users.find({"_id": { $nin: userIdArr }, "roles":{$nin: [ 'admin', 'Vendor']}}, options).fetch();
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