import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Area } from '/imports/api/masterData/areaMaster.js';

SearchSource.defineSource('adsArea', function(searchText, options) {
  var options = {sort: {isoScore: -1}, limit: 20};
  var userId = Meteor.userId();
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
});

function buildRegExp(searchText) {
  var words = searchText.trim().split(/[ \-\:]+/);
  var exps = _.map(words, function(word) {
    return "(?=.*" + word + ")";
  });
  var fullExp = exps.join('') + ".+";
  return new RegExp(fullExp, "i");
}