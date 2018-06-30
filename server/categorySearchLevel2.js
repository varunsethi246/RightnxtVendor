import { Categories } from '/imports/api/masterData/categoriesMaster.js';

SearchSource.defineSource('categoriesLevel2', function(searchText, options) {
  var option = (typeof options == "object") ? options : { sort: { level2: -1 }, limit: 20 };
  
  if(searchText) {
    var regExp = buildRegExp(searchText);

    var selector = {$or: [
      {level2: regExp},
    ]};

    var newArr = Categories.find(selector, {
                    fields : {"level2":1, "level2Tags":1},
                    sort   : { level2: 1 },
                  }).fetch();
    if(newArr){
      var catgL2Array = _.uniq(newArr, false, function(d){return d.level2});
      return catgL2Array;
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