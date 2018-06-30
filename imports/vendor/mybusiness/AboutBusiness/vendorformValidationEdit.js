// Vendor Business Information Start
Template.vendorBusinessInformation.events({
   // 'change .businessAbtBus': function(){
   //       var myFuncVar = $(".businessAbtBus").val();
   //       if (myFuncVar==null||myFuncVar==""||myFuncVar.length<300) {
   //          $(".SpanbusinessAbtBus").addClass("ErrorRedText");
   //          $(".businessAbtBus").addClass("SpanLandLineRedBorder");
   //          $( ".SpanbusinessAbtBus" ).text("Please Enter About Business information between 300-1000 characters" );

   //       } else {
   //          $( ".SpanbusinessAbtBus" ).text("");
   //          $(".SpanbusinessAbtBus").removeClass("ErrorRedText");
   //          $(".businessAbtBus").removeClass("SpanLandLineRedBorder");

   //       }

   //    },
   'change #businessTitle': function(){
         var myFuncVar = $("#businessTitle").val();
         var nameRegNotNum = /^\d+$/;
         var nameRegex = /^[A-Za-z0-9'\.\-\s\,/]{1,100}$/;

        var myBusinessTitleLink = $('#businessTitle').val().trim().replace(/ /g,'').substring(0,50);

        //  if($('.businessLinkC').val().length <= 50 ){
        //    $('.businessLinkC').val(myBusinessTitleLink);
        //  }

         if (myFuncVar==null||myFuncVar==""||!myFuncVar.match(nameRegex)||myFuncVar.match(nameRegNotNum)) {
            $(".linkValid").removeClass("linkAvail");
            $(".SpanBusinessTitle").addClass("ErrorRedText");
            $(".businessTitleC").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessTitle" ).text("A valid title should be alphanumeric with space, comma, hyphen(-) & fullstop." );

         } else {
            $(".SpanBusinessTitle").removeClass("ErrorRedText");
            $(".businessTitleC").removeClass("SpanLandLineRedBorder");

         }

         var myFuncVarr = $("#businessLink").val();
         var nameRegexr = /^[A-Za-z0-9-]{1,50}$/;
         var whiteSpacer = /^\S$/;
         $( ".SpanBusinessLink" ).text("");
         if (myFuncVarr==null||myFuncVarr==""||myFuncVarr.match(whiteSpacer)||!myFuncVarr.match(nameRegexr)) {
            $(".SpanBusinessLink").addClass("ErrorRedText");
            $(".SpanBusinessLink").removeClass("linkAvail");
            $(".businessLinkC").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessLink" ).text("Please Enter Valid Business Link with max 50 characters" );

         } else {
            $(".SpanBusinessLink").removeClass("ErrorRedText");
            $(".businessLinkC").removeClass("SpanLandLineRedBorder");

         }

      },
   'change #businessLink': function(){
         var myFuncVar = $("#businessLink").val();
         var nameRegexr = /^[A-Za-z0-9-]{1,50}$/;
         var whiteSpace = /^\S$/;
         // if (myFuncVar==null||myFuncVar==""||!myFuncVar.match(nameRegex)||myFuncVar.match(whiteSpace)) {
         if (myFuncVar==null||myFuncVar==""||myFuncVar.match(whiteSpace)||!myFuncVar.match(nameRegexr)) {
            $(".SpanBusinessLink").addClass("ErrorRedText");
            $(".businessLinkC").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessLink" ).text("A valid link should be alphanumeric with only hyphens(-)" );

         } else {
            $(".SpanBusinessLink").removeClass("ErrorRedText");
            $(".businessLinkC").removeClass("SpanLandLineRedBorder");

         }
      },
   'change #businessEmailId': function(){
         var myFuncVar = $("#businessEmailId").val();
         var nameRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
         var whiteSpace = /^\S$/;
         if (myFuncVar==null||myFuncVar==""||!myFuncVar.match(nameRegex)||myFuncVar.match(whiteSpace)) {
            $(".SpanBusinessEmailId").addClass("ErrorRedText");
            $(".businessEmailIdC").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessEmailId" ).text("Please Enter Valid Business Email Id" );

         } else {
            $(".SpanBusinessEmailId").removeClass("ErrorRedText");
            $(".businessEmailIdC").removeClass("SpanLandLineRedBorder");

         }
      },
   'focusout #businessAddress': function(){
         var myFuncVar = $("#businessAddress").val();
         // var nameRegex = /^[A-Za-z0-9'\.\-\s\,/]{3,300}$/;
         if (myFuncVar==null||myFuncVar=="") {
            $(".SpanBusinessAddress").addClass("ErrorRedText");
            $(".businessAddressC").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessAddress" ).text("Please Enter Valid Address" );

         } else {
            $(".SpanBusinessAddress").removeClass("ErrorRedText");
            $(".businessAddressC").removeClass("SpanLandLineRedBorder");

         }
      },
   'focusout .venState': function(){
         var myFuncVar = $(".venState").val();
         // var nameRegex = /^[A-Za-z ]{2,15}$/;
         // alert(myFuncVar);
         if (myFuncVar=='--Select--') {
            $(".SpanBusinessState").addClass("ErrorRedText");
            $(".venState").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessState" ).text("Please select State" );

         } else {
            $(".SpanBusinessState").removeClass("ErrorRedText");
            $(".venState").removeClass("SpanLandLineRedBorder");

         }
      },
   'focusout .venCity': function(){
         var myFuncVar = $(".venCity").val();
         // var nameRegex = /^[A-Za-z ]{2,15}$/;
         // alert(myFuncVar);
         if (myFuncVar=='--Select--') {
            $(".SpanBusinessCity").addClass("ErrorRedText");
            $(".venCity").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessCity" ).text("Please select City" );

         } else {
            $(".SpanBusinessCity").removeClass("ErrorRedText");
            $(".venCity").removeClass("SpanLandLineRedBorder");

         }
      },
   'focusout .venArea': function(){
         var myFuncVar = $(".venArea").val();
         // alert(myFuncVar);
         // var nameRegex = /^[A-Za-z0-9 ]{2,15}$/;
         if (myFuncVar=='--Select--') {
            $(".SpanBusinessArea").addClass("ErrorRedText");
            $(".venArea").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessArea" ).text("Please select Area" );

         } else {
            $(".SpanBusinessArea").removeClass("ErrorRedText");
            $(".venArea").removeClass("SpanLandLineRedBorder");

         }
      },
   'focusout .venPin': function(){
         var myFuncVar = $(".venPin").val();
         // alert(myFuncVar);
         // var nameRegex = /^[A-Za-z0-9 ]{2,15}$/;
         if (!myFuncVar&&myFuncVar==null&&myFuncVar=='') {
            $(".SpanBusinessZipCode").addClass("ErrorRedText");
            $(".venPin").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessZipCode" ).text("Please select Zip Code" );

         } else {
            $(".SpanBusinessZipCode").removeClass("ErrorRedText");
            $(".venPin").removeClass("SpanLandLineRedBorder");

         }
      },
      'change .businessLat': function(){
         var myFuncVar = $(".businessLat").val();
         $( ".SpanBusinessLatitude" ).text("" );

         if (myFuncVar==null||myFuncVar=="") {
            $(".SpanBusinessLatitude").addClass("ErrorRedText");
            $(".businessLat").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessLatitude" ).text("Please select or enter valid Latitude" );

         } else {
            $(".SpanBusinessLatitude").removeClass("ErrorRedText");
            $(".businessLat").removeClass("SpanLandLineRedBorder");

         }
      },
    'change .businessLng': function(){
         var myFuncVar = $(".businessLng").val();
         $( ".SpanBusinessLongitude" ).text("" );
         
         if (myFuncVar==null||myFuncVar=="") {
            $(".SpanBusinessLongitude").addClass("ErrorRedText");
            $(".businessLng").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessLongitude" ).text("Please select or enter valid Longitude" );

         } else {
            $(".SpanBusinessLongitude").removeClass("ErrorRedText");
            $(".businessLng").removeClass("SpanLandLineRedBorder");

         }
      },
});
// Vendor Business Information End

// Vendor Business OpenAndClose Start
Template.vendorOpeningAndClosing.events({
   // 'focusout #businesscategories': function(){
   //       var myFuncVar = $("#businesscategories").val();
   //       var nameRegex = /^[A-Za-z0-9 ]{3,20}$/;
   //       if (myFuncVar==null||myFuncVar==""||!myFuncVar.match(nameRegex)) {
   //          $(".SpanBusinesscategories").addClass("ErrorRedText");
   //          $(".businesscategoriesC").addClass("SpanLandLineRedBorder");
   //          $( ".SpanBusinesscategories" ).text("Please Enter Valid Category" );

   //       } else {
   //          $(".SpanBusinesscategories").removeClass("ErrorRedText");
   //          $(".businesscategoriesC").removeClass("SpanLandLineRedBorder");

   //       }
   //    },
      // 'focusout #businessAnythingElse': function(){
      //    var myFuncVar = $("#businessAnythingElse").val();
      //    var nameRegex = /^[A-Za-z0-9 ]{3,20}$/;
      //    if (!myFuncVar.match(nameRegex)) {
      //       $(".SpanBusinessAnythingElse").addClass("ErrorRedText");
      //       $(".businessAnythingElseC").addClass("SpanLandLineRedBorder");
      //       $( ".SpanBusinessAnythingElse" ).text("Please Enter Valid Categories" );

      //    } else {
      //       $(".SpanBusinessAnythingElse").removeClass("ErrorRedText");
      //       $(".businessAnythingElseC").removeClass("SpanLandLineRedBorder");

      //    }
      //    if (myFuncVar==null || myFuncVar == "") {
      //       $(".SpanBusinessAnythingElse").removeClass("ErrorRedText ");
      //       $(".businessAnythingElseC").removeClass("SpanLandLineRedBorder");
      //    }
      // },
   'keydown #businessLandline': function(e){
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
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
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode===190 || e.keyCode===46)) {
            e.preventDefault();
        }
   },
   'focusout #businessLandline': function(){
         var myFuncVar = $("#businessLandline").val();
         var nameRegex = /^([0-9\-\s]{2,5}[0-9]{6,8})$/;
         var myFuncVarMob = $("#businessMobile").val();

         if (!myFuncVar.match(nameRegex)&&myFuncVar) {
            $(".SpanMobileErrors").addClass("ErrorRedText");
            $(".businessLandlineC").addClass("SpanLandLineRedBorder");
            $(".SpanMobileErrors").text("Please Enter Valid Landline or 10 digit Mobile Number" );
         } else {
            $(".businessLandlineC").removeClass("SpanLandLineRedBorder");
            $(".SpanMobileErrors").text("");
            $('.businessMobileC').removeClass("SpanLandLineRedBorder");
            $(".SpanMobileErrors").removeClass("ErrorRedText");
            if(myFuncVarMob){
              if(myFuncVarMob.length<10){
                $('.businessMobileC').addClass("SpanLandLineRedBorder");
                $(".SpanMobileErrors").addClass("ErrorRedText");
                $(".SpanMobileErrors").text("Please Enter Valid Landline or 10 digit Mobile Number");
              }
            }
         }
      },
   'keydown #businessMobile': function(e){
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
   'focusout #businessMobile': function(){
         var myFuncVar = $("#businessMobile").val();
         var nameRegex = /^\d+$/;
         var nameRegexLandLine = /^([0-9\-\s]{2,5}[0-9]{6,8})$/;
         var mylandLine = $("#businessLandline").val();

        if(myFuncVar||mylandLine){
          // 1. condition
          if(myFuncVar&&mylandLine){
            if(myFuncVar){
              if(myFuncVar.length<10){
                $(".SpanMobileErrors").addClass("ErrorRedText");
                $(".businessMobileC").addClass("SpanLandLineRedBorder");
                $(".SpanMobileErrors").text("Please Enter Valid Landline or 10 digit Mobile Number");
              }
            }
            if(mylandLine){
              if(!mylandLine.match(nameRegexLandLine)){
                $(".SpanMobileErrors").addClass("ErrorRedText");
                $(".businessLandlineC").addClass("SpanLandLineRedBorder");
                $(".SpanMobileErrors").text("Please Enter Valid Landline or 10 digit Mobile Number");
              }
            }
          }
          if(!myFuncVar&&mylandLine.match(nameRegexLandLine)){
            $(".SpanMobileErrors").removeClass("ErrorRedText");
            $(".businessMobileC").removeClass("SpanLandLineRedBorder");
            $(".SpanMobileErrors").text("");
          }
          // 2. condition
          if(myFuncVar){
            if(myFuncVar.length<10){
              $(".SpanMobileErrors").addClass("ErrorRedText");
              $(".businessMobileC").addClass("SpanLandLineRedBorder");
              $(".SpanMobileErrors").text("Please Enter Valid Landline or 10 digit Mobile Number");
            }
            if(myFuncVar.length==10){
                $(".SpanMobileErrors").removeClass("ErrorRedText");
                $(".businessMobileC").removeClass("SpanLandLineRedBorder");
                $(".SpanMobileErrors").text("");
            }
          }
          // 3. condition
          if(mylandLine){
            if(!mylandLine.match(nameRegexLandLine)){
              $(".SpanMobileErrors").addClass("ErrorRedText");
              $(".businessLandlineC").addClass("SpanLandLineRedBorder");
              $(".SpanMobileErrors").text("Please Enter Valid Landline or 10 digit Mobile Number");
            }
          }
        }
        //Condition 4
        if(!myFuncVar&&!mylandLine){
          $(".SpanMobileErrors").addClass("ErrorRedText");
          $(".businessMobileC").addClass("SpanLandLineRedBorder");
          $(".SpanMobileErrors").text("Please Enter Valid Landline or 10 digit Mobile Number");
        }
    },
      'keydown #businessAltMobile': function(e){
         if ($.inArray(e.keyCode, [8, 9, 27, 13]) !== -1 ||
                // Allow: Ctrl+A, Command+A
              (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
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
      'focusout #businessAltMobile': function(){
         var myFuncVar = $("#businessAltMobile").val();
         var nameRegex = /^\d+$/;
         if(myFuncVar==null||myFuncVar==""){
            $(".SpanAltMobile").removeClass("ErrorRedText");
            $(".businessAltMobileC").removeClass("SpanLandLineRedBorder");
         }
         if (myFuncVar){
            if(!myFuncVar.match(nameRegex)||myFuncVar.length<10){
               $(".SpanAltMobile").addClass("ErrorRedText");
               $(".businessAltMobileC").addClass("SpanLandLineRedBorder");
               $( ".SpanAltMobile" ).text("Please Enter Valid 10 digit Mobile Number" );
            }else{
               $(".SpanAltMobile").removeClass("ErrorRedText");
               $(".businessAltMobileC").removeClass("SpanLandLineRedBorder");
            }
         }
      },
      'focusout #businessWebAdress': function(){
         var myFuncVar = $("#businessWebAdress").val();
         var nameRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|(www\.|(?!www\.))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
         if (!myFuncVar.match(nameRegex)) {
            $(".SpanUrl").addClass("ErrorRedText");
            $(".businessWebAdressC").addClass("SpanLandLineRedBorder");
            $( ".SpanUrl" ).text("Please Enter Website URL as http://www.xyz.com OR www.xyz.com" );

         } else {
            $(".SpanUrl").removeClass("ErrorRedText");
            $(".businessWebAdressC").removeClass("SpanLandLineRedBorder");

         }

         if (myFuncVar==null || myFuncVar == "") {
            $(".SpanUrl").removeClass("ErrorRedText ");
            $(".businessWebAdressC").removeClass(" SpanLandLineRedBorder");
         }
      },
});
// Vendor Business OpenAndClose End

// Vendor Business About Owner Start
Template.vendorAboutOwner.events({
   // 'focusout #businessFullName': function(){
   //       var myFuncVar = $("#businessFullName").val();
   //       var nameRegex = /^[A-Za-z ]{3,40}$/;
   //       if (myFuncVar==null||myFuncVar==""||!myFuncVar.match(nameRegex)) {
   //          $(".SpanBusinessFullName").addClass("ErrorRedText");
   //          $(".businessFullNameC").addClass("SpanLandLineRedBorder");
   //          $( ".SpanBusinessFullName" ).text("Please Enter Valid Full Name" );

   //       } else {
   //          $(".SpanBusinessFullName").removeClass("ErrorRedText");
   //          $(".businessFullNameC").removeClass("SpanLandLineRedBorder");

   //       }
   //    },
   'focusout #businessYourDesc': function(){
         var myFuncVar = $("#businessYourDesc").val();
         if ((myFuncVar.length>0&&myFuncVar.length<50)||myFuncVar.length>1000) {
            $(".SpanBusinessYourDesc").addClass("ErrorRedText");
            $("#businessYourDesc").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessYourDesc" ).text("Please Enter Owner Description Minimum 50 and Maximum 1000 Characters" );

         } else {
            $(".SpanBusinessYourDesc").removeClass("ErrorRedText");
            $("#businessYourDesc").removeClass("SpanLandLineRedBorder");

         }
    },
   'keydown .businessMobileCC': function(e){
      if ($.inArray(e.keyCode, [8, 9, 27, 13]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
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
   'focusout .businessMobileCC': function(){
         var myFuncVar = $(".businessMobileCC").val();
         var nameRegex = /^\d+$/;
         if(myFuncVar){
            if (!myFuncVar.match(nameRegex)||myFuncVar.length<10) {
               $(".SpanBusinessOwMobile").addClass("ErrorRedText");
               $(".businessMobileCC").addClass("SpanLandLineRedBorder");
               $( ".SpanBusinessOwMobile" ).text("Please Enter Valid 10 digit Mobile number" );

            } else {
               $(".SpanBusinessOwMobile").removeClass("ErrorRedText");
               $(".businessMobileCC").removeClass("SpanLandLineRedBorder");
               $( ".SpanBusinessOwMobile" ).text("" );

            }
         }
         if(myFuncVar==null ||myFuncVar==''){
            $(".SpanBusinessOwMobile").removeClass("ErrorRedText");
            $(".businessMobileCC").removeClass("SpanLandLineRedBorder");
            $( ".SpanBusinessOwMobile" ).text("" );

         }
      },
   'focusout #businessEmail': function(){
         var myFuncVar = $("#businessEmail").val();
         var nameRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
         if(myFuncVar){
            if (myFuncVar==null||myFuncVar==""||!myFuncVar.match(nameRegex)) {
               $(".SpanBusinessEmail").addClass("ErrorRedText");
               $(".businessEmailC").addClass("SpanLandLineRedBorder");
               $( ".SpanBusinessEmail" ).text("Please Enter Valid Email" );

            } else {
               $(".SpanBusinessEmail").removeClass("ErrorRedText");
               $(".businessEmailC").removeClass("SpanLandLineRedBorder");

            }
         }
         if(myFuncVar==null ||myFuncVar==''){
            $(".SpanBusinessEmail").removeClass("ErrorRedText");
            $(".businessEmailC").removeClass("SpanLandLineRedBorder");
         }
      },
   // 'focusout #businessYourDesc': function(){
   //       var myFuncVar = $("#businessYourDesc").val();
   //       // var nameRegex = /^(\+91-|\+91|0)?\d{10}$/;
   //       if (myFuncVar==null||myFuncVar=="") {
   //          $(".SpanBusinessYourDesc").addClass("ErrorRedText");
   //          $(".businessYourDescC").addClass("SpanLandLineRedBorder");
   //          $( ".SpanBusinessYourDesc" ).text("Please Enter something in field" );

   //       } else {
   //          $(".SpanBusinessYourDesc").removeClass("ErrorRedText");
   //          $(".businessYourDescC").removeClass("SpanLandLineRedBorder");

   //       }
   //    },
});
// Vendor Business About Owner End