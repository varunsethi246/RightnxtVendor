import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Notification } from '/imports/api/notification.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


import './adminLayout.html';
import './adminHeader.html';
import './adminSidebar.html';
import './adminFooter.html';
import './ViewAllNotif.html';
import '../../vendor/vendor.js';
import '../../userarea/userLayout.html';
import '../../userarea/userLayout.js';
import '../../general/homepage/homepage.js'


Template.adminHeader.helpers({
    'notifVal': function(){
      // var userId = Meteor.userId();
      // console.log('userId :', userId);
      var notifDetails = Notification.find({'toUserId': Meteor.userId()},{sort:{'date':-1}}).fetch();
	    if(notifDetails){
	      var notifArray = [];
	      for(i=0 ; i<notifDetails.length ; i++){
	        var statusClass = '';
	        if(notifDetails[i].status == "Read"){
	        statusClass = 'statusColor';
	        }else{
	        	statusClass = 'statusColorBar'
	        }
	        var notificationBody = notifDetails[i].notifBody;
	        // var notif;
	        // if(notificationBody){
	        // 	notif = notificationBody.slice(0,40);
	        // }
	        // var createdAt =  moment(notifDetails[i].createdAt).fromNow();
	        // var notif = notificationBody.slice(0,40);
	        var createdAt =  moment(notifDetails[i].date).fromNow();
	        // console.log('createdAt one: ',createdAt);

	        notifArray.push({
	          'id'              : notifDetails[i]._id,
	          'notificationId'  : notifDetails[i].notificationId,
	          'notifBody'       : notificationBody,
	          'status'          : notifDetails[i].status,
	          'date'            : notifDetails[i].date,
	          'statusBackground': statusClass,
	          'timestamp'       : notifDetails[i].timestamp,
	          'createdAt'		: createdAt,
	        })

	      }//i
	    }//notifDetails
      return notifArray;

    },

    'notifcount': function(){
      // var userId = Meteor.userId();
      var notifDetails = Notification.find({'toUserId': Meteor.userId(),'status':'unread'}).fetch();
        if(notifDetails){
          var notifCount = Notification.find({'toUserId': Meteor.userId(),'status':'unread'}).count();
        }
        // console.log('notifDetails:', notifDetails);
      return notifCount;
    },

});


