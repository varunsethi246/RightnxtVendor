import { Business } from '/imports/api/businessMaster.js';

SearchSource.defineSource('listbusinessSearch', function(searchText, options) {
  console.log('searchText ' ,searchText);
  var options = (typeof options == "object") ? options : { sort: { businessTitle: -1 } };
  var data = searchText.split('|');
  if(data[0]) {
    var regExp = buildRegExp(data[0]);

    var selector = {"businessTitle":regExp,"status":data[1]}; 

    return Business.find(selector, { sort: { businessTitle: -1 } }).fetch();
  } else {
    return Business.find({"status":data[1]}, { sort: { businessTitle: -1 }}).fetch();
  }

});

function buildRegExp(searchText) {
  // console.log('buildRegExp business');
  var words = searchText.trim().split(/[ \-\:]+/);

  var exps = _.map(words, function(word) {
    return "(?=.*" + word + ")";
  });
  var fullExp = exps.join('') + ".+";
  return new RegExp(fullExp, "i");
}