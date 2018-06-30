import { Session } from 'meteor/session';


import './companyInfo.html';
import { TempLogoImage } from '/imports/api/companysettingsAPI.js';

Meteor.subscribe('tempLogoImage');

Template.companyInfo.events({
	 'change .imgBrowse': function(event){
      event.preventDefault();
      
      

      /*--------------Code form Logo Image-----------*/ 
      var file = event.target.files[0];  //assuming you have only one file
      var render = new FileReader(); //this works only in html5
        render.onload =function(event){
           var fileData = render.result;  
           var fileName = file.name;
           Meteor.call('tempLogoImageUpload', fileName, fileData);  
        };
        render.readAsDataURL(file);
      },
});


Template.companyInfo.helpers({
	"tempLogoimage" : function(){
  
    var logoImage = TempLogoImage.find({}).fetch();
      return logoImage.map(function (d, i) {
          d._index = i + 1;
          return d;
      });

  },
});