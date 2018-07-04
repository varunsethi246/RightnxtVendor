import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Area } from '/imports/api/masterData/areaMaster.js';

SearchSource.defineSource('area', function(currentArr, options) {
  var options = {sort: {isoScore: -1}, limit: 20};
  var userId = Meteor.userId();
  var newAreaArr =  currentArr.split('|||');
  var searchText = newAreaArr[0];

  var newAreaExcldArr = [];
  if(newAreaArr.length > 0){
    for(i=0;i<newAreaArr.length;i++){
      if(i != 0){
        newAreaExcldArr.push(newAreaArr[i]);
      }
    }
  }
  
  console.log("newAreaExcldArr: ",newAreaExcldArr);
  if(newAreaExcldArr.length>1){
    if(searchText) {
      //Area | City
      var splitText = searchText.split('|');
      var regExp = buildRegExp(splitText[0]);
      // var selector = {name: regExp, emails: regExp};
      var selector = {
        "area": regExp, 
        "city": splitText[1],
        "area":{$nin: newAreaExcldArr} 
      };
      return Area.find(selector, options).fetch();
    } else {
      return Area.find({}, { sort: { isoScore: -1 }, limit: 20 }).fetch();
    }
  }else{
    if(searchText) {
      //Area | City
      var splitText = searchText.split('|');
      var regExp = buildRegExp(splitText[0]);
      // var selector = {name: regExp, emails: regExp};
      var selector = {$and: [
          {"area": regExp}, 
          {"city": splitText[1]} 
        ]};;
      return Area.find(selector, options).fetch();
    } else {
      return Area.find({}, { sort: { isoScore: -1 }, limit: 20 }).fetch();
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