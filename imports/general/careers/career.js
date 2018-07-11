import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Bert } from 'meteor/themeteorchef:bert';
import { Template } from 'meteor/templating';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ReactiveVar } from 'meteor/reactive-var';

import { State } from '/imports/api/masterData/stateMaster.js';
import { City } from '/imports/api/masterData/cityMaster.js';
import { GeneralContent } from '../../api/webPages/generalContentMaster.js';
import { Career } from '../../api/webPages/joinusMaster.js';
import { Newjob } from '../../api/webPages/AddNewJobMaster.js';
import { ResumeImage } from '/imports/videoUploadClient/resumeImageClient.js';
// import ImageCompressor from 'image-compressor.js';

import '../generalLayout/generalLayout.js'
import '../../admin/careerJoinUsForm/careerJoinUsForm.html';
import '../../admin/commonAdmin/commonAdmin.js';
// import '../../admin/admin.js';
// import './imports/admin/commomAdmin/commomAdmin.js';
import './career.html';
import './join-us.html';
import './AddNewJobForm.html';
import './jobApplicationForm.html';
import './jobList.html';

var files = [];

Template.career.onCreated(function () {
	this.subscribe('notificationTemplate') ;
	this.subscribe('notification');
	this.subscribe('currentuser');
	this.subscribe('area');
	this.subscribe('newjob');
	this.subscribe('vendorImage');
	this.subscribe('generalContentUrl','career');  
	// this.subscribe('resumeImage');
	// this.subscribe('userProfileS3'); 
	// this.subscribe('businessImgS3');
});
Template.jobApplicationForm.onCreated(function () {
    this.currentUpload = new ReactiveVar(false);
});
Template.jobApplicationForm.helpers({
    currentUpload: function() {
        return Template.instance().currentUpload.get();
    },
});
Template.career.helpers({
	careerContent(){
		var jobTitle = Newjob.find({"jobStatus" : 'active'}).fetch();
		// console.log(jobTitle);
		if(FlowRouter.getParam('city')){
			var getCity = FlowRouter.getParam('city');
		}else{
			var sesVal = Session.get('rxtNxtCityDatlist');
		    if(sesVal){
		      var getCity = sesVal;
		    }else{
		      var getCity = "Pune";
		    }
		}
		if(jobTitle){
			for (var i = 0; i < jobTitle.length; i++) {
				jobTitle[i].expireDate = moment(jobTitle[i].date).format('DD/MM/YYYY');
				jobTitle[i].cityName = getCity;
			}
		}
		return jobTitle;
	},

	joinusData(){
		// var currentURL = FlowRouter.current().path;
		// var actualURL = currentURL.split('/');
		// var career = GeneralContent.findOne({"url": actualURL[1]});
		var career = GeneralContent.findOne({"url": "career"});
		if(career){
			return career;
		}
	}
});

Template.joinUs.helpers({
	joinUsData(){
		var id = FlowRouter.getParam('id');
		var joinus = Newjob.findOne({"_id":id, "jobStatus" : 'active'});
		joinus.date = moment(joinus.date).format('DD-MM-YYYY');
		if(joinus.noOfVacancies != ''){
			joinus.showVacancy = 'true';
		}else{
			joinus.showVacancy = 'false';
			if(joinus.showVacancy == 'false'){
				joinus.commonCareer = 'noLeftContent';
			}
		}
		if(joinus.salary != ''){
			joinus.showSalary = 'true';
		}else{
			joinus.showSalary = 'false';
			if(joinus.showSalary == 'false'){
				joinus.commonCareer1 = 'noLeftContent';
			}
		}
		if(joinus.selectCity != '--Select your City--'){
			joinus.showCity = 'true';
		}else{
			joinus.showCity = 'false';
			if(joinus.showCity == 'false'){
				joinus.commonCareer2 = 'noLeftContent';
			}
		}
		if(joinus.showSalary == 'false' && joinus.showVacancy == 'false' && joinus.showCity == 'false'){
			joinus.commonCareer3 = 'noLeftContent';
		}
		return joinus;	
	}
});

