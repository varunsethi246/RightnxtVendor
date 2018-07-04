import './myBusinessAdmin.html';
import './listOfBusiness.html';
import './addImagesVidAdmin.html';
import './openCloseDayAdmin.html';
import './aboutOwnerAdmin.html';
import './addNewBusInfoAdmin.html';
import './editBusinessAdmin.html';
import '/imports/admin/commonAdmin/commonAdmin.js';
import '/imports/vendor/mybusiness/AboutBusiness/AboutBusiness.js';
import '/imports/vendor/mybusiness/AboutBusiness/VendorBusinessInformation.js';
import '/imports/vendor/mybusiness/AboutBusiness/VendorOpeningAndClosing.js';
import '/imports/vendor/mybusiness/AboutBusiness/vendorAboutOwner.js';
import '/imports/vendor/mybusiness/AboutBusiness/VendorImagesVideos.js';
import '/imports/vendor/AddNewBusiness/addvendorBusInfo.js';
import '/imports/common/starRating2.html';
import '/imports/vendor/AddNewBusiness/AddvendorOpeningAndClosing.js'
import '/imports/vendor/AddNewBusiness/AddvendorAboutOwner.js'
import '/imports/vendor/AddNewBusiness/AddvendorImagesVideos.js'



import { Business } from '/imports/api/businessMaster.js';
import { State } from '../../api/masterData/stateMaster.js';
import { City } from '../../api/masterData/cityMaster.js';
import { Area } from '../../api/masterData/areaMaster.js';
import { users } from '../../api/userMasterAPI.js';
import { BusinessImgUploadS3 } from '/client/cfsjs/businessImage.js';
import { BusinessMenuUpload } from '/client/cfsjs/businessMenu.js';
import { BusinessVideoUpload } from '/client/cfsjs/businessVideo.js';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { BizVideo } from '/imports/videoUploadClient/videoUpload.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';



var videoListCount = 0;

var files = [];
var filesM = [];
var filesV = [];
var filesO = [];
var counterImg = 0;
var counterMenu = 0;

var searchButton = 0;

var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};

var fields = ['businessTitle'];

listbusinessSearchVar = new SearchSource('listbusinessSearch', fields, options);

Template.listOfBusiness.onRendered( ()=>{
	Session.set('businessListLimit',10);
	files = [];
	filesM = [];
	counterImg = 0;
	counterMenu = 0;
	videoListCount = 0;
});

Template.listOfBusiness.onCreated(function() {
    this.currentUpload = new ReactiveVar(false);
    this.subscribe('getBizVideo');
});

