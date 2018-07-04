import { Business } from '/imports/api/businessMaster.js';

SearchSource.defineSource('adsBusiness', function(searchText) {
  // searchText = city | area | searchText
  var options = { sort: { businessTitle: -1 } };
  var searchResult = '';
  var selector = '';

  if(searchText == 'undefined'){
     var textSelector =  '';
  }else{
     var textRegExp = buildRegExp(searchText);
     var textSelector  = {"businessTitle" : textRegExp} ;
  }

  // var selector = textSelector;
  var selector = {}; 
  selector["$and"] = [];
  selector["$and"].push(textSelector);
  selector["$and"].push({"status" : "active"}); 
  
  searchResult = Business.find(selector, options).fetch();
  return searchResult;
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