Template.ViewAllNotif.helpers({
  'notifRes':function(){
    // var userId = Meteor.userId();
      	var userId = Meteor.userId();
      	
		var userDetail = Meteor.users.findOne({'_id':userId});
		var notifArr = ["Vendor Modal Image Report", "Vendor Modal Image Report", "business-report-acknowledged", "business-image-report-acknowledged", "User Modal Image Report", "Admin Business Page Modal Report", "Admin Business Page Modal Report", "Vendor Business Page Bookmark", "Vendor Business Page Bookmark", "User Business Page Bookmark", "Vendor Business Page Been There", "Vendor Business Page Been There", "User Business Page Been There", "Business Page Share", "Vendor Business Page Report", "Vendor Business Page Report", "Vendor Business Page Report", "User Business Page Report", "Admin Business Page Report", "Admin Business Page Report", "You have been Tagged", "You have been Tagged", "Delete Business Admin", "Delete Business Admin", "Delete Business Vendor", "Delete Business Vendor", "Anything Else Business Admin", "Anything Else Business Admin", "Thanks for Submiting Offer", "Thanks for Submiting Offer", "Vendor has Submiting Offer", "Vendor has Submiting Offer", "Payment Received", "Payment Received", "Vendor Paid for Offer", "Vendor Paid for Offer", "Offer Deleted", "Offer Deleted", "Vendor deleted Offer", "Vendor deleted Offer", "Vendor Message Send", "Thanks for Registering New Business", "Thanks for Registering New Business", "Vendor Added New Business", "Vendor Added New Business"];

		if(userDetail.notificationConfiguration){
			if(userDetail.notificationConfiguration.enquiry == "true"){
				var arr = ["Vendor Business Enquiry", "Vendor Business Enquiry", "Vendor Business Enquiry", "User Business Enquiry", "Enquiry Message Send", "User Business Enquiry All"];
				for(j=0;j<arr.length;j++){
					notifArr.push(arr[j]);
				}
			}
			if(userDetail.notificationConfiguration.rating == "true"){
				var arr = ["Vendor Review and Rating", "Vendor Review and Rating", "User Review and Rating", "User Added Review and Rating", "User Added Review and Rating", "Business Page Review Share", "Business Page Review Share"];
				for(j=0;j<arr.length;j++){
					notifArr.push(arr[j]);
				}
			}
			if(userDetail.notificationConfiguration.follow == "true"){
				var arr = ["Follow User Other", "Follow User Other", "Follow User Current"];
				for(j=0;j<arr.length;j++){
					notifArr.push(arr[j]);
				}
			}
			if(userDetail.notificationConfiguration.like == "true"){
				var arr = ["Vendor Modal Image Like", "Vendor Modal Image Like", "User Modal Image Like", "Vendor Modal Image Comment Like", "Vendor Modal Image Comment Like", "User Modal Image Added Comment Like", "User Modal Image Added Comment Like", "User Modal Image Comment Like", "Vendor Modal Image Comment Reply Like", "Vendor Modal Image Comment Reply Like", "User Modal Image Added Comment Reply Like", "User Modal Image Added Comment Reply Like", "User Modal Image Added Comment SubReply Like", "User Modal Image Added Comment SubReply Like", "User Modal Image Comment SubReply Like", "Vendor Business Page Like", "Vendor Business Page Like", "User Business Page Like", "Vendor Review and Rating Like", "Vendor Review and Rating Like", "Other User Review and Rating Like", "Other User Review and Rating Like", "Current User Review and Rating Like", "Vendor Review Comment Like", "Vendor Review Comment Like", "User Comment Review and Rating Like", "User Comment Review and Rating Like", "User Review Comment Like", "User Review Comment Like", "Current User Review Comment Like", "Vendor Review Comment SubReply Like", "Vendor Review Comment SubReply Like", "User Added Review and Rating SubReply Like", "User Added Review and Rating SubReply Like", "User Review Comment SubReply Like", "User Review Comment SubReply Like", "User Added Review Reply SubReply Like", "User Added Review Reply SubReply Like", "Current User Review Comment Reply Like"];
				for(j=0;j<arr.length;j++){
					notifArr.push(arr[j]);
				}
			}
			if(userDetail.notificationConfiguration.comment == "true"){
				var arr = ["Vendor Modal Image Comment", "Vendor Modal Image Comment", "User Modal Image Comment", "Vendor Modal Image Comment Reply", "Vendor Modal Image Comment Reply", "User Modal Image Added Comment Reply", "User Modal Image Added Comment Reply", "User Modal Image Comment Reply", "Vendor Review and Rating Comment", "Vendor Review and Rating Comment", "Other User Review and Rating Comment", "Other User Review and Rating Comment", "Current User Review and Rating Comment", "Vendor Review Comment Reply", "Vendor Review Comment Reply", "User Review Comment", "User Review Comment", "Current User Review Comment Reply"];
				for(j=0;j<arr.length;j++){
					notifArr.push(arr[j]);
				}
			}
		}
		var notificationLocs = notifArr.map(function(x) { return x } );
	    var notifDetails = Notification.find({'toUserId': Meteor.userId(), 'event': {"$in": notificationLocs}},{sort:{'date':-1}}).fetch();
        if(notifDetails){
        	var notifCount = Notification.find({'toUserId': Meteor.userId(), 'event': {"$in": notificationLocs}}).count();
        	var notifArray = [];
          for(i=0 ; i<notifCount ; i++){
            var statusClass = '';
            if(notifDetails[i].status == "Read"){
            statusClass = 'statusColor';
             }else{
	        	statusClass = 'statusColorBar'
	        }
	        var createdAt =  moment(notifDetails[i].date).fromNow();
            notifArray.push({
              'id'              : notifDetails[i]._id,
              'event'           : notifDetails[i].event,
              'notifBody'       : notifDetails[i].notifBody,
              'status'          : notifDetails[i].status,
              'date'            : notifDetails[i].date,
              'timestamp'       : notifDetails[i].timestamp,
              'statusBackground': statusClass,
              'createdAt'       : createdAt,
            })
          }//i
        }//notifDetails
        console.log('notifArray :',notifArray);
      return notifArray;
  },
 //  'AllnotifCounts':function(){
	// var notifArr = ["Vendor Modal Image Report", 'Vendor Business Enquiry' ,"Vendor Modal Image Report","User Business Enquiry", "business-report-acknowledged", "business-image-report-acknowledged","User Business Enquiry All" ,'User Enquiry Message', "User Modal Image Report", "Admin Business Page Modal Report", "Admin Business Page Modal Report", "Vendor Business Page Bookmark", "Vendor Business Page Bookmark", "User Business Page Bookmark", "Vendor Business Page Been There", "Vendor Business Page Been There", "User Business Page Been There", "Business Page Share", "Vendor Business Page Report", "Vendor Business Page Report", "Vendor Business Page Report", "User Business Page Report", "Admin Business Page Report", "Admin Business Page Report", "You have been Tagged", "You have been Tagged", "Delete Business Admin", "Delete Business Admin", "Delete Business Vendor", "Delete Business Vendor", "Anything Else Business Admin", "Anything Else Business Admin", "Thanks for Submiting Offer", "Thanks for Submiting Offer", "Vendor has Submiting Offer", "Vendor has Submiting Offer", "Payment Received", "Payment Received", "Vendor Paid for Offer", "Vendor Paid for Offer", "Offer Deleted", "Offer Deleted", "Vendor deleted Offer", "Vendor deleted Offer", "Vendor Message Send", "Thanks for Registering New Business", "Thanks for Registering New Business", "Vendor Added New Business", "Vendor Added New Business"];
	// var notificationLocs = notifArr.map(function(x) { return x } );
 //    var notifDetails = Notification.find({'toUserId': Meteor.userId(),'status':'unread', 'event': {"$in": notificationLocs}}).count();
 //  	console.log(notifDetails);
 //  	if (notifDetails > 0) {
 //  		return true;
 //  	}else{
 //  		return false;
 //  	}
    
 //  }
});

Template.ViewAllNotif.events({
	'click .notifRowBunch': function(event){
		event.preventDefault();
	    var id = event.currentTarget.id;
	    Meteor.call('updateNotification', id,function(error, result){
	          if (error) {
	              console.log ( error ); 
	          } //info about what went wrong 
	          else {
	            // console.log("updated Successfully");
	          }
	    });
	},

	'click .fa-trash':function(){
	    var value = this;
	    var id = this.id;
	    Meteor.call('deleteNotification',id,function(error,result){
	      if(error){
	        console.log(error);
	      }else{
	        Bert.alert( 'Deleted Successfully!', 'success', 'growl-top-right' );
	      }
	    });
	    $('.modal-backdrop').hide();
	},
});

Template.adminHeader.events({
	'click .sidebar-toggle':function (){
		$(".adminPhoto").toggleClass("");
		$(".wrapper").toggleClass("toggled");
		$(".username").toggleClass("userDisplaynone");

	},
	
	'click .grears':function (){
		$(".reportWrapper").toggle();
	},

	'click #adminLogoutHeader': function(event){
		Meteor.logout(function(error,result){
			if(error){
				console.log(error);
				return;
			}else{
				FlowRouter.go('/');
				return;
			}
		});
	},

	'click .notifContent':function(event){
    event.preventDefault();
    var id = event.currentTarget.id;
    // console.log(id);
    var notifDetails = Notification.findOne({'_id':id});
    // console.log(notifDetails);

    Meteor.call('updateNotification', id,function(error, result){
          if (error) {
              console.log ( error ); 
          } //info about what went wrong 
          else {
            // console.log("updated Successfully");
          }
    });
    
  },
});
Template.adminSidebar.onRendered(function(){
	$('.wrapper').addClass('toggled');
});