Template.listOfBusiness.helpers({
	currentUpload: function() {
        return Template.instance().currentUpload.get();
    },

    files: function() {
		var businessLink = FlowRouter.getParam('businessLink');
    	var bussData = Business.findOne({"businessLink":businessLink});
    	if(bussData){
	        var data = BizVideo.find({"_id":bussData.businessVideo}).fetch();
	        return data;
	    }
    },
	'Details' : function(){
    	var businessCount  = Counts.get('noOfBusiness');
    	console.log('businessCount :',businessCount);
    	if (businessCount > 15) {
	        $('.loadMoreRows50').addClass('showMore50').removeClass('hideMore50');
		}else if(businessCount > 50){
			$('.loadMoreRows100').addClass('loadMoreRows100').removeClass('hideMore50');
		}else if(businessCount > 100){
			$('.loadMoreRows100').addClass('loadMoreRowsRest').removeClass('hideMore50'); 
		}else{
			$('.loadMoreRows50').removeClass('showMore50').addClass('hideMore50');
			$('.loadMoreRows50').removeClass('loadMoreRows100').addClass('hideMore50');
			$('.loadMoreRows50').removeClass('loadMoreRowsRest').addClass('hideMore50');
		}

		var listLimit = Session.get('businessListLimit');
		var setValue = Session.get('busListAct');
		var data = {};
		if(listLimit == 0){
			if(setValue == 'activeList') {
				data = Business.find({"status":"active"},{sort:{'createdAt': -1}, limit: listLimit}).fetch();
			} else {
				data = Business.find({"status":"inactive"},{sort:{'createdAt': -1}, limit: listLimit}).fetch();
			}
		}else{
			if(setValue == 'activeList') {
				data = Business.find({"status":"active"},{sort:{'createdAt': -1}, limit: listLimit}).fetch();
			} else {
				data = Business.find({"status":"inactive"},{sort:{'createdAt': -1}, limit: listLimit}).fetch();
			}
		}
		 
		// console.log('data ', data);
		if(data){
			for(i=0; i< data.length; i++){
				var createdBy = Meteor.users.findOne({"_id":data[i].createdBy});
				// console.log('createdBy :',createdBy);
				if(createdBy){
					data[i].userEmailID = createdBy.emails[0].address;
					data[i].userEmailIDVal = true;
					if(createdBy.profile.name){
						data[i].createdBy = createdBy.profile.name;
					}else{
						data[i].createdBy = createdBy.emails[0].address;
					}
				}else{
					data[i].createdBy = 'admin';
					data[i].userEmailIDVal = false;
				}
				// for (var j = 0; j < data[i].createdBy.length; j++) {
				// 	for (var k = 0; k < data[i].createdBy[j].roles.length; k++) {
						
				// 	console.log('data[i].createdBy[j].roles',data[i].createdBy[j].roles[0]);
				// 	}
				// }
				// 	console.log('staff :',data[i].createdBy.roles);

				// if (data[i].createdBy.roles == 'Staff') {
				// 	console.log('staff :',data[i].createdBy.roles);
				// 	data[i].createdByStaff == 'staffCreatedy';
				// }

				if(data[i].status == "inactive"){
					data[i].statusTooltipone = 'Activate';
				}else{
					data[i].statusTooltipone = 'Deactivate';
				}
				if(data[i].businessAnythingElse){
					data[i].businessAnythingElseShow = "adminBusListAnythEls";
				}else{
					data[i].businessAnythingElseShow = "";
				}
	  		}
			// console.log('before return data ', data);
		      return data;
		}
		
	},
	'businessImgCount' : function(img){
		if(img){
			var count = img.length;
			if(count){
				return count;
			}else{
				return 0;
			}
		}else{
			return 0;
		}
	},
	'businessMenuCount' : function(img){
		if(img){
			var count = img.length;
			if(count){
				return count;
			}else{
				return 0;
			}
		}else{
			return 0;
		}
	},
	'businessVideos' : function(video){
		if(video){
			if(video != 0 ){
				return 1;
			}else{
				return 0;
			}
		}else{
			return 0;
		}
	},
	'ownerImg' : function(img){
		if(img){
			return 1;
		}else{
			return 0;
		}
	},
	
	'showStatus' : function(status){
		if(status == 'active'){

			return true;

		}else{
			return false;
		}
	},
});

