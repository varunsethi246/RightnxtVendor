import { Categories } from '/imports/api/masterData/categoriesMaster.js';

SearchSource.defineSource('categoriesLevel1', function(searchText, options) {
  var option = (typeof options == "object") ? options : { sort: { level1: -1 }, limit: 20 };
  
  if(searchText) {
    var regExp = buildRegExp(searchText);

    var selector = {$or: [
      {level1: regExp},
    ]};

    var newArr = Categories.find(selector, {
                    fields : {"level1":1, "level1Tags":1},
                    sort   : { level1: 1 },
                  }).fetch();
    if(newArr){
      var catgL1Array = _.uniq(newArr, false, function(d){return d.level1});
      return catgL1Array;
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