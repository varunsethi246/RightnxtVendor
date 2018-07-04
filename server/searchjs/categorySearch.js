import { Categories } from '/imports/api/masterData/categoriesMaster.js';

SearchSource.defineSource('categories', function(searchText, options) {
  // console.log('searchText ' + searchText);
  var option = (typeof options == "object") ? options : { sort: { level1: -1 } , limit: 40 };
  
  if(searchText) {
    var regExp = buildRegExp(searchText);

    var selector = {$or: [
      {level0: regExp},
      {level1: regExp},
      {level2: regExp},
      {level3: regExp},
      {level4: regExp}
      // {tags: regExp}
    ]};

    var newArr = Categories.find(selector, {
                    fields : {"level0":1, "level1":1,"level2":1,"level3":1,"level4":1},
                    sort   : { level1: 1 },
                    limit  : 40,
                  }).fetch();
    // return Categories.find(selector, { sort: { level1: 1 } }).fetch();
  }
  // } else {
  //   var newArr = Categories.find({}, {
  //                   fields : {"level0":1, "level1":1,"level2":1,"level3":1,"level4":1},
  //                   sort   : { level1: 1 },
  //                   limit  : 40, 
  //                 }).fetch();
  // }
  return newArr;

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