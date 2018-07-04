import { Categories } from '/imports/api/masterData/categoriesMaster.js';

SearchSource.defineSource('bannerCategories', function(currentArr, options) {
  // console.log('searchText ' + searchText);
  var option = (typeof options == "object") ? options : { sort: { level1: -1 } , limit: 40 };
  
  var currentArr = currentArr.split('|||');

  var newCatArr = [];
  if(currentArr.length > 0){
    for(i=0;i<currentArr.length;i++){
      if(i != 0){
        newCatArr.push(currentArr[i]);
      }
    }
  }

  var searchText = currentArr[0];
  if(searchText) {
    var regExp = buildRegExp(searchText);

    var selector = {$or: [
      {level1: regExp},
    ]};

    if(newCatArr.length > 1){
      var newselector = {
        "level1": regExp,
        "level1":{$nin: newCatArr} 
      };

      var newArr = Categories.find(newselector, {
                        fields : {"level1":1,},
                        limit  : 40,
                      }).fetch();
      newArr = _.uniq(newArr);
      return newArr;

    } else{
      var newArr = Categories.find(selector, {
                      fields : {"level1":1,},
                      limit  : 40
                    }).fetch();
      newArr = _.uniq(newArr);
      return newArr;
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