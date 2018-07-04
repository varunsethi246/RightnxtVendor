import { Business } from '/imports/api/businessMaster.js';

SearchSource.defineSource('business2', function(searchText) {
  // searchText = city | area | searchText
  // console.log("searchText",searchText);
  var options = { sort: { businessTitle: -1 } }; 
  // console.log("options",options);
  var splitData = searchText.split('|');
  // console.log("splitData",splitData);
  var searchResult = '';
  var selector = '';
  var searchCity = splitData[0];

  var searchArea = splitData[1];
  var searchString = splitData[2];

  if(searchCity == 'undefined' || searchCity == ''){
    var citySelector = {"businessCity":'Pune'} ;
  }else{
    var citySelector = {"businessCity": searchCity } ;
  }

  if(searchArea == 'undefined' || searchArea == 'All'){
     var areaSelector = '';
  }else{
     var areaSelector = { "businessArea" : searchArea };
  }

  if(searchString == 'undefined'){
     var textSelector =  '';
  }else{
     var textRegExp = buildRegExp(searchString);
     var textSelector  = {"businessTitle" : textRegExp};
     // console.log("textSelector",textSelector);

  }

  if(textSelector == '' && areaSelector==''){
    // var selector = citySelector ;
    var selector = {};
    selector["$and"] = [];
    selector["$and"].push(citySelector);
    selector["$and"].push({"status" : "active"}); 
  }else{
    var selector = {};
    selector["$and"] = [];
    selector["$and"].push(citySelector); 
    if(textSelector !== ''){ selector["$and"].push(textSelector); }
    if(areaSelector !== ''){ selector["$and"].push(areaSelector); }
    selector["$and"].push({"status" : "active"}); 
  }
  // var limitVar = {limit : 1};
  // console.log("selector: ",selector);
  // console.log("selector: ",selector);
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