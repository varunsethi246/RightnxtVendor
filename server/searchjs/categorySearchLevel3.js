import { Categories } from '/imports/api/masterData/categoriesMaster.js';

SearchSource.defineSource('categoriesLevel3', function(searchText, options) {
  var option = (typeof options == "object") ? options : { sort: { level3: -1 }, limit: 20 };
  
  if(searchText) {
    var regExp = buildRegExp(searchText);

    var selector = {$or: [
      {level3: regExp},
    ]};

    var newArr = Categories.find(selector, {
                    fields : {"level3":1, "level3Tags":1},
                    sort   : { level3: 1 },
                  }).fetch();
    if(newArr){
      var catgL3Array = _.uniq(newArr, false, function(d){return d.level3});
      return catgL3Array;
    }
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