Template.careerJoinUsForm.helpers({
	careerData:function() {
		var careerDetails = [];
		var careerDetails = Career.find({}).fetch();
		// console.log("careerDetails: ",careerDetails);

		for(var i=0; i<careerDetails.length; i++){
			if(careerDetails[i].ResumeId){
				var resumeData = ResumeImage.findOne({"_id":careerDetails[i].ResumeId});
				if(resumeData){
					careerDetails[i].resume = resumeData					
				}
			}
			careerDetails[i] = {
					_id					: careerDetails[i]._id,
					name 				: careerDetails[i].name,
					email 				: careerDetails[i].email,
					MobileNo 			: careerDetails[i].MobileNo,
					Qualification 		: careerDetails[i].Qualification,
					PostForApply 		: careerDetails[i].PostForApply,
					resume 				: careerDetails[i].resume,
					dateofPost 			: moment(careerDetails[i].createdAt).format('DD/MM/YYYY'),
				
				};
			// var dateofapplied = moment(careerDetails[i].createdAt).format('DD/MM/YYYY')
		}
		// console.log('careerDetails:',careerDetails);
		return careerDetails;
	},
});
Template.jobList.helpers({
	editJobList(){
		var allPages = [];
		// var todayDate = moment(new Date()).format('YYYY-MM-DD');
		// var todayMonth = (moment(todayDate).month())+1;

		allPages = Newjob.find({},{sort:{createdAt:-1}}).fetch();
		if(allPages){
			for(i=0;i<allPages.length;i++){

				if(allPages[i].jobStatus == 'active'){
					var status = 'Inactivate job';
					var classActive = 'classActive';
					var classIActive = 'classIActive';
 				}else{
					var status = 'Activate job';
					var classActive = 'classInactive';
					var classIActive = 'classIInactive';
 				}

				allPages[i] = {
					_id					: allPages[i]._id,
					jobTitle 			: allPages[i].jobTitle,
					dateofPost 			: moment(allPages[i].dateofPost).format('DD/MM/YYYY'),
					date 				: moment(allPages[i].date).format('DD/MM/YYYY'),
					noOfVacancies 		: allPages[i].noOfVacancies,
					contentType 		: allPages[i].contentType,
					jobStatus 			: status,
					buttonActive		: classActive,
					iActive 			: classIActive,
				};
			}
			return allPages;			
		}
	},
});
Template.careerJoinUsForm.events({
	'click .delete':function(event){
		event.preventDefault();
		var id = event.currentTarget.id;
		Meteor.call('deleteJobApplicant',id,
		function(error,result){
			if(error){
				Bert.alert(error.reason,"danger","growl-top-right");
			}else{
				Bert.alert('Job applicant deleted successfully.','success',"growl-top-right");
				$('.modal-backdrop').hide();
			}
		});
	},
});

