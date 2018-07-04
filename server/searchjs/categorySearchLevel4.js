import { Categories } from '/imports/api/masterData/categoriesMaster.js';

SearchSource.defineSource('categoriesLevel4', function(searchText, options) {
  var option = (typeof options == "object") ? options : { sort: { level4: -1 }, limit: 20 };
  
  if(searchText) {
    var regExp = buildRegExp(searchText);

    var selector = {$or: [
      {level4: regExp},
    ]};

    
     return Categories.find(selector, { sort: { level4: 1 }, limit: 20 }).fetch();
  } else {
    return Categories.find({}, { sort: { level4: 1 }, limit: 20 }).fetch();
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