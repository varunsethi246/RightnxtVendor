import { Enquiry } from '/imports/api/enquiryMaster.js';

SearchSource.defineSource('enquiry', function(searchText) {
	// searchText = Business Link | Text
  var splitData = searchText.split('|');

  var option = { sort: { level1: -1 } , limit: 40 };
  
  if(searchText) {
    var regExp = buildRegExp(splitData[1]);

    var selector = {$or: [
      {businessTitle: regExp},
      // {enquiryDesc: regExp},
      {enquiryName: regExp},
      {enquirySentBy: regExp},
      {businessLink:splitData[0]}
    ]};

    var newArr = Enquiry.find(selector, {
                    fields : {"businessTitle":1, "enquiryName":1,"enquirySentBy":1},
                    sort   : { enquiryName: 1 },
                    limit  : 40,
                  }).fetch();
  }
  return newArr;
});

function buildRegExp(searchText) {
  var words = searchText.trim().split(/[ \-\:]+/);

  var exps = _.map(words, function(word) {
    return "(?=.*" + word + ")";
  });
  var fullExp = exps.join('') + ".+";
  return new RegExp(fullExp, "i");
}