Template.jobApplicationForm.events({
	'focusout input[name="name"]': function(event){
		if($(event.target).val() != ''){
			$('#name-error').html('Name should only contains uppercase, lowercase letters and space.');
		}
	},
	'submit #joinForm': function(event,template){
		event.preventDefault();
		if(files[0]){  
			// console.log(files[0]);
	        const upload = ResumeImage.insert({
	          file: files[0],
	          streams: 'dynamic',
	          chunkSize: 'dynamic',
	          // imagetype: 'profile',
	        }, false);

	        upload.on('start', function () {
	          template.currentUpload.set(this);
	        });

	        upload.on('end', function (error, fileObj) {
	          if (error) {
	            // alert('Error during upload: ' + error);
	            console.log('Error during upload 1: ' + error);
	            console.log('Error during upload 1: ' + error.reason);
	          }else {
	            // alert('File "' + fileObj._id + '" successfully uploaded');
	            Bert.alert('Resume uploaded.','success','growl-top-right');
	            imgId =  fileObj._id ;
	            // console.log(imgId);
	        	var joinusFormValues = {
					"name" 				: event.target.name.value,
					"email" 			: event.target.email.value.trim(),
					"MobileNo" 			: event.target.MobileNo.value,
					"Qualification" 	: event.target.Qualification.value,
					"PostForApply" 		: event.target.PostForApply.value.trim(),
					"ResumeId"			: imgId,
				};

				Meteor.call('insertCareer', joinusFormValues,
					function(error,result){
						if(error){
							Bert.alert('Error occurs while submitting job application.', 'danger', 'growl-top-right' );
							return;
						}else{
	          				template.currentUpload.set(false);
							Bert.alert('Your job application submitted successfully.', 'success', 'growl-top-right' );	
							event.target.name.value				= '';
							event.target.email.value			= '';
							event.target.MobileNo.value			= '';
							event.target.Qualification.value	= '';
							// event.target.Qualification.value	= '--select--';
							event.target.PostForApply.value		= '';
							event.target.fileupload.value 		= '';
							return;
						}
					}	
				);
	          }
	        });

		    upload.start();

		}else{
			var joinusFormValues = {
				"name" 				: event.target.name.value,
				"email" 			: event.target.email.value.trim(),
				"MobileNo" 			: event.target.MobileNo.value,
				"Qualification" 	: event.target.Qualification.value,
				"PostForApply" 		: event.target.PostForApply.value.trim(),
				"ResumeId"			: '',
			};

			Meteor.call('insertCareer', joinusFormValues,
				function(error,result){
					if(error){
						Bert.alert('Error occurs while submitting job application.', 'danger', 'growl-top-right' );
						return;
					}else{
						Bert.alert('Your job application submitted successfully.', 'success', 'growl-top-right' );	
						event.target.name.value				= '';
						event.target.email.value			= '';
						event.target.MobileNo.value			= '';
						event.target.Qualification.value	= '';
						// event.target.Qualification.value	= '--select--';
						event.target.PostForApply.value		= '';
						event.target.fileupload.value 		= '';
						return;
					}
				}	
			);
		}
	},
		
	'change .fileupload': function(event,Template){
     	event.preventDefault();
     	files = event.target.files; // FileList object\
	    var fileName = files[0].name;
	    var fileSize = files[0].size;
	    var size = 200000;
	    var ext = fileName.split('.').pop();
	    if(ext=="pdf" || ext=="docx" || ext=="doc"){
	    	if(fileSize < size){
		    	$('#fileupload').removeAttr('style');
		        $('#resumeList').find('p').css('display','none');

		        // Loop through the FileList and render image files as thumbnails.
				for (var i = 0, f; f = files[i]; i++) {
					files[i].businessLink = Session.get('SessionBusinessLink');
					var reader = new FileReader();

					// Closure to capture the file information.
				    reader.onload = (function(theFile) {
				      	return function(e) {
			    	  };
			    	})(f); //end of onload

				    // Read in the image file as a data URL.
				    reader.readAsDataURL(f);		    
				}// end of for loop
	    	}else{
	    	   $('#fileupload').val('');
		       $('#fileupload').css('border','1px solid red');
		       $('#resumeList').html('<p>Document size should not exceed file size limit 200Kb.</p>');
	    	   $('#resumeList').css('color','red');
	    	}	
	    } else{
	       $('#fileupload').val('');
	       $('#fileupload').css('border','1px solid red');
	       $('#resumeList').html('<p>Only pdf, doc or docx format is supported.</p>');
	       $('#resumeList').css('color','red');
	    }
	},
});

Template.AddNewJobForm.helpers({
	'changeJobFormTitle':function(){
		var id = Session.get('id');
		if(id){
			return "Edit Post Job";
		}else{
			return "Add New Job";
		}

	},
	stateData: function(){
		var state = State.find({"status":"active"}).fetch();
		return state;
	},
	cityData: function(){
		if(Session.get('stateVal')){
			var stateValue = Session.get('stateVal');
			var data = City.find({"state":stateValue, "status":"active"}).fetch();
		}
		return data;
	},
	jobListData: function(){
		var id = Session.get('id');
		if(id){
			var data = Newjob.findOne({"_id":id});
			if(data){
				return data;
			}
		}
	},
});