Template.listOfBusiness.events({
	'change #fileInputs'(e, template) {
	    if (e.currentTarget.files && e.currentTarget.files[0]) {
	    		var businessLink  = $(e.currentTarget).attr("data-businessLink");
	    		// console.log('data-businessLink ',businessLink);
		      // We upload only one file, in case
		      // multiple files were selected
		      const upload = BizVideo.insert({
		        file: e.currentTarget.files[0],
		        streams: 'dynamic',
		        chunkSize: 'dynamic'
		      }, false);

		      upload.on('start', function () {
		        template.currentUpload.set(this);
		      });

		      upload.on('end', function (error, fileObj) {
		        if (error) {
		          alert('Error during upload: ' + error);
		        } else {
		          // alert('FilBee "' + fileObj._id + '" successfully uploaded');
		          Bert.alert('Business Video uploaded','success','growl-top-right');
		          	Meteor.call("updateVendorBulkVideo", businessLink,fileObj._id,
			          function(error, result) { 
			              if(error) {
			                  console.log ('Error Message: ' +error ); 
			              }else{
								  // process.exit();
								  
			              }
			        });
		        }
		        template.currentUpload.set(false);
		      });

		      upload.start();
		    }
	    // }
	},
	'click #reviewedstatusId': function(event){
		var busComment = $(event.currentTarget).parent().siblings('.adminReviewBusText').val();
		if(busComment){
			busComment = busComment.trim();
		}

		var busId = $(event.currentTarget).attr('data-busID');
		if(busId){
			Meteor.call('updateBusReviewComment', busId, busComment, function(error,result){
				if(error){
					//Do something
				} else {
					$('.modal-backdrop').hide();
				}
			});
		}
	},
	'click .rejectBusiness': function(event){
		var busComment = $(event.currentTarget).parent().siblings('.adminReviewBusText').val();
		if(busComment){
			busComment = busComment.trim();
		}

		var busId = $(event.currentTarget).attr('data-inactiveBusID');
		console.log('busId:',busId);
		if(busId){
			Meteor.call('updateBusInactivate', busId, busComment, function(error,result){
				if(error){
					//Do something
				} else {
					$('.modal-backdrop').hide();
				}
			});
		}
	},
	'change #businessImgfiles' : function(event){
		// alert('testing');
		$('#drag1').hide();
		var file = event.target.files; // FileList object\
		for(var j = 0 , f1;f1 = file[j]; j++){
			files[counterImg] = file[j];
			counterImg = counterImg + 1;
		}
		// Loop through the FileList and render image files as thumbnails.
		
		for (var i = 0, f; f = file[i]; i++) {
			file[i].businessLink = Session.get('SessionBusinessLink');
			
		    // Only process image files.
		    if (!f.type.match('image.*')) {
		      continue;
			}

			var reader = new FileReader();
			
			// Closure to capture the file information.
		    reader.onload = (function(theFile) {
		      return function(e) {
		        // Render thumbnail.

		        var span = document.createElement('span');
		        span.innerHTML = ['<img class="draggedImg" src="', e.target.result,
		                          '" title="', escape(theFile.name), '"/>'].join('');
		        document.getElementById('businessImglist').insertBefore(span, null);
		        
		      };
		    })(f); //end of onload


		    // Read in the image file as a data URL.
		    reader.readAsDataURL(f);
		    
		}// end of for loop

	},

	'click #saveBusinessImg' : function(event){
		var businessLink = $(event.target).attr('data-Link');
				        	console.log('businessLink ',businessLink);
		
		// var businessLink = FlowRouter.getParam('businessLink');
		for(i = 0 ; i < files.length; i++){

			Resizer.resize(files[i], {width: 300, height: 300, cropSquare: false}, function(err, file) {
				if(err){
					console.log('err ' , err.message);
				}else{
				
					BusinessImgUploadS3.insert(file, function (err, fileObj) {
				        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
				        // console.log("fileObj",fileObj);
				        if(err){
				        	console.log('Error : ' + err.message);
				        }else{
				        	// var businessLink = FlowRouter.getParam('businessLink');
				        	// console.log('businessLink ',businessLink);
				        	var imgId =  fileObj._id ;
					        Meteor.call("updateVendorBulkImg", businessLink,imgId,
					          function(error, result) { 
					              if(error) {
					                  console.log ('Error Message: ' + error ); 
					              }else{
									console.log('img upload ', fileObj._id);	
					              }

					        });

				        }
				    });
				}
			});
		}
		$('#businessImglist').empty();
		$('#drag1').show();
		counterImg = 0;
		files=[];
		$('#businessImgfiles').val('');
	},

	'change #businessMenufiles' : function(event){
		$('#drag1').hide();
		var file = event.target.files; // FileList object\
		for(var j = 0 , f1;f1 = file[j]; j++){
			filesM[counterMenu] = file[j];
			counterMenu = counterMenu + 1;
		}
		// Loop through the FileList and render image files as thumbnails.
		
		for (var i = 0, f; f = file[i]; i++) {
			file[i].businessLink = Session.get('SessionBusinessLink');
			
		    // Only process image files.
		    if (!f.type.match('image.*')) {
		      continue;
			}

			var reader = new FileReader();
			
			// Closure to capture the file information.
		    reader.onload = (function(theFile) {
		      return function(e) {
		        // Render thumbnail.

		        var span = document.createElement('span');
		        span.innerHTML = ['<img class="draggedImg" src="', e.target.result,
		                          '" title="', escape(theFile.name), '"/>'].join('');
		        document.getElementById('businessMenulist').insertBefore(span, null);
		        
		      };
		    })(f); //end of onload


		    // Read in the image file as a data URL.
		    reader.readAsDataURL(f);
		    
		}// end of for loop

	},

	'click #saveBusinessMenu' : function(event){
		var businessLink = $(event.target).attr('data-Link');
				        	console.log('businessLink ',businessLink);

		
		// var businessLink = FlowRouter.getParam('businessLink');
		for(i = 0 ; i < filesM.length; i++){

			Resizer.resize(filesM[i], {width: 300, height: 300, cropSquare: false}, function(err, file) {
				if(err){
					console.log('err ' , err.message);
				}else{
				
					BusinessMenuUpload.insert(file, function (err, fileObj) {
				        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
				        if(err){
				        	console.log('Error : ' + err.message);
				        }else{
				        	
				        	var imgId =  fileObj._id ;
				        	// console.log('businessLink ',businessLink);
				        	// console.log('imgId ',imgId);
					        Meteor.call("updateVendorBulkMenu", businessLink,imgId,
					          function(error, result) { 
					              if(error) {
					                  console.log ('Error Message: ' + error ); 
					              }else{
									// console.log('result ',result);

					              }

					        });
					        // Bert.alert('Business Menus added','success','growl-top-right');
				        }
				    });
				}
			});
		}
		$('#businessMenulist').empty();
		$('#drag3').show();
		counterMenu = 0;
		filesM=[];
		$('#businessMenulist').val('');
	},

	'change #businessVideofiles' : function(event){
		$('#drag2').hide();
		 filesV = event.target.files; // FileList object
		 console.log('filesV ', filesV.length);
		 if(filesV.length > 1 ){
		 	Bert.alert('Only One can be upload','danger','growl-top-right');
			$('#businessVideofiles').val('');
				return;
		 }
		// Loop through the FileList and render image files as thumbnails.
		var f = filesV[0];
		
			var reader = new FileReader();
			
			// Closure to capture the file information.
		    reader.onload = (function(theFile) {
		      return function(e) {
		        // Render thumbnail.

		        var span = document.createElement('span');
		        span.innerHTML = ['<video class="draggedImg">' +
		        				 	'<source src="'+ e.target.result + '" title="'+escape(theFile.name)+'">' +
		        				 	'Browser not supporting' + 
		        				  '</video>'
		        				 ].join('');
		        document.getElementById('businessVideolist').insertBefore(span, null);
		        
		      };
		    })(f); //end of onload

		    // Read in the image file as a data URL.
		    reader.readAsDataURL(f);
		$('#editbusinessVideolist').empty();
		    
		// }// end of for loop
	},

	'click #saveBusinessVideo' : function(event){
		var businessLink = $(event.target).attr("data-id");
		console.log('businessLink ',businessLink);
		BusinessVideoUpload.insert(filesV[0], function (err, fileObj) {
	        // Inserted new doc with ID fileObj._id, and kicked off the data upload using HTTP
	        if(err){
	        	console.log('Error : ' + err.message);
	        }else{
	        	var videoId =  fileObj._id ;
		        Meteor.call("updateVendorBulkVideo", businessLink,videoId,
		          function(error, result) { 
		              if(error) {
		                  console.log ('Error Message: ' +error ); 
		              }else{
							Bert.alert('Business Video added','success','growl-top-right');
		              }

		        });
	        }
	    });
		$('#businessVideolist').empty();	
		$('#drag2').show();
		filesV=[];
		$('#businessVideofiles').val('');

	},
	'change #businessOwnerPicturefiles' : function(event){
		$('#drag4').hide();
		 filesO = event.target.files; // FileList object
		 // console.log('filesO ', filesO.length);
		 if(filesO.length > 1 ){
		 	Bert.alert('Only One Picture can be upload','danger','growl-top-right');
			$('#businessOwnerPicturefiles').val('');
				return;
		 }
		// Loop through the FileList and render image files as thumbnails.
		var f = filesO[0];
		
		var reader = new FileReader();
		
		// Closure to capture the file information.
	    reader.onload = (function(theFile) {
	      return function(e) {
	        // Render thumbnail.

	        var span = document.createElement('span');
	        span.innerHTML = ['<img class="draggedImg" src="', e.target.result,
		                          '" title="', escape(theFile.name), '"/>'].join('');
	        document.getElementById('businessOwnerPicturelist').insertBefore(span, null);
	        
	      };
	    })(f); //end of onload

	    // Read in the image file as a data URL.
	    reader.readAsDataURL(f);
		$('#businessOwnerPicturelist').empty();
		    
	},

	'click #saveBusinessOwnerPicture' : function(event){
		var businessLink = $(event.target).attr("data-Link");
		console.log('businessLink ',businessLink);
		Resizer.resize(filesO[0], {width: 300, height: 300, cropSquare: false}, function(err, file) {
			if(err){
				console.log('err ' , err.message);
			}else{
		       	BusinessImgUploadS3.insert(file, function (err, fileObj) {
			        if (err){
			            console.log("Error : " + err.message);
			        } else {
			     		var filePath = fileObj._id;
		              	Meteor.call("updateBusinessAboutOwnerImage", businessLink, filePath,
		                function(error, result) { 
		                    if(error) {
		                    // Bert.alert('Error Message: ' +error.reason ); 
		                    }else{
			                    Bert.alert( 'Image Updated successfully!!!!', 'success', 'growl-top-right' );
		                    }
		                });
			        }
			    });
 			}
 		});
		$('#businessOwnerPicturelist').empty();	
		$('#drag4').show();
		filesO=[];
		$('#businessOwnerPicturefiles').val('');

	},

	'click .loadMoreRows50': function(event){
		 event.preventDefault();
		$('.spinner').hide();
		$('.loadMoreRows50 .spinner').show();
		var nextLimitBus50 = Session.get('businessListLimit');
		if(nextLimitBus50 != 0){
			var nextLimit = Session.get('businessListLimit') + 50;
			Session.set('businessListLimit',nextLimit);
		}
		
	},

	'click .loadMoreRows100': function(event){
		 event.preventDefault();
		$('.spinner').hide();
		$('.loadMoreRows100 .spinner').show();
		var nextLimitBus100 = Session.get('businessListLimit');
		if(nextLimitBus100 != 0){
			var nextLimit = Session.get('businessListLimit') + 100;
			Session.set('businessListLimit',nextLimit);
		}
	},

	'click .loadMoreRowsRest': function(event){
		 event.preventDefault();
		$('.spinner').hide();
		$('.loadMoreRowsRest .spinner').show();
		var nextLimit = 0;
		Session.set('businessListLimit',nextLimit);
	},
	'keyup #searchBusiness': _.throttle(function(event) {
		 event.preventDefault();
		var searchText = event.currentTarget.value;
		var filter = searchText.toUpperCase();
		var table = document.getElementById("businessListTable");
		var tr = table.getElementsByTagName("tr");

		  // Loop through all table rows, and hide those who don't match the search query
		if(tr){
		  for (var i=0; i<tr.length; i++) {
		    var td = tr[i].getElementsByTagName("td")[0];
		    if(td) {
		      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
		        tr[i].style.display = "";
		      } else {
		        tr[i].style.display = "none";
		      }
		    } 
		  }
		}

	}, 200),

	'click .deleteBusiness': function(event){
	   event.preventDefault();

		var modelid = $(event.target).parent().parent().parent().parent().parent().attr('id');
		var id  = modelid.split("-");
		var businessIdS = $(event.currentTarget).attr("data-vendorId");
		console.log('businessIdS :',businessIdS);
		var vendorId  = Business.findOne({'_id':businessIdS});
		console.log('vendorId',vendorId);
		var vendoriDS = vendorId.createdBy;
		var businessTitle = $(event.currentTarget).attr("data-busTitle");
		var businessLink = $(event.currentTarget).attr("data-busLink");
		// console.log('delete id ' + id[1]);
		Meteor.call('removeBusinessPermanent',id[1],function(error,result){
			if(error){
				Bert.alert(error.reason,"danger",'growl-top-right');
			}else{
				Bert.alert('Business is deleted','success','growl-top-right');

				var admin = Meteor.users.findOne({'roles':'admin'});
				var vendorDetail = Meteor.users.findOne({'_id':vendoriDS});
				console.log('vendorDetail :',vendorDetail);
				var vendorids = vendorDetail._id;
				// var notificationOn = vendorDetail.notificationConfiguration;

				// console.log('notificationOn:',notificationOn);

				if(admin&&vendorDetail){
			    	var adminId = admin._id;

					//Send Notification, Mail and SMS to Current Vendor
					var vendorname 	= vendorDetail.profile.name;
					var username 	= admin.profile.firstName;

            		var date 		= new Date();
            		var currentDate = moment(date).format('DD/MM/YYYY');
            		var msgvariable = {
						'[vendorname]' 	: vendorname,
	   					'[currentDate]'	: currentDate,
						'[businessName]': businessTitle

	               	};

					var inputObj = {
						notifPath	 : businessLink,
					    to           : vendorids,
					    templateName : 'Delete Business Admin',
					    variables    : msgvariable,
					}
					// console.log('inputObj :',inputObj);
					
					sendInAppNotification(inputObj);

					var inputObj = {
						notifPath	 : businessLink,
						from         : adminId,
					    to           : vendorids,
					    templateName : 'Delete Business Admin',
					    variables    : msgvariable,
					}
					// console.log('inputObj :',inputObj);
					sendMailNotification(inputObj);
				}
				$('.fade').hide();
			}
		});
	},
	'click .delete': function(event){
	   	event.preventDefault();

		var modelid = $(event.target).parent().parent().parent().parent().parent().attr('id');
		var id  = modelid.split("-");
		// console.log('delete id ' + id[1]);
		Meteor.call('deleteBusiness',id[1],function(error,result){
			if(error){
				Bert.alert(error.reason,"danger",'growl-top-right');
			}else{
				Bert.alert('Business Inactived','success','growl-top-right');
			}
				$('.fade').hide();	
		});
	},

	'click .actInactAdminOn':function(event) {
	   	event.preventDefault();

		Session.set('busListAct','activeList');
		$('.actInactAdminC').removeClass('actInactAdminColor');
		$('.actInactAdminOn').addClass('actInactAdminColor');
		$('.actInactAdminOn').addClass('bussTabletwo');
	},
	'click .actInactAdminTw':function(event) {
	   	event.preventDefault();
		Session.set('busListAct','inactiveList');
		$('.actInactAdminC').removeClass('actInactAdminColor');
		$('.actInactAdminTw').addClass('actInactAdminColor');
	},

	'click .inactiveStatus': function(event){
	  	event.preventDefault();
		var businessId = $(event.target).attr('id');
		var recId = businessId.split('-');
		Meteor.call('updateBusinessStatusActive',recId[1],"active",function(error,result){
			if(error){
				Bert.alert(error.reason,"danger",'growl-top-right');
			}else{
				Bert.alert('BusinessActivated','success','growl-top-right');
				$('.modal-backdrop').hide();
			}
		});
	},

	'click .activeStatus': function(event){
	   event.preventDefault();
		var businessId = $(event.target).attr('id');
		var recId = businessId.split('-');
		Meteor.call('updateBusinessStatusInactive',recId[1],"inactive" );
	},

	// ===========tooltip===============
	
	// 'mouseover .fa-circle':function(event){
	// 	event.preventDefault();
	// 	$('.fa-circle').tooltip({title: "Inactive", trigger: "hover"});
	// },
	
	// 'mouseover .fa-check-circle-o':function(event){
	// 	event.preventDefault();
	// 	$('.bussDeleted').tooltip({title: "Active", trigger: "hover"});
	// },


// });

	// 'mouseover .showTooltipBussList': function(event){
	// 	$(event.currentTarget).siblings('.newTooltipBuss').show();
	// },

	// 'mouseout .showTooltipBussList': function(event){
	// 	$(event.currentTarget).siblings('.newTooltipBuss').hide();
	// },
	// 'mouseover .showTooltipOneList': function(event){
	// 		$(event.currentTarget).siblings('.newtooltipList').show();
	// 	},
	// 'mouseout .showTooltipOneList': function(event){
	// 	$(event.currentTarget).siblings('.newtooltipList').hide();
	// },

});

Template.listOfBusiness.onRendered(function(){
		$('.actInactAdminOn').addClass('actInactAdminColor');
		Session.set('busListAct','activeList');
		$("html,body").scrollTop(0);
});

listOfBusinessForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'listOfBusiness'});
}
export { listOfBusinessForm }

editBusinessAdminForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'editBusinessAdmin'});
}
export { editBusinessAdminForm }

addNewBusInfoAdminForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'addNewBusInfoAdmin'});
}
export { addNewBusInfoAdminForm }

openCloseDayAdminForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'openCloseDayAdmin'});
}
export { openCloseDayAdminForm }

aboutOwnerAdminForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'aboutOwnerAdmin'});
}
export { aboutOwnerAdminForm }

addImagesVidAdminForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'addImagesVidAdmin'});
}
export { addImagesVidAdminForm }

