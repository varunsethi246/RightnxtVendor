import './catgBulkUpload.html';
import '../progressBar/progressBar.js';

import { Categories } from '/imports/api/masterData/categoriesMaster.js';

// Meteor.subscribe('categories'); 

Template.catgBulkUpload.onCreated( () => {
  	Template.instance().uploading = new ReactiveVar( false );
});


Template.catgBulkUpload.helpers({
  
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
          // console.log('showProgressBar: ' + showProgressBar);
        }else{
            var showProgressBar = {
                'uploadingFinished' : false,
                'elapsedTime'     : 0,
                'totalRecords'    : 0,
            }      
        }
        return showProgressBar;
    },

	'allDailyOrder' : function () {
		// console.log('hi');
		var showData  = DailyOrder.find({});
		// console.log(showData);
		// var Data = ClientMaster.findOne({"_id":showData});
		return showData;
	},
});

Template.catgBulkUpload.events({
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
	// 'click #submitBulk' : function(event, template){
		// console.log('bulk upload');
		Session.set('elapsedTime', 0 );
	    Session.set('totalRecords', 0);
    	var beforeTime = new Date().valueOf();
    	template.uploading.set( true );
    	// console.log(event.target.files[0]);
		Papa.parse( event.target.files[0], {
		    header: true,
		    complete( results, file ) {
		    	Meteor.call( 'CSVUpload', results.data, ( error, result ) => {
         			if ( error ) {
            			Bert.alert( error.reason, 'warning' );
         			} else {
         				  // template.uploading.set( false );
                  console.log('results: ' , results);
           				Bert.alert( 'Upload complete!', 'success', 'growl-top-right' );
                  event.currentTarget.value = '';
                  // var afterTime = new Date().valueOf();
                  // var elapsedTime = afterTime - beforeTime;      
                  // console.log('elapsedTime: ' +(elapsedTime/1000) + 'sec' );
                  // Session.set('elapsedTime',elapsedTime);
                  // Session.set('totalRecords',results.data.length);
         			}
      			});
		    }
      	});

	},
});

