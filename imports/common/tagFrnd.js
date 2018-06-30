var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
// var fields = ['profile.name' , 'emails[0].address'];
var fields = ['profile.name'];

tagFriend1 = new SearchSource('tagFriend', fields, options);
// var tagedFriends = [];
tagedFriends = [];