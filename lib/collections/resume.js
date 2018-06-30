// FS.debug = true;

var resumeStore = new FS.Store.FileSystem("resume", {path: process.env.PWD + '/public/resume'}); 

Resume = new FS.Collection("resume", {
  stores: [resumeStore]
});

// Images = new FS.Collection("images", {
//   stores: [imageStore],
//   filter: {
//   maxSize: 3145728,
//   allow: {
//     contentTypes: ['image/*'],
//     extensions: ['png', 'PNG', 'jpg', 'JPG', 'jpeg', 'JPEG']
//   }
//   }
// });

Resume.allow({
  insert: function() {
    return true;
  },
  update: function() {
    return true;
  },
  remove: function() {
    return true;
  },
  download: function() {
    return true;
  }
});


Resume.deny({
  insert: function() {
    return false;
  },
  update: function() {
    return false;
  },
  remove: function() {
    return false;
  },
  download: function() {
    return false;
  }
});

if (Meteor.isServer) {

Meteor.publish('resume', function() {
  return Resume.find({}, { limit: 0 });
});
}