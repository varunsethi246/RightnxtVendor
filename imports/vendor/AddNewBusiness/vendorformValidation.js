// Vendor Business Information Start
Template.addVendorBusInfo.events({
   // 'focusout .businessAbtBus': function(){
   //       var myFuncVar = $(".businessAbtBus").val();
   //       if (myFuncVar==null||myFuncVar==""||myFuncVar.length<1500) {
   //          $(".SpanbusinessAbtBus").addClass("ErrorRedText");
   //          $(".businessAbtBus").addClass("SpanLandLineRedBorder");
   //          $( ".SpanbusinessAbtBus" ).text("Please Enter About Business information between 150-1000 characters" );

   //       } else {
   //          $( ".SpanbusinessAbtBus" ).text("");
   //          $(".SpanbusinessAbtBus").removeClass("ErrorRedText");
   //          $(".businessAbtBus").removeClass("SpanLandLineRedBorder");

   //       }

   //    },
   'focusout #businessEmailId': function(){
         var myFuncVar = $("#businessEmailId").val();
         var nameRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
         if (myFuncVar==null||myFuncVar==""||!myFuncVar.match(nameRegex)) {
            $(".SpanBusinessEmailId").addClass("ErrorRedText");
            $(".businessEmailIdC").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessEmailId" ).text("Please Enter Valid Business Email Id" );

         } else {
            $(".SpanBusinessEmailId").removeClass("ErrorRedText");
            $(".businessEmailIdC").removeClass("SpanLandLineRedBorder");

         }
      },
   'focusout #businessAddress': function(){
         var myFuncVar = $("#businessAddress").val().replace(/ /g,'');
         // var nameRegex = /^[A-Za-z0-9'\.\-\s\,/]{3,300}$/;
         if (myFuncVar==null||myFuncVar=="") {
            $(".SpanBusinessAddress").addClass("ErrorRedText");
            $(".businessAddressC").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessAddress" ).text("Please Enter Address" );

         } else {
            $(".SpanBusinessAddress").removeClass("ErrorRedText");
            $(".businessAddressC").removeClass("SpanLandLineRedBorder");

         }
        // $('.addVenCountry').focus();
        // var offsetAdd = $("#businessAddress").offset().top + 50;
        // alert("offsetAdd: ",offsetAdd);
        // $( ".addVenCountry" ).scrollTop( -100 );
         
      },
   'focusout .addVenState': function(){

         // alert("city");
         var myFuncVar = $(".addVenState").val();
         if (myFuncVar==null||myFuncVar==""||myFuncVar=='--Select--') {
            $(".SpanBusinessState").addClass("ErrorRedText");
            $(".addVenState").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessState" ).text("Please select State" );

         } else {
            $(".SpanBusinessState").removeClass("ErrorRedText");
            $(".addVenState").removeClass("SpanLandLineRedBorder");

         }
      },
   'focusout .addVenCity': function(){
         // alert("city");
         var myFuncVar = $(".addVenCity").val();
         if (myFuncVar==null||myFuncVar==""||myFuncVar=='--Select--') {
            $(".SpanBusinessCity").addClass("ErrorRedText");
            $(".addVenCity").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessCity" ).text("Please select City" );

         } else {
            $(".SpanBusinessCity").removeClass("ErrorRedText");
            $(".addVenCity").removeClass("SpanLandLineRedBorder");

         }
        // $('.addVenArea').focus();
      },
   'focusout .addVenArea': function(){
         // alert("Area");

         var myFuncVar = $(".addVenArea").val();
         if (myFuncVar==null||myFuncVar==""||myFuncVar=='--Select--') {
            $(".SpanBusinessArea").addClass("ErrorRedText");
            $(".addVenArea").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessArea" ).text("Please select Area" );

         } else {
            $(".SpanBusinessArea").removeClass("ErrorRedText");
            $(".addVenArea").removeClass("SpanLandLineRedBorder");

         }
      },
      'focusout .businessZipCodeC': function(){
         var myFuncVar = $(".businessZipCodeC").val();
         // alert(myFuncVar);
         // var nameRegex = /^[A-Za-z0-9 ]{2,15}$/;
         if (!myFuncVar&&myFuncVar==null&&myFuncVar=='') {
            $(".SpanBusinessZipCode").addClass("ErrorRedText");
            $(".businessZipCodeC").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessZipCode" ).text("Please select Zip Code" );

         } else {
            $(".SpanBusinessZipCode").removeClass("ErrorRedText");
            $(".businessZipCodeC").removeClass("SpanLandLineRedBorder");

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
            $( ".SpanBusinessLatitude" ).text("" );
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
            $( ".SpanBusinessLongitude" ).text("" );
         }
      },
});
// Vendor Business Information End

// Vendor Business OpenAndClose Start
Template.addvendorOpeningAndClosing.events({
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
      'focusout #businessAltMobile': function(){
         var myFuncVar = $("#businessAltMobile").val();
         // var nameRegex = /^(\+91\s|\+91-|\+91|0)?\d{10}$/;
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

         // if (myFuncVar==null||myFuncVar=="") {
         //    $(".SpanAltMobile").removeClass("ErrorRedText");
         //    $(".businessAltMobileC").removeClass("SpanLandLineRedBorder");

         // } else if (!myFuncVar.match(nameRegex)||myFuncVar.length<10){
         //    $(".SpanAltMobile").addClass("ErrorRedText");
         //    $(".businessAltMobileC").addClass("SpanLandLineRedBorder");
         //    $( ".SpanAltMobile" ).text("Please Enter Valid 10 digit Mobile Number" );
         // }
      },
      'focusout #businessWebAdress': function(){
         var myFuncVar = $("#businessWebAdress").val();
// /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|(www\.|(?!www\.))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/
         var nameRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
         // var nameRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,}|[a-zA-Z0-9]\.[^\s]{2,})/;
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
Template.addvendorAboutOwner.events({
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
   'keydown #businessMobile': function(e){
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
   'focusout #businessMobile': function(){
         var myFuncVar = $("#businessMobile").val();
         var nameRegex = /^\d+$/;
         if(myFuncVar){
            if (!myFuncVar.match(nameRegex)||myFuncVar.length<10) {
               $(".SpanBusinessMobile").addClass("ErrorRedText");
               $(".businessMobileC").addClass("SpanLandLineRedBorder");
               $( ".SpanBusinessMobile" ).text("Please Enter Valid 10 digit Mobile number" );

            } else {
               $(".SpanBusinessMobile").removeClass("ErrorRedText");
               $(".businessMobileC").removeClass("SpanLandLineRedBorder");
            }
         }
         if(myFuncVar==null ||myFuncVar==''){
            $(".SpanBusinessMobile").removeClass("ErrorRedText");
            $(".businessMobileC").removeClass("SpanLandLineRedBorder");
         }
         
      },
   'focusout #businessEmail': function(){
         var myFuncVar = $("#businessEmail").val();
         var nameRegex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
         if(myFuncVar){
            if (!myFuncVar.match(nameRegex)) {
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
   
});
// Vendor Business About Owner End
