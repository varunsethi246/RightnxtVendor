import { City } from '/imports/api/masterData/cityMaster.js';

SearchSource.defineSource('city', function(searchText, options) {

  var options = (typeof options == "object") ? options : { sort: { city:1 } };
  
  if(searchText) {
    var regExp = buildRegExp(searchText);
    // var selector = { city : regExp };

    var selector = { 
                        $and:[
                              { city : regExp },
                              {"status":"active"}
                        ]
                     }
    return City.find(selector, { sort: { city:1 } }).fetch();
  } else {
    return City.find({"status":"active"}, { sort: { city: 1 } }).fetch();
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