Template.adminSidebar.events({
	'click #accordion1':function(){
		$("#listborder").removeClass('active');
		$(this).addClass('active');
	},
	
	'click .panelIcon':function(event){
		event.preventDefault();
		var icon = $(event.target);
		if(icon.hasClass('panelIcon')){
			icon.addClass('iconUP');
			if(icon.hasClass('iconUP')) {
				icon.children().next().next().removeClass('fa-angle-right');
				icon.children().next().next().addClass('fa-angle-down');
			}
			if($(icon).next().hasClass('in')){
				icon.children().next().next().addClass('fa-angle-right');
				icon.children().next().next().removeClass('fa-angle-down');	
			}
			$('.panelIcon').not(icon).children().next().next().removeClass('fa-angle-down');
			$('.panelIcon').not(icon).children().next().next().addClass('fa-angle-right');
		}else if($(icon).children().next()){
			icon.addClass('iconUP');
			if(icon.hasClass('iconUP')) {
				icon.next().removeClass('fa-angle-right');
				icon.next().addClass('fa-angle-down');
			}
			if($(icon).parent().next().hasClass('in')){
				icon.next().addClass('fa-angle-right');
				icon.next().removeClass('fa-angle-down');	
			}
			$('span').not(icon).next().removeClass('fa-angle-down');
			$('span').not(icon).next().addClass('fa-angle-right');
		}
	},	

	'click .menusidebarClass': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').toggleClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menusidebarClass7').removeClass('mymenucolorSelect');
		$('.menusidebarClass8').removeClass('mymenucolorSelect');
		
	},
	'click .menusidebarClassOne': function(){
		$('.menusidebarClassOne').toggleClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menusidebarClass7').removeClass('mymenucolorSelect');
		$('.menusidebarClass8').removeClass('mymenucolorSelect');
		
	},
	'click .menusidebarClass0': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');

		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').toggleClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menusidebarClass7').removeClass('mymenucolorSelect');
		$('.menusidebarClass8').removeClass('mymenucolorSelect');


	},
	'click .menusidebarClass1': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').toggleClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menusidebarClass7').removeClass('mymenucolorSelect');
		$('.menusidebarClass8').removeClass('mymenucolorSelect');

	},
	'click .menusidebarClass2': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').toggleClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menusidebarClass7').removeClass('mymenucolorSelect');
		$('.menusidebarClass8').removeClass('mymenucolorSelect');

		
	},
	'click .menusidebarClass3': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').toggleClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menusidebarClass7').removeClass('mymenucolorSelect');
		$('.menusidebarClass8').removeClass('mymenucolorSelect');

	},

	'click .menusidebarClass4': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').toggleClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menusidebarClass7').removeClass('mymenucolorSelect');
		$('.menusidebarClass8').removeClass('mymenucolorSelect');

	},

	'click .menusidebarClass5': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').toggleClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menusidebarClass7').removeClass('mymenucolorSelect');
		$('.menusidebarClass8').removeClass('mymenucolorSelect');

	},
	'click .menusidebarClass6': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').toggleClass('mymenucolorSelect');
		$('.menusidebarClass7').removeClass('mymenucolorSelect');
		$('.menusidebarClass8').removeClass('mymenucolorSelect');

	},

	'click .menusidebarClass7': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menusidebarClass7').toggleClass('mymenucolorSelect');
		$('.menusidebarClass8').removeClass('mymenucolorSelect');
		
	},
	'click .menusidebarClass8': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menusidebarClass7').removeClass('mymenucolorSelect');
		$('.menusidebarClass8').toggleClass('mymenucolorSelect');
	},
	
	'click .menuSubCat1': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');

		// $('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menuSubCat1').toggleClass('mymenucolorSelect');
		$('.menuSubCat2').removeClass('mymenucolorSelect');
		$('.menuSubCat3').removeClass('mymenucolorSelect');
		$('.menuSubCat4').removeClass('mymenucolorSelect');
		$('.menuSubCat5').removeClass('mymenucolorSelect');
		$('.menuSubCat6').removeClass('mymenucolorSelect');
		$('.menuSubCat7').removeClass('mymenucolorSelect');
		$('.menuSubCat8').removeClass('mymenucolorSelect');
		$('.menuSubCat9').removeClass('mymenucolorSelect');
		$('.menuSubCat10').removeClass('mymenucolorSelect');
		$('.menuSubCat11').removeClass('mymenucolorSelect');
		$('.menuSubCat12').removeClass('mymenucolorSelect');
		$('.menuSubCat13').removeClass('mymenucolorSelect');
		$('.menuSubCat14').removeClass('mymenucolorSelect');
		$('.menuSubCat15').removeClass('mymenucolorSelect');
		$('.menuSubCat17').removeClass('mymenucolorSelect');
		$('.menuSubCat18').removeClass('mymenucolorSelect');
		$('.menuSubCat19').removeClass('mymenucolorSelect');
		$('.menuSubCat20').removeClass('mymenucolorSelect');
		$('.menuSubCat16').removeClass('mymenucolorSelect');
		$('.menuSubCat21').removeClass('mymenucolorSelect');		
		

			
	},
	'click .menuSubCat2': function(){
		/*$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');*/
		$('.menuSubCat1').removeClass('mymenucolorSelect');
		$('.menuSubCat2').toggleClass('mymenucolorSelect');
		$('.menuSubCat3').removeClass('mymenucolorSelect');
		$('.menuSubCat4').removeClass('mymenucolorSelect');
		$('.menuSubCat5').removeClass('mymenucolorSelect');
		$('.menuSubCat6').removeClass('mymenucolorSelect');
		$('.menuSubCat7').removeClass('mymenucolorSelect');
		$('.menuSubCat8').removeClass('mymenucolorSelect');
		$('.menuSubCat9').removeClass('mymenucolorSelect');
		$('.menuSubCat10').removeClass('mymenucolorSelect');
		$('.menuSubCat11').removeClass('mymenucolorSelect');
		$('.menuSubCat12').removeClass('mymenucolorSelect');
		$('.menuSubCat13').removeClass('mymenucolorSelect');
		$('.menuSubCat14').removeClass('mymenucolorSelect');
		$('.menuSubCat15').removeClass('mymenucolorSelect');
		$('.menuSubCat17').removeClass('mymenucolorSelect');
		$('.menuSubCat18').removeClass('mymenucolorSelect');
		$('.menuSubCat19').removeClass('mymenucolorSelect');
		$('.menuSubCat20').removeClass('mymenucolorSelect');
		$('.menuSubCat16').removeClass('mymenucolorSelect');
		$('.menuSubCat21').removeClass('mymenucolorSelect');		



	},
	'click .menuSubCat3': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menuSubCat1').removeClass('mymenucolorSelect');
		$('.menuSubCat2').removeClass('mymenucolorSelect');
		$('.menuSubCat3').toggleClass('mymenucolorSelect');
		$('.menuSubCat4').removeClass('mymenucolorSelect');
		$('.menuSubCat5').removeClass('mymenucolorSelect');
		$('.menuSubCat6').removeClass('mymenucolorSelect');
		$('.menuSubCat7').removeClass('mymenucolorSelect');
		$('.menuSubCat8').removeClass('mymenucolorSelect');
		$('.menuSubCat9').removeClass('mymenucolorSelect');
		$('.menuSubCat10').removeClass('mymenucolorSelect');
		$('.menuSubCat11').removeClass('mymenucolorSelect');
		$('.menuSubCat12').removeClass('mymenucolorSelect');
		$('.menuSubCat13').removeClass('mymenucolorSelect');
		$('.menuSubCat14').removeClass('mymenucolorSelect');
		$('.menuSubCat15').removeClass('mymenucolorSelect');
		$('.menuSubCat17').removeClass('mymenucolorSelect');
		$('.menuSubCat18').removeClass('mymenucolorSelect');
		$('.menuSubCat19').removeClass('mymenucolorSelect');
		$('.menuSubCat20').removeClass('mymenucolorSelect');
		$('.menuSubCat16').removeClass('mymenucolorSelect');
		$('.menuSubCat21').removeClass('mymenucolorSelect');		



		Session.set("backlinkurl",'');
	},
	'click .menuSubCat4': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menuSubCat1').removeClass('mymenucolorSelect');
		$('.menuSubCat2').removeClass('mymenucolorSelect');
		$('.menuSubCat3').removeClass('mymenucolorSelect');
		$('.menuSubCat4').toggleClass('mymenucolorSelect');
		$('.menuSubCat5').removeClass('mymenucolorSelect');
		$('.menuSubCat6').removeClass('mymenucolorSelect');
		$('.menuSubCat7').removeClass('mymenucolorSelect');
		$('.menuSubCat8').removeClass('mymenucolorSelect');
		$('.menuSubCat9').removeClass('mymenucolorSelect');
		$('.menuSubCat10').removeClass('mymenucolorSelect');
		$('.menuSubCat11').removeClass('mymenucolorSelect');
		$('.menuSubCat12').removeClass('mymenucolorSelect');
		$('.menuSubCat13').removeClass('mymenucolorSelect');
		$('.menuSubCat14').removeClass('mymenucolorSelect');
		$('.menuSubCat15').removeClass('mymenucolorSelect');
		$('.menuSubCat17').removeClass('mymenucolorSelect');
		$('.menuSubCat18').removeClass('mymenucolorSelect');
		$('.menuSubCat19').removeClass('mymenucolorSelect');
		$('.menuSubCat20').removeClass('mymenucolorSelect');
		$('.menuSubCat16').removeClass('mymenucolorSelect');
		$('.menuSubCat21').removeClass('mymenucolorSelect');		




	},
	'click .menuSubCat5': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menuSubCat1').removeClass('mymenucolorSelect');
		$('.menuSubCat2').removeClass('mymenucolorSelect');
		$('.menuSubCat3').removeClass('mymenucolorSelect');
		$('.menuSubCat4').removeClass('mymenucolorSelect');
		$('.menuSubCat5').toggleClass('mymenucolorSelect');
		$('.menuSubCat6').removeClass('mymenucolorSelect');
		$('.menuSubCat7').removeClass('mymenucolorSelect');
		$('.menuSubCat8').removeClass('mymenucolorSelect');
		$('.menuSubCat9').removeClass('mymenucolorSelect');
		$('.menuSubCat10').removeClass('mymenucolorSelect');
		$('.menuSubCat11').removeClass('mymenucolorSelect');
		$('.menuSubCat12').removeClass('mymenucolorSelect');
		$('.menuSubCat13').removeClass('mymenucolorSelect');
		$('.menuSubCat14').removeClass('mymenucolorSelect');
		$('.menuSubCat15').removeClass('mymenucolorSelect');
		$('.menuSubCat17').removeClass('mymenucolorSelect');
		$('.menuSubCat18').removeClass('mymenucolorSelect');
		$('.menuSubCat19').removeClass('mymenucolorSelect');
		$('.menuSubCat20').removeClass('mymenucolorSelect');
		$('.menuSubCat16').removeClass('mymenucolorSelect');
		$('.menuSubCat21').removeClass('mymenucolorSelect');		




	},
	'click .menuSubCat6': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menuSubCat1').removeClass('mymenucolorSelect');
		$('.menuSubCat2').removeClass('mymenucolorSelect');
		$('.menuSubCat3').removeClass('mymenucolorSelect');
		$('.menuSubCat4').removeClass('mymenucolorSelect');
		$('.menuSubCat5').removeClass('mymenucolorSelect');
		$('.menuSubCat6').toggleClass('mymenucolorSelect');
		$('.menuSubCat7').removeClass('mymenucolorSelect');
		$('.menuSubCat8').removeClass('mymenucolorSelect');
		$('.menuSubCat9').removeClass('mymenucolorSelect');
		$('.menuSubCat10').removeClass('mymenucolorSelect');
		$('.menuSubCat11').removeClass('mymenucolorSelect');
		$('.menuSubCat12').removeClass('mymenucolorSelect');
		$('.menuSubCat13').removeClass('mymenucolorSelect');
		$('.menuSubCat14').removeClass('mymenucolorSelect');
		$('.menuSubCat15').removeClass('mymenucolorSelect');
		$('.menuSubCat17').removeClass('mymenucolorSelect');
		$('.menuSubCat18').removeClass('mymenucolorSelect');
		$('.menuSubCat19').removeClass('mymenucolorSelect');
		$('.menuSubCat20').removeClass('mymenucolorSelect');
		$('.menuSubCat16').removeClass('mymenucolorSelect');
		$('.menuSubCat21').removeClass('mymenucolorSelect');		




	},
	'click .menuSubCat7': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menuSubCat1').removeClass('mymenucolorSelect');
		$('.menuSubCat2').removeClass('mymenucolorSelect');
		$('.menuSubCat3').removeClass('mymenucolorSelect');
		$('.menuSubCat4').removeClass('mymenucolorSelect');
		$('.menuSubCat5').removeClass('mymenucolorSelect');
		$('.menuSubCat6').removeClass('mymenucolorSelect');
		$('.menuSubCat7').toggleClass('mymenucolorSelect');
		$('.menuSubCat8').removeClass('mymenucolorSelect');
		$('.menuSubCat9').removeClass('mymenucolorSelect');
		$('.menuSubCat10').removeClass('mymenucolorSelect');
		$('.menuSubCat11').removeClass('mymenucolorSelect');
		$('.menuSubCat12').removeClass('mymenucolorSelect');
		$('.menuSubCat13').removeClass('mymenucolorSelect');
		$('.menuSubCat14').removeClass('mymenucolorSelect');
		$('.menuSubCat15').removeClass('mymenucolorSelect');
		$('.menuSubCat17').removeClass('mymenucolorSelect');
		$('.menuSubCat18').removeClass('mymenucolorSelect');
		$('.menuSubCat19').removeClass('mymenucolorSelect');
		$('.menuSubCat20').removeClass('mymenucolorSelect');
		$('.menuSubCat16').removeClass('mymenucolorSelect');
		$('.menuSubCat21').removeClass('mymenucolorSelect');		




	},
	'click .menuSubCat8': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menuSubCat1').removeClass('mymenucolorSelect');
		$('.menuSubCat2').removeClass('mymenucolorSelect');
		$('.menuSubCat3').removeClass('mymenucolorSelect');
		$('.menuSubCat4').removeClass('mymenucolorSelect');
		$('.menuSubCat5').removeClass('mymenucolorSelect');
		$('.menuSubCat6').removeClass('mymenucolorSelect');
		$('.menuSubCat7').removeClass('mymenucolorSelect');
		$('.menuSubCat8').toggleClass('mymenucolorSelect');
		$('.menuSubCat9').removeClass('mymenucolorSelect');
		$('.menuSubCat10').removeClass('mymenucolorSelect');
		$('.menuSubCat11').removeClass('mymenucolorSelect');
		$('.menuSubCat12').removeClass('mymenucolorSelect');
		$('.menuSubCat13').removeClass('mymenucolorSelect');
		$('.menuSubCat14').removeClass('mymenucolorSelect');
		$('.menuSubCat15').removeClass('mymenucolorSelect');
		$('.menuSubCat17').removeClass('mymenucolorSelect');
		$('.menuSubCat18').removeClass('mymenucolorSelect');
		$('.menuSubCat19').removeClass('mymenucolorSelect');
		$('.menuSubCat20').removeClass('mymenucolorSelect');
		$('.menuSubCat16').removeClass('mymenucolorSelect');
		$('.menuSubCat21').removeClass('mymenucolorSelect');		




	},
	'click .menuSubCat9': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menuSubCat1').removeClass('mymenucolorSelect');
		$('.menuSubCat2').removeClass('mymenucolorSelect');
		$('.menuSubCat3').removeClass('mymenucolorSelect');
		$('.menuSubCat4').removeClass('mymenucolorSelect');
		$('.menuSubCat5').removeClass('mymenucolorSelect');
		$('.menuSubCat6').removeClass('mymenucolorSelect');
		$('.menuSubCat7').removeClass('mymenucolorSelect');
		$('.menuSubCat8').removeClass('mymenucolorSelect');
		$('.menuSubCat9').toggleClass('mymenucolorSelect');
		$('.menuSubCat10').removeClass('mymenucolorSelect');
		$('.menuSubCat11').removeClass('mymenucolorSelect');
		$('.menuSubCat12').removeClass('mymenucolorSelect');
		$('.menuSubCat13').removeClass('mymenucolorSelect');
		$('.menuSubCat14').removeClass('mymenucolorSelect');
		$('.menuSubCat15').removeClass('mymenucolorSelect');
		$('.menuSubCat17').removeClass('mymenucolorSelect');
		$('.menuSubCat18').removeClass('mymenucolorSelect');
		$('.menuSubCat19').removeClass('mymenucolorSelect');
		$('.menuSubCat20').removeClass('mymenucolorSelect');
		$('.menuSubCat16').removeClass('mymenucolorSelect');
		$('.menuSubCat21').removeClass('mymenucolorSelect');		


	},
	'click .menuSubCat10': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menuSubCat1').removeClass('mymenucolorSelect');
		$('.menuSubCat2').removeClass('mymenucolorSelect');
		$('.menuSubCat3').removeClass('mymenucolorSelect');
		$('.menuSubCat4').removeClass('mymenucolorSelect');
		$('.menuSubCat5').removeClass('mymenucolorSelect');
		$('.menuSubCat6').removeClass('mymenucolorSelect');
		$('.menuSubCat7').removeClass('mymenucolorSelect');
		$('.menuSubCat8').removeClass('mymenucolorSelect');
		$('.menuSubCat9').removeClass('mymenucolorSelect');
		$('.menuSubCat10').toggleClass('mymenucolorSelect');
		$('.menuSubCat11').removeClass('mymenucolorSelect');
		$('.menuSubCat12').removeClass('mymenucolorSelect');
		$('.menuSubCat13').removeClass('mymenucolorSelect');
		$('.menuSubCat14').removeClass('mymenucolorSelect');
		$('.menuSubCat15').removeClass('mymenucolorSelect');
		$('.menuSubCat17').removeClass('mymenucolorSelect');
		$('.menuSubCat18').removeClass('mymenucolorSelect');
		$('.menuSubCat19').removeClass('mymenucolorSelect');
		$('.menuSubCat20').removeClass('mymenucolorSelect');
		$('.menuSubCat16').removeClass('mymenucolorSelect');
		$('.menuSubCat21').removeClass('mymenucolorSelect');		




	},
	'click .menuSubCat11': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menuSubCat1').removeClass('mymenucolorSelect');
		$('.menuSubCat2').removeClass('mymenucolorSelect');
		$('.menuSubCat3').removeClass('mymenucolorSelect');
		$('.menuSubCat4').removeClass('mymenucolorSelect');
		$('.menuSubCat5').removeClass('mymenucolorSelect');
		$('.menuSubCat6').removeClass('mymenucolorSelect');
		$('.menuSubCat7').removeClass('mymenucolorSelect');
		$('.menuSubCat8').removeClass('mymenucolorSelect');
		$('.menuSubCat9').removeClass('mymenucolorSelect');
		$('.menuSubCat10').removeClass('mymenucolorSelect');
		$('.menuSubCat11').toggleClass('mymenucolorSelect');
		$('.menuSubCat12').removeClass('mymenucolorSelect');
		$('.menuSubCat13').removeClass('mymenucolorSelect');
		$('.menuSubCat14').removeClass('mymenucolorSelect');
		$('.menuSubCat15').removeClass('mymenucolorSelect');
		$('.menuSubCat17').removeClass('mymenucolorSelect');
		$('.menuSubCat18').removeClass('mymenucolorSelect');
		$('.menuSubCat19').removeClass('mymenucolorSelect');
		$('.menuSubCat20').removeClass('mymenucolorSelect');
		$('.menuSubCat16').removeClass('mymenucolorSelect');
		$('.menuSubCat21').removeClass('mymenucolorSelect');		


		$('body').scrollTop(0);
	},
	'click .menuSubCat12': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menuSubCat1').removeClass('mymenucolorSelect');
		$('.menuSubCat2').removeClass('mymenucolorSelect');
		$('.menuSubCat3').removeClass('mymenucolorSelect');
		$('.menuSubCat4').removeClass('mymenucolorSelect');
		$('.menuSubCat5').removeClass('mymenucolorSelect');
		$('.menuSubCat6').removeClass('mymenucolorSelect');
		$('.menuSubCat7').removeClass('mymenucolorSelect');
		$('.menuSubCat8').removeClass('mymenucolorSelect');
		$('.menuSubCat9').removeClass('mymenucolorSelect');
		$('.menuSubCat10').removeClass('mymenucolorSelect');
		$('.menuSubCat11').removeClass('mymenucolorSelect');
		$('.menuSubCat13').removeClass('mymenucolorSelect');
		$('.menuSubCat12').toggleClass('mymenucolorSelect');
		$('.menuSubCat14').removeClass('mymenucolorSelect');
		$('.menuSubCat15').removeClass('mymenucolorSelect');
		$('.menuSubCat17').removeClass('mymenucolorSelect');
		$('.menuSubCat18').removeClass('mymenucolorSelect');
		$('.menuSubCat19').removeClass('mymenucolorSelect');
		$('.menuSubCat20').removeClass('mymenucolorSelect');
		$('.menuSubCat16').removeClass('mymenucolorSelect');
		$('.menuSubCat21').removeClass('mymenucolorSelect');		



	},
	'click .menuSubCat13': function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menuSubCat1').removeClass('mymenucolorSelect');
		$('.menuSubCat2').removeClass('mymenucolorSelect');
		$('.menuSubCat3').removeClass('mymenucolorSelect');
		$('.menuSubCat4').removeClass('mymenucolorSelect');
		$('.menuSubCat5').removeClass('mymenucolorSelect');
		$('.menuSubCat6').removeClass('mymenucolorSelect');
		$('.menuSubCat7').removeClass('mymenucolorSelect');
		$('.menuSubCat8').removeClass('mymenucolorSelect');
		$('.menuSubCat9').removeClass('mymenucolorSelect');
		$('.menuSubCat10').removeClass('mymenucolorSelect');
		$('.menuSubCat11').removeClass('mymenucolorSelect');
		$('.menuSubCat12').removeClass('mymenucolorSelect');
		$('.menuSubCat13').toggleClass('mymenucolorSelect');
		$('.menuSubCat14').removeClass('mymenucolorSelect');
		$('.menuSubCat15').removeClass('mymenucolorSelect');
		$('.menuSubCat17').removeClass('mymenucolorSelect');
		$('.menuSubCat18').removeClass('mymenucolorSelect');
		$('.menuSubCat19').removeClass('mymenucolorSelect');
		$('.menuSubCat20').removeClass('mymenucolorSelect');
		$('.menuSubCat16').removeClass('mymenucolorSelect');
		$('.menuSubCat21').removeClass('mymenucolorSelect');		



	},
	'click .menuSubCat14':function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menuSubCat1').removeClass('mymenucolorSelect');
		$('.menuSubCat2').removeClass('mymenucolorSelect');
		$('.menuSubCat3').removeClass('mymenucolorSelect');
		$('.menuSubCat4').removeClass('mymenucolorSelect');
		$('.menuSubCat5').removeClass('mymenucolorSelect');
		$('.menuSubCat6').removeClass('mymenucolorSelect');
		$('.menuSubCat7').removeClass('mymenucolorSelect');
		$('.menuSubCat8').removeClass('mymenucolorSelect');
		$('.menuSubCat9').removeClass('mymenucolorSelect');
		$('.menuSubCat10').removeClass('mymenucolorSelect');
		$('.menuSubCat11').removeClass('mymenucolorSelect');
		$('.menuSubCat12').removeClass('mymenucolorSelect');
		$('.menuSubCat13').removeClass('mymenucolorSelect');
		$('.menuSubCat14').toggleClass('mymenucolorSelect');
		$('.menuSubCat15').removeClass('mymenucolorSelect');
		$('.menuSubCat17').removeClass('mymenucolorSelect');
		$('.menuSubCat18').removeClass('mymenucolorSelect');
		$('.menuSubCat19').removeClass('mymenucolorSelect');
		$('.menuSubCat20').removeClass('mymenucolorSelect');
		$('.menuSubCat16').removeClass('mymenucolorSelect');
		$('.menuSubCat21').removeClass('mymenucolorSelect');		


		Session.set("businessLink",null);
		Session.set('areaBannerArray',null);
		Session.set('catgArray',null);
	},
	'click .menuSubCat15':function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menuSubCat1').removeClass('mymenucolorSelect');
		$('.menuSubCat2').removeClass('mymenucolorSelect');
		$('.menuSubCat3').removeClass('mymenucolorSelect');
		$('.menuSubCat4').removeClass('mymenucolorSelect');
		$('.menuSubCat5').removeClass('mymenucolorSelect');
		$('.menuSubCat6').removeClass('mymenucolorSelect');
		$('.menuSubCat7').removeClass('mymenucolorSelect');
		$('.menuSubCat8').removeClass('mymenucolorSelect');
		$('.menuSubCat9').removeClass('mymenucolorSelect');
		$('.menuSubCat10').removeClass('mymenucolorSelect');
		$('.menuSubCat11').removeClass('mymenucolorSelect');
		$('.menuSubCat12').removeClass('mymenucolorSelect');
		$('.menuSubCat13').removeClass('mymenucolorSelect');
		$('.menuSubCat14').removeClass('mymenucolorSelect');
		$('.menuSubCat15').toggleClass('mymenucolorSelect');
		$('.menuSubCat17').removeClass('mymenucolorSelect');
		$('.menuSubCat18').removeClass('mymenucolorSelect');
		$('.menuSubCat19').removeClass('mymenucolorSelect');
		$('.menuSubCat20').removeClass('mymenucolorSelect');
		$('.menuSubCat16').removeClass('mymenucolorSelect');
		$('.menuSubCat21').removeClass('mymenucolorSelect');		


		
	},
	'click .menuSubCat17':function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menuSubCat1').removeClass('mymenucolorSelect');
		$('.menuSubCat2').removeClass('mymenucolorSelect');
		$('.menuSubCat3').removeClass('mymenucolorSelect');
		$('.menuSubCat4').removeClass('mymenucolorSelect');
		$('.menuSubCat5').removeClass('mymenucolorSelect');
		$('.menuSubCat6').removeClass('mymenucolorSelect');
		$('.menuSubCat7').removeClass('mymenucolorSelect');
		$('.menuSubCat8').removeClass('mymenucolorSelect');
		$('.menuSubCat9').removeClass('mymenucolorSelect');
		$('.menuSubCat10').removeClass('mymenucolorSelect');
		$('.menuSubCat11').removeClass('mymenucolorSelect');
		$('.menuSubCat12').removeClass('mymenucolorSelect');
		$('.menuSubCat13').removeClass('mymenucolorSelect');
		$('.menuSubCat14').removeClass('mymenucolorSelect');
		$('.menuSubCat15').removeClass('mymenucolorSelect');
		$('.menuSubCat17').toggleClass('mymenucolorSelect');
		$('.menuSubCat18').removeClass('mymenucolorSelect');
		$('.menuSubCat19').removeClass('mymenucolorSelect');
		$('.menuSubCat20').removeClass('mymenucolorSelect');
		$('.menuSubCat16').removeClass('mymenucolorSelect');
		$('.menuSubCat21').removeClass('mymenucolorSelect');		


		Session.set("adsBusinessLink",null);
		Session.set('areaAdsArray',null);
		Session.set('catgAdsArray',null);
		
	},
	'click .menuSubCat18':function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menuSubCat1').removeClass('mymenucolorSelect');
		$('.menuSubCat2').removeClass('mymenucolorSelect');
		$('.menuSubCat3').removeClass('mymenucolorSelect');
		$('.menuSubCat4').removeClass('mymenucolorSelect');
		$('.menuSubCat5').removeClass('mymenucolorSelect');
		$('.menuSubCat6').removeClass('mymenucolorSelect');
		$('.menuSubCat7').removeClass('mymenucolorSelect');
		$('.menuSubCat8').removeClass('mymenucolorSelect');
		$('.menuSubCat9').removeClass('mymenucolorSelect');
		$('.menuSubCat10').removeClass('mymenucolorSelect');
		$('.menuSubCat11').removeClass('mymenucolorSelect');
		$('.menuSubCat12').removeClass('mymenucolorSelect');
		$('.menuSubCat13').removeClass('mymenucolorSelect');
		$('.menuSubCat14').removeClass('mymenucolorSelect');
		$('.menuSubCat15').removeClass('mymenucolorSelect');
		$('.menuSubCat17').removeClass('mymenucolorSelect');
		$('.menuSubCat18').toggleClass('mymenucolorSelect');
		$('.menuSubCat19').removeClass('mymenucolorSelect');
		$('.menuSubCat20').removeClass('mymenucolorSelect');
		$('.menuSubCat16').removeClass('mymenucolorSelect');
		$('.menuSubCat21').removeClass('mymenucolorSelect');		

		
	},
	'click .menuSubCat19':function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menuSubCat1').removeClass('mymenucolorSelect');
		$('.menuSubCat2').removeClass('mymenucolorSelect');
		$('.menuSubCat3').removeClass('mymenucolorSelect');
		$('.menuSubCat4').removeClass('mymenucolorSelect');
		$('.menuSubCat5').removeClass('mymenucolorSelect');
		$('.menuSubCat6').removeClass('mymenucolorSelect');
		$('.menuSubCat7').removeClass('mymenucolorSelect');
		$('.menuSubCat8').removeClass('mymenucolorSelect');
		$('.menuSubCat9').removeClass('mymenucolorSelect');
		$('.menuSubCat10').removeClass('mymenucolorSelect');
		$('.menuSubCat11').removeClass('mymenucolorSelect');
		$('.menuSubCat12').removeClass('mymenucolorSelect');
		$('.menuSubCat13').removeClass('mymenucolorSelect');
		$('.menuSubCat14').removeClass('mymenucolorSelect');
		$('.menuSubCat15').removeClass('mymenucolorSelect');
		$('.menuSubCat17').removeClass('mymenucolorSelect');
		$('.menuSubCat18').removeClass('mymenucolorSelect');
		$('.menuSubCat19').toggleClass('mymenucolorSelect');
		$('.menuSubCat20').removeClass('mymenucolorSelect');
		$('.menuSubCat16').removeClass('mymenucolorSelect');
		$('.menuSubCat21').removeClass('mymenucolorSelect');		

		
	},
	'click .menuSubCat20':function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menuSubCat1').removeClass('mymenucolorSelect');
		$('.menuSubCat2').removeClass('mymenucolorSelect');
		$('.menuSubCat3').removeClass('mymenucolorSelect');
		$('.menuSubCat4').removeClass('mymenucolorSelect');
		$('.menuSubCat5').removeClass('mymenucolorSelect');
		$('.menuSubCat6').removeClass('mymenucolorSelect');
		$('.menuSubCat7').removeClass('mymenucolorSelect');
		$('.menuSubCat8').removeClass('mymenucolorSelect');
		$('.menuSubCat9').removeClass('mymenucolorSelect');
		$('.menuSubCat10').removeClass('mymenucolorSelect');
		$('.menuSubCat11').removeClass('mymenucolorSelect');
		$('.menuSubCat12').removeClass('mymenucolorSelect');
		$('.menuSubCat13').removeClass('mymenucolorSelect');
		$('.menuSubCat14').removeClass('mymenucolorSelect');
		$('.menuSubCat15').removeClass('mymenucolorSelect');
		$('.menuSubCat17').removeClass('mymenucolorSelect');
		$('.menuSubCat18').removeClass('mymenucolorSelect');
		$('.menuSubCat19').removeClass('mymenucolorSelect');
		$('.menuSubCat16').removeClass('mymenucolorSelect');
		$('.menuSubCat20').toggleClass('mymenucolorSelect');
		$('.menuSubCat21').removeClass('mymenucolorSelect');		

	},
	'click .menuSubCat16':function(){
		$('.menusidebarClassOne').removeClass('mymenucolorSelect');
		$('.menusidebarClass').removeClass('mymenucolorSelect');
		$('.menusidebarClass0').removeClass('mymenucolorSelect');
		$('.menusidebarClass1').removeClass('mymenucolorSelect');
		$('.menusidebarClass2').removeClass('mymenucolorSelect');
		$('.menusidebarClass3').removeClass('mymenucolorSelect');
		$('.menusidebarClass4').removeClass('mymenucolorSelect');
		$('.menusidebarClass5').removeClass('mymenucolorSelect');
		$('.menusidebarClass6').removeClass('mymenucolorSelect');
		$('.menuSubCat1').removeClass('mymenucolorSelect');
		$('.menuSubCat2').removeClass('mymenucolorSelect');
		$('.menuSubCat3').removeClass('mymenucolorSelect');
		$('.menuSubCat4').removeClass('mymenucolorSelect');
		$('.menuSubCat5').removeClass('mymenucolorSelect');
		$('.menuSubCat6').removeClass('mymenucolorSelect');
		$('.menuSubCat7').removeClass('mymenucolorSelect');
		$('.menuSubCat8').removeClass('mymenucolorSelect');
		$('.menuSubCat9').removeClass('mymenucolorSelect');
		$('.menuSubCat10').removeClass('mymenucolorSelect');
		$('.menuSubCat11').removeClass('mymenucolorSelect');
		$('.menuSubCat12').removeClass('mymenucolorSelect');
		$('.menuSubCat13').removeClass('mymenucolorSelect');
		$('.menuSubCat14').removeClass('mymenucolorSelect');
		$('.menuSubCat15').removeClass('mymenucolorSelect');
		$('.menuSubCat17').removeClass('mymenucolorSelect');
		$('.menuSubCat18').removeClass('mymenucolorSelect');
		$('.menuSubCat19').removeClass('mymenucolorSelect');
		$('.menuSubCat16').toggleClass('mymenucolorSelect');		
		$('.menuSubCat20').removeClass('mymenucolorSelect');		
		$('.menuSubCat21').removeClass('mymenucolorSelect');		
	},
	'click .menuSubCat21':function(){
			$('.menusidebarClassOne').removeClass('mymenucolorSelect');
			$('.menusidebarClass').removeClass('mymenucolorSelect');
			$('.menusidebarClass0').removeClass('mymenucolorSelect');
			$('.menusidebarClass1').removeClass('mymenucolorSelect');
			$('.menusidebarClass2').removeClass('mymenucolorSelect');
			$('.menusidebarClass3').removeClass('mymenucolorSelect');
			$('.menusidebarClass4').removeClass('mymenucolorSelect');
			$('.menusidebarClass5').removeClass('mymenucolorSelect');
			$('.menusidebarClass6').removeClass('mymenucolorSelect');
			$('.menuSubCat1').removeClass('mymenucolorSelect');
			$('.menuSubCat2').removeClass('mymenucolorSelect');
			$('.menuSubCat3').removeClass('mymenucolorSelect');
			$('.menuSubCat4').removeClass('mymenucolorSelect');
			$('.menuSubCat5').removeClass('mymenucolorSelect');
			$('.menuSubCat6').removeClass('mymenucolorSelect');
			$('.menuSubCat7').removeClass('mymenucolorSelect');
			$('.menuSubCat8').removeClass('mymenucolorSelect');
			$('.menuSubCat9').removeClass('mymenucolorSelect');
			$('.menuSubCat10').removeClass('mymenucolorSelect');
			$('.menuSubCat11').removeClass('mymenucolorSelect');
			$('.menuSubCat12').removeClass('mymenucolorSelect');
			$('.menuSubCat13').removeClass('mymenucolorSelect');
			$('.menuSubCat14').removeClass('mymenucolorSelect');
			$('.menuSubCat15').removeClass('mymenucolorSelect');
			$('.menuSubCat17').removeClass('mymenucolorSelect');
			$('.menuSubCat18').removeClass('mymenucolorSelect');
			$('.menuSubCat19').removeClass('mymenucolorSelect');
			$('.menuSubCat16').removeClass('mymenucolorSelect');		
			$('.menuSubCat21').toggleClass('mymenucolorSelect');		
			$('.menuSubCat20').removeClass('mymenucolorSelect');		
		},

});

Template.adminFooter.helpers({
	currentYear(){
		return (new Date()).getFullYear();
	}
});

ViewAllNotifForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'ViewAllNotif'});
  // Blaze.render(Template.vendorLayout,document.body);
}

export { ViewAllNotifForm };

ViewAllNotifsForm = function () {  

  BlazeLayout.render("userLayout",{content: 'ViewAllNotif'});

  // Blaze.render(Template.vendorLayout,document.body);
}

export { ViewAllNotifsForm };

ViewAllNotifsForms = function () {  
  BlazeLayout.render("adminLayout",{main: 'ViewAllNotif'});
  // Blaze.render(Template.vendorLayout,document.body);
}

export { ViewAllNotifsForms };