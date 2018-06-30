// Business Enquiry Validation
Template.businessEnquiry.events({
	'focusout .enquiryName': function(){
		var myFuncVar = $(".enquiryName").val();
		if (myFuncVar==null||myFuncVar=="") {
			$(".spanEnqName").addClass("ErrorRedText");
			$(".enquiryName").addClass("SpanLandLineRedBorder");
			$( ".spanEnqName" ).text("Please Enter Valid Name" );
		} else {
			$( ".spanEnqName" ).text("" );
			$(".spanEnqName").removeClass("ErrorRedText");
			$(".enquiryName").removeClass("SpanLandLineRedBorder");
		}
	},
	'keydown .enquiryName': function(e){
	       if ($.inArray(e.keyCode, []) !== -1 ||
	           // Allow: Ctrl+A, Command+A
	          (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true))||
	          (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true))||
	          (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true))||
	           // Allow: home, end, left, right, down, up
	          (e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode===189  || e.keyCode===32) {
	               // let it happen, don't do anything
	               return;
	      }
	      // Ensure that it is a number and stop the keypress
	      if ((e.keyCode >=48 && e.keyCode <= 57) || 
	          (e.keyCode >=96 && e.keyCode <=111) || 
	          (e.keyCode >=186 && e.keyCode <=192)|| 
	          (e.keyCode >=219 && e.keyCode <=222)) {
	          e.preventDefault();
	      }
	   },
	'keydown .enquiryPhone': function(e){
	      if ($.inArray(e.keyCode, [8, 9, 27, 13]) !== -1 ||
	             // Allow: Ctrl+A, Command+A
	            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true))||
	            (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true))||
	            (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true))||
	             // Allow: home, end, left, right, down, up
	            (e.keyCode >= 35 && e.keyCode <= 40)) {
	                 // let it happen, don't do anything
	                 return;
	        }
	        // Ensure that it is a number and stop the keypress
	        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode===190 || e.keyCode===46 || e.keyCode===110)) {
	            e.preventDefault();
	        }
	   },

	'focusout .enquiryPhone': function(){
		var myFuncVar = $(".enquiryPhone").val();
		var nameRegex = /^(\+91\s|\+91-|\+91|0)?\d{10}$/;
		if (myFuncVar==null||myFuncVar==""||!myFuncVar.match(nameRegex)) {
			$(".spanEnqPhone").addClass("ErrorRedText");
			$(".enquiryPhone").addClass("SpanLandLineRedBorder");
			$( ".spanEnqPhone" ).text("Please Enter Valid Mobile Number" );
		} else {
			$( ".spanEnqPhone" ).text("" );
			$(".spanEnqPhone").removeClass("ErrorRedText");
			$(".enquiryPhone").removeClass("SpanLandLineRedBorder");
		}
	},

	'focusout .enquiryEmail': function(){
		var myFuncVar = $(".enquiryEmail").val();
		var nameRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
		if (myFuncVar==null||myFuncVar==""||!myFuncVar.match(nameRegex)) {
			$(".spanEnqEmail").addClass("ErrorRedText");
			$(".enquiryEmail").addClass("SpanLandLineRedBorder");
			$( ".spanEnqEmail" ).text("Please Enter Valid Business Email Id" );
		} else {
			$( ".spanEnqEmail" ).text("" );
			$(".spanEnqEmail").removeClass("ErrorRedText");
			$(".enquiryEmail").removeClass("SpanLandLineRedBorder");
		}
	},

	'focusout .enquiryDesc': function(){
		var myFuncVar = $(".enquiryDesc").val();
		if (myFuncVar==null||myFuncVar=="") {
			$(".spanEnqDesc").addClass("ErrorRedText");
			$(".enquiryDesc").addClass("SpanLandLineRedBorder");
			$( ".spanEnqDesc" ).text("Please enter the description of the product you are looking for." );
		} else {
			$( ".spanEnqDesc" ).text("" );
			$(".spanEnqDesc").removeClass("ErrorRedText");
			$(".enquiryDesc").removeClass("SpanLandLineRedBorder");
		}
	},
});