Template.AddNewJobForm.events({
	// 'change #input3':function(event){
	// 	event.preventDefault();
	// 	var targetVal = event.currentTarget.value;
	// 	var monthTargetVal = moment(targetVal).month();
	// 	var todayVal = moment(new Date()).format('DD-MM-YYYY');
	// 	var monthVal = moment(todayVal).month();
	// 	if(targetVal <= todayVal){
	// 		$(event.target).val(todayVal);
	// 	}
	// },
	'keydown #noOfVacancy': function(e){
      if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
          event.charCode >= 48 && event.charCode <= 57       // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    },

	'change #jobFormState': function(event){
		event.preventDefault();
		var targetVal = event.currentTarget.value;
		Session.set('stateVal',targetVal);
	},

	'submit .addNewJobForm': function(event){
		event.preventDefault();
		console.log("event.target.jobDescripton.value:",event.target.jobDescripton.value);
		if (!event.target.jobDescripton.value == "")  {

			if(event.target.jobTitle.value && event.target.date.value && event.target.jobDescripton.value){
				var formValues = {
					"contentType" 				: 'jobList',
					"jobTitle" 					: event.target.jobTitle.value,
					"jobDescripton" 			: event.target.jobDescripton.value,
					"noOfVacancies" 			: event.target.noOfVacancies.value,
					"date" 						: event.target.date.value,
					"selectCountry" 			: event.target.selectCountry.value,
					"selectState" 				: event.target.selectState.value,
					"selectCity" 				: event.target.selectCity.value,
					"salary" 					: event.target.salary.value,
				};

				var currentURL = FlowRouter.current().path;
				if(currentURL == "/jobList") {
					formValues.id = Session.get('id');
					Meteor.call('updateNewjob',formValues,
					function(error, result){
						if(error){
							Bert.alert("Error occurs while updating New Job.",'danger',"growl-top-right");
						}else{
							Bert.alert("Listed Job updated sucessfully.",'success','growl-top-right');
							$(".joblist").hide();
							$("html,body").scrollTop(0);
							$('#jobFormCity').find('option:first').attr('selected','true');
							$('#jobFormCity').find('option:first').next().removeAttr('selected');

							$('#jobFormState').find('option:first').attr('selected','true');
							$('#jobFormState').find('option:first').next().removeAttr('selected');
							$('#inactiveOk').removeAttr('style');

							Session.set('id',"");

						}
					});
				}

				if(currentURL == "/addNewJob"){			
					Meteor.call('insertNewjob', formValues,
					function(error,result){
						if(error){
							Bert.alert("Error occurs while inserting New Job.",'danger',"growl-top-right");
							return;
						}else{
							Bert.alert("New Job inserted sucessfully.",'success','growl-top-right');
							event.target.jobTitle.value        ='';
							event.target.jobDescripton.value   = CKEDITOR.instances['desc'].setData('');
							event.target.noOfVacancies.value   ='';
							event.target.date.value            ='';
							event.target.selectCountry.value   ='';
							event.target.selectState.value     ='';
							event.target.selectCity.value      ='';
							event.target.salary.value          ='';
							return;
						}
					});
				}
			}
			else{
				// Bert.alert("Please enter data in the field !!!","danger","growl-top-right");
			}
		}else{
				Bert.alert("Please enter Job Description!!!","danger","growl-top-right");

		}	
	},
});

Template.jobList.events({
	'click .classActive': function(event){
		event.preventDefault();
		var id = event.currentTarget.id;

		Meteor.call('updateJobStatus',id,function(error,result){
			if(error){
				Bert.alert(error.reason,"danger","growl-top-right");
			}else{
				// Bert.alert('Listed job is inactive now.','success',"growl-top-right");
			}
		});
	},

	'click .classInactive':function(event){
		event.preventDefault();
		var id = event.currentTarget.id;
		newJobObj = Newjob.findOne({"_id":id});
		if(newJobObj){
			var postDate = newJobObj.dateofPost;
			var expireDate = newJobObj.date;
			var todayDate = moment(new Date()).format("YYYY-MM-DD");
			var inactiveModal = '#inactiveDataModal-'+id;
			if(expireDate < postDate || expireDate < todayDate){
				$(inactiveModal).modal("show");
			}else{
				Meteor.call('updateJobStatusActive',id,function(error,result){
					if(error){
						Bert.alert(error.reason,"danger","growl-top-right");
					}else{
						// Bert.alert('Listed job is active now.','success',"growl-top-right");
					}
				});
			}
		}
	},

	'click .edit': function(event){
		event.preventDefault();
		var input1 = $('#input1');
		var input2 = $('#input2');
		var input3 = $('#input3');
		var input4 = $('#jobFormState');
		var input5 = $('#jobFormCity');
		var input6 = $('#input6');
		var input7 = $('#jobFormCountry');

		$(input4).find('option:first').removeAttr('selected');
		$(input4).find('option:first').next().attr('selected','true');

		$(input5).find('option:first').removeAttr('selected');
		$(input5).find('option:first').next().attr('selected','true');

		$('#inactiveOk').css('margin-top','-10%');

		var id = event.currentTarget.id;
		Session.set('id',id);

		var type = $('#'+id).attr('class');
		var types = type.split(' ');
		var contentType = types[1];

		if(contentType =='jobList'){
			$('html, body').scrollTop(0);
			$('.joblist').show();
			if($(event.target).hasClass('btn-danger')){
				$($(".addNewJobForm")[0]).find(input3).focus();
			}

			$($(".addNewJobForm")[0]).find(input1).val(Newjob.findOne({"_id":id}).jobTitle);
			$($(".addNewJobForm")[0]).find(input2).val(Newjob.findOne({"_id":id}).noOfVacancies);
			$($(".addNewJobForm")[0]).find(input3).val(Newjob.findOne({"_id":id}).date);
			$($(".addNewJobForm")[0]).find(input6).val(Newjob.findOne({"_id":id}).salary);
			CKEDITOR.instances.desc.setData(Newjob.findOne({"_id":id}).jobDescripton);
		}
	},

	'click .delete':function(event){
		event.preventDefault();

		var modelid = $(event.target).parent().parent().parent().parent().parent().attr('id');
		var id  = modelid.split("-");
	
		Meteor.call('deleteNewjob',id[1],function(error,result){
			if(error){
				Bert.alert(error.reason,"danger","growl-top-right");
			}else{
				Bert.alert('Job deleted successfully.','success',"growl-top-right");
				$('.modal-backdrop').hide();
			}
		});
	}
});

Template.jobApplicationForm.onRendered(function(){
	
	$.validator.addMethod("regx1", function(value, element, regexpr) {          
    	return regexpr.test(value);
	}, "Name should only contains uppercase, lowercase letters and space.");
	
	$.validator.addMethod("regx2", function(value, element, regexpr) {          
    	return regexpr.test(value);
	}, "Please enter a valid email address.");
	
	$.validator.addMethod("regx3", function(value, element, regexpr) {          
    	return regexpr.test(value);
	}, "Please enter a valid mobile number.");

	// $.validator.addMethod("regx4", function(value, element, regexpr) {          
 	//    	return regexpr.test(value);
	// }, "");
	 
	$("#joinForm").validate({
	 	rules: {
	        name: {
	            required: true,
	            regx1: /^[A-za-z']+( [A-Za-z']+)*$/,
	        },
	        email: {
	        	required: true,
	        	regx2: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
	        },
	        MobileNo: {
	        	required: true,
	        	regx3: /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/,
	        },
	        PostForApply: {
	         	required: true,
	        	// regx4: /^[\/a-zA-Z' ]+$/,
	        },
    	}
	});
});

