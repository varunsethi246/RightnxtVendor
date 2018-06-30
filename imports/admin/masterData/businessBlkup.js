import './businessBlkup.html';
import '../progressBar/progressBar.js';
import '/imports/admin/commonAdmin/commonAdmin.js';
import '../progressBar/progressBar.js';

import { Business } from '/imports/api/businessMaster.js';

// Meteor.subscribe('categories'); 

Template.businessBlkup.onCreated( () => {
    Template.instance().uploading = new ReactiveVar( false );
});


Template.businessBlkup.helpers({
  
  uploading() {
    return Template.instance().uploading.get();
  },

  showProgressBar() {
    
    var elapsedTime   = Session.get('elapsedTime');
    var requiredelapsedTime = (elapsedTime/1000);
    var totalRecords  = Session.get('totalRecords');

    if (elapsedTime > 0) {
      var showProgressBar = {
        'uploadingFinished' : true,
        'elapsedTime'     : elapsedTime,
        'requiredelapsedTime' : requiredelapsedTime,
        'totalRecords'    : totalRecords,
      }
    }else{
      var showProgressBar = {
        'uploadingFinished' : false,
        'elapsedTime'     : 0,
        'totalRecords'    : 0,
      }      
    }
    
    return showProgressBar;
  },
});

Template.businessBlkup.events({
  'click .idShowDetails' : function (event) {
    var id = this._id;
    FlowRouter.go('/dailyOrdersShow/:sid',{'sid': id});
  },

  'click .idDelDailyOrderBlk' : function (events) {
    event.preventDefault();
    var sampleFormId = this._id; 
    Session.set("sessionIdDOBlk",this._id);
    
  },

  'click #delDailyOrderBlkRec' : function (events) {
    event.preventDefault();
    var sampleFormId1 = Session.get("sessionIdDOBlk");
    
    Meteor.call('removeDailyOrder',sampleFormId1);
  },

  'change [Name=upCatgBlk]' : function(event, template){
    Session.set('elapsedTime', 0 );
      Session.set('totalRecords', 0);
      var beforeTime = new Date().valueOf();
      template.uploading.set( true );

    Papa.parse( event.target.files[0], {
        header: true,
        complete( results, file ) {
          Meteor.call( 'BussCSVUpload', results.data, ( error, result ) => {
              if ( error ) {
                  Bert.alert( error.reason, 'warning' );
              } else {
                  // console.log('results: ' , results);
                  Bert.alert( 'Upload complete!', 'success', 'growl-top-right' );
                  event.currentTarget.value = '';
              }
            });
        }
        });

  },
});

businessBlkupForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'businessBlkup'});
}

export { businessBlkupForm }