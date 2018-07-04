import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import './main.html';

Meteor.startup(() => {
	global.Buffer = function() {}
	global.Buffer.isBuffer = () => false
	// global.Buffer = global.Buffer || require("buffer").Buffer;
});

$(document).on("click",function(){
	$('.activeDownList').hide();
	$('.activeDownListFlag').hide();
});
$(document).on('click',function(){
	$(".loginClosenew").click(function() {
	    $('.loginEmail').val('');
	    $('.loginPassword').val('');
	});
});

Meteor.startup(function () {
  TimeSync.loggingEnabled = false;

	generateURLid =function(id){
		var newurl = 'q=rightnxt+url&oq=user..69i57j0j69i60l2j0l2.4907j0j7&'+id+'&sourceid=chrome&ie=UTF-8';
		return newurl;
	}
	
	produceURLid = function (id){
		var newid = id.split('&');
		return newid[2];
	}
});