Template.career.onRendered(function(){
	$('html, body').scrollTop(0);
});

Template.joinUs.onRendered(function(){
	$("#visible-lg").removeClass("merchantGuidelineslg");
	$("#visible-md").removeClass("merchantGuidelinesmd");
	$("#visible-sm").removeClass("merchantGuidelinessm");
	$("#visible-xs").removeClass("merchantGuidelinesxs");
	$(window).scroll(function() {
	    if ($(document).scrollTop() > 25) {
	    	$("#visible-lg").addClass("merchantGuidelineslg");
	    	$("#visible-md").addClass("merchantGuidelinesmd");
	    	$("#visible-sm").addClass("merchantGuidelinessm");
	    	$("#visible-xs").addClass("merchantGuidelinesxs");
	    	$('#jobAppln').css('margin-top','5%');
	    } else {
	    	$("#visible-lg").removeClass("merchantGuidelineslg");
	    	$("#visible-md").removeClass("merchantGuidelinesmd");
	    	$("#visible-sm").removeClass("merchantGuidelinessm");
	    	$("#visible-xs").removeClass("merchantGuidelinesxs");
	    	$('#jobAppln').css('margin-top','3.5%');
	    }
    });
	$('html, body').scrollTop(0);
});

Template.AddNewJobForm.onRendered(function(){
	CKEDITOR.replace( 'desc' );
	$('html, body').scrollTop(0);
	Session.set('stateVal','');
	Session.set('id','');

	var todayNext = new Date().toISOString().split('T')[0];
	document.getElementsByName("date")[0].setAttribute('min', todayNext);
	
	$(".addNewJobForm").validate({
	 	rules: {
	        jobTitle: {
	            required: true,
	        },
	        date: {
	        	required: true,
	        },
    	},
    	errorPlacement: function(error, element) {
		    if (element.attr("name") == "jobTitle"){
		      error.insertAfter("#title");
		    }
		    if (element.attr("name") == "date"){
		      error.insertAfter("#dateInput");
		    }
		}
	});
});

addNewJobForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'AddNewJobForm'});
}

export { addNewJobForm };

careerForm = function () {  
  BlazeLayout.render("generalLayoutWithImage",{generalcontent: 'career'});
  // Blaze.render(Template.vendorLayout,document.body);
}
export { careerForm };

// ===

joinUsForm = function () {  
  BlazeLayout.render("generalLayout",{generalcontent: 'joinUs'});
  // Blaze.render(Template.vendorLayout,document.body);
}
export { joinUsForm };

// ===

jobListForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'jobList'});
  // Blaze.render(Template.vendorLayout,document.body);
}

export { jobListForm };