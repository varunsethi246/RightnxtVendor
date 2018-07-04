import { Business } from '/imports/api/businessMaster.js';

SearchSource.defineSource('bannerBusiness', function(searchText) {
  // searchText = state | city | area | searchText
  var options = { sort: { businessTitle: -1 } };
  var searchResult = '';
  var selector = '';
  var text = searchText.split('|');
  var state = text[0];
  var city = text[1];
  var area = text[2];
  var searchText = text[3];

  if(state == 'undefined'){
      state = 'Maharashtra';
  }

  if(city == 'undefined'){
      city = 'Pune';
  }

   if(area == 'undefined'){
        var area = {};
    } else {
        var area = { "businessArea" : area };
    }

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
  selector["$and"].push({"businessState":state}); 
  selector["$and"].push({"businessCity":city}); 
  selector["$and"].push(area); 
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