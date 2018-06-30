import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';
import { Business } from '/imports/api/businessMaster.js';

import { State } from '/imports/api/masterData/stateMaster.js';
import { City } from '/imports/api/masterData/cityMaster.js';
import { Area } from '/imports/api/masterData/areaMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


import './addvendorBusInfo.html';
import '../vendor.js';
import '../../notifications/sendMailnNotification.js';


var businessLink = Session.get("backlinkurl");
// console.log('businessLink :',businessLink);


Template.addVendorBusInfo.helpers({
   // To retrive Data on back button
   completedPercentShow(data){
      if(data==0){
         return false;
      }else{
         return true;
      }
   },

   vendorBusInfoRetrive(){

         if(Session.get("backlinkurl")){
            // console.log('in back url');
            var businessLink = Session.get("backlinkurl");
            console.log('businessLink :',businessLink);
            console.log('Session.get("backlinkurl") :',Session.get("backlinkurl"));
            var busData = Business.findOne({"businessLink":businessLink});
            busData.completedPercent = 25;            
         }else{
            // console.log('in back url');
            
            var busData = {
               businessState     : '',
               businessCity      : '',
               businessArea      : '',
               businessZipCode   : '',
               businessLatitude  : 18.5158,
               businessLongitude : 73.9272,
               completedPercent  : 0,
            };
         }

         // Match states
         var states = State.find({"country":"India","status":"active"}).fetch();
         if(states){
            busData.states = [];
            for(i=0; i<states.length; i++){
                  if(busData.businessState == states[i].state){
                     var stateObj = {'stateName':states[i].state,'selected':'selected'};
                     busData.states.push(stateObj);
                  }  else{
                     var stateObj = {'stateName':states[i].state,'selected':''};
                     busData.states.push(stateObj);
                  }
                     // console.log('selected stateValue = ', stateObj);

            }
         }

         // Match cities
         if(Session.get('addVenStateSes')){
            var stateValue = Session.get('addVenStateSes');
         }  else{
            var stateValue = busData.businessState;
         }
         var cities = City.find({"country":"India", "state":stateValue,"status":"active"}).fetch();
         if(cities){
            busData.cities = [];
            for(i=0; i<cities.length; i++){
               if(busData.businessCity == cities[i].city){
                  var cityObj = {'cityName':cities[i].city,'selected':'selected'};
                  busData.cities.push(cityObj);
               }  else{
                  var cityObj = {'cityName':cities[i].city,'selected':''};
                  busData.cities.push(cityObj);
               }
            }
         }

         // Match areas
         if(Session.get('addVenCitySes')){
            var cityValue = Session.get('addVenCitySes');
         }  else{
            var cityValue = busData.businessCity;
         }
         var areas = Area.find({"country":"India", "state":stateValue, "city":cityValue,"status":"active"}).fetch();
         if(areas){
            busData.areas = [];
            for(i=0; i<areas.length; i++){
               if(busData.businessArea == areas[i].area){
                  var areaObj = {'areaName':areas[i].area,'selected':'selected'};
                  busData.areas.push(areaObj);
               }  else{
                  var areaObj = {'areaName':areas[i].area,'selected':''};
                  busData.areas.push(areaObj);
               }
            }
         }
         var areaActiveList = busData.areas;
         busData.areas = _.uniq(areaActiveList, function(p){ return p.areaName; });

         // Match zipcodes
         if(Session.get('addVenAreaSes')){
            var areaValue = Session.get('addVenAreaSes');
         }  else{
            var areaValue = busData.businessArea;
         }
         var zipcodes = Area.find({"country":"India", "state":stateValue,"city":cityValue,"area":areaValue,"status":"active"}).fetch();
         if(zipcodes){
            busData.zipcodes = [];
            for(i=0; i<zipcodes.length; i++){
               if(busData.businessZipCode == zipcodes[i].zipcode){
                  var zipcodeObj = {'zipcode':zipcodes[i].zipcode,'selected':'selected'};
                  busData.zipcodes.push(zipcodeObj);
               }  else{
                  var zipcodeObj = {'zipcode':zipcodes[i].zipcode,'selected':''};
                  busData.zipcodes.push(zipcodeObj);
               }
            }
         }  
         // console.log(busData);
         return busData;
      // }
   },
});


Template.addVendorBusInfo.events({
   'keydown .businessAbtBus':function(event){
      setTimeout(function() {
         var aboutBus = $('.businessAbtBus').val();
         // console.log('aboutBus :',aboutBus);
         if(aboutBus){
            var aboutBuslen = aboutBus.length;
            var remainText = 2500- aboutBuslen;
            $('.textRemain').text(remainText + ' Characters Remaining');
            if (aboutBuslen > 150) {
               $(".SpanbusinessAbtBus").removeClass("ErrorRedText");
               $(".businessAbtBus").removeClass("SpanLandLineRedBorder");
               $( ".SpanbusinessAbtBus" ).text('');
            }
         }else{
            $('.textRemain').text('2500 Characters Remaining');   
         }
      }, 1);
   },
   'focusout .businessAbtBus':function(){
        var myFuncVar = $(".businessAbtBus").val();
        if ((myFuncVar.length>0&&myFuncVar.length<150)||myFuncVar.length>2500) {
            $(".SpanbusinessAbtBus").addClass("ErrorRedText");
            $(".businessAbtBus").addClass("SpanLandLineRedBorder");
            $( ".SpanbusinessAbtBus" ).text("Please Enter About Business Description Minimum 150 and Maximum 2500 Characters" );

        } else {
            $(".SpanbusinessAbtBus").removeClass("ErrorRedText");
            $(".businessAbtBus").removeClass("SpanLandLineRedBorder");
            $( ".SpanbusinessAbtBus" ).text('');
        }
    
   },
   'keydown .businessLat':function(e){
       if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A, Command+A, Ctrl+C, Ctrl+V
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true))||
            (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true))||
            (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true))||
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode===189  || e.keyCode===32) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
   },
   'keydown .businessLng':function(e){
       if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A, Command+A, Ctrl+C, Ctrl+V
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true))||
            (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true))||
            (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true))||
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40) || e.keyCode===189  || e.keyCode===32) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
   },

   'change .addVenState': function () {
      var state = $(".addVenState").val();
      Session.set("addVenStateSes",state);

      var myFuncVar = $(".addVenState").val();
         if (myFuncVar==null||myFuncVar==""||myFuncVar=='--Select--') {
            $(".SpanBusinessState").addClass("ErrorRedText");
            $(".addVenState").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessState" ).text("Please select Valid State" );
         } else {
            $(".SpanBusinessState").removeClass("ErrorRedText");
            $(".addVenState").removeClass("SpanLandLineRedBorder");
         }
   },
   'change .businessCityC': function () {
      var city = $(".businessCityC").val();
      Session.set("addVenCitySes",city);

      var myFuncVar = $(".addVenCity").val();
      if (myFuncVar==null||myFuncVar==""||myFuncVar=='--Select--') {
         $(".SpanBusinessCity").addClass("ErrorRedText");
         $(".addVenCity").addClass("SpanLandLineRedBorder");
         $( ".SpanBusinessCity" ).text("Please Enter Valid City" );
      } else {
         $(".SpanBusinessCity").removeClass("ErrorRedText");
         $(".addVenCity").removeClass("SpanLandLineRedBorder");
      }
   },
   'change .businessAreaC': function () {
      var area = $(".businessAreaC").val();
      Session.set("addVenAreaSes",area);

      var myFuncVar = $(".addVenArea").val();
      if (myFuncVar==null||myFuncVar==""||myFuncVar=='--Select--') {
         $(".SpanBusinessArea").addClass("ErrorRedText");
         $(".addVenArea").addClass("SpanLandLineRedBorder");
         $( ".SpanBusinessArea" ).text("Please Enter Valid Business Area" );
      } else {
         $(".SpanBusinessArea").removeClass("ErrorRedText");
         $(".addVenArea").removeClass("SpanLandLineRedBorder");
      }
      if (!myFuncVar&&myFuncVar==null&&myFuncVar=='') {
         $(".SpanBusinessZipCode").addClass("ErrorRedText");
         $(".businessZipCodeC").addClass("SpanLandLineRedBorder");
         $( ".SpanBusinessZipCode" ).text("Please Select Valid Zip Code" );
      } else {
         $(".SpanBusinessZipCode").removeClass("ErrorRedText");
         $(".businessZipCodeC").removeClass("SpanLandLineRedBorder");
      }
   },
   'click .checkLink': function (event) {
      event.preventDefault();
      var myFuncVarLink = $("#businessLink").val();
      var nameRegex = /^[A-Za-z0-9-]{1,50}$/;

      if(myFuncVarLink==null||myFuncVarLink==""||!myFuncVarLink.match(nameRegex)){
         if(myFuncVarLink==null||myFuncVarLink==""){
            $(".SpanBusinessLink").addClass("ErrorRedText hvr-buzz-out");
            $(".SpanBusinessLink").text("Please enter link");
            $(".businessLinkC").addClass("SpanLandLineRedBorder");
            $(".SpanBusinessLink").removeClass("linkAvail");
         }else{
            $(".SpanBusinessLink").removeClass("linkAvail");
            $(".SpanBusinessLink").addClass("hvr-buzz-out ErrorRedText");
            $(".businessLinkC").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessLink" ).text("A valid link should be alphanumeric with only hyphens(-)");
         }
      } else {
         $(".SpanBusinessLink").text(" ");
         var data = Business.findOne({"businessLink":myFuncVarLink});
         if(data&&Session.get('backlinkurl') !== myFuncVarLink){
            $(".SpanBusinessLink").addClass("ErrorRedText hvr-buzz-out");
            $(".SpanBusinessLink").text("Link already exists");
            $(".businessLinkC").addClass("SpanLandLineRedBorder");
            $(".SpanBusinessLink").removeClass("linkAvail");
         } else {
            $(".SpanBusinessLink").addClass("linkAvail");
            $(".SpanBusinessLink").text("Link Available");
            $(".businessLinkC").removeClass("SpanLandLineRedBorder");
            $(".SpanBusinessLink").removeClass("ErrorRedText hvr-buzz-out");
         }
      }
      $("#businessLink").val(myFuncVarLink);
   },
   'focusout .businessLinkC': function(event){
      var myFuncVar = $("#businessLink").val().replace(/ /g,'');
      var myFuncVarLink = $("#businessLink").val().replace(/ /g,'');
      var data = Business.findOne({"businessLink":myFuncVarLink});
      var nameRegex = /^[A-Za-z0-9-]{1,50}$/;

      if (myFuncVar==null||myFuncVar==""||data||!myFuncVarLink.match(nameRegex)) {
         if(myFuncVarLink==null||myFuncVarLink==""){
            $(".SpanBusinessLink").addClass("hvr-buzz-out ErrorRedText hvr-buzz-out");
            $(".SpanBusinessLink").text("Please enter link");
            $(".businessLinkC").addClass("SpanLandLineRedBorder");
            $(".SpanBusinessLink").removeClass("linkAvail");
         }
         if(!myFuncVarLink.match(nameRegex)){
            $(".SpanBusinessLink").removeClass("linkAvail");
            $(".SpanBusinessLink").addClass("hvr-buzz-out ErrorRedText");
            $(".businessLinkC").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessLink" ).text("A valid link should be alphanumeric with only hyphens(-)" );
         }

         if(data&&Session.get('backlinkurl') !== myFuncVarLink){
            $(".SpanBusinessLink").removeClass("linkAvail");
            $(".SpanBusinessLink").addClass("hvr-buzz-out ErrorRedText");
            $(".businessLinkC").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessLink" ).text("A unique link should be alphanumeric with only hyphens(-)" );
         }
      }else {
         $(".SpanBusinessLink").removeClass(" ErrorRedText hvr-buzz-out");
         $(".SpanBusinessLink").addClass("linkAvail");
         $(".businessLinkC").removeClass("SpanLandLineRedBorder");
         $( ".SpanBusinessLink" ).text("Link Available");
      }
      $("#businessLink").val(myFuncVarLink);
   },
   'keypress .businessLinkC':function(event){
      var myFuncVar = $("#businessLink").val().replace(/ /g,'');
      var myFuncVarLink = $("#businessLink").val().replace(/ /g,'');
      var data = Business.findOne({"businessLink":myFuncVarLink});
      var nameRegex = /^[A-Za-z0-9-]{1,50}$/;

      if (myFuncVar==null||myFuncVar==""||data||!myFuncVarLink.match(nameRegex)) {
         if(myFuncVarLink==null||myFuncVarLink==""){
            $(".SpanBusinessLink").addClass("hvr-buzz-out ErrorRedText hvr-buzz-out");
            $(".SpanBusinessLink").text("Please enter link");
            $(".businessLinkC").addClass("SpanLandLineRedBorder");
            $(".SpanBusinessLink").removeClass("linkAvail");
         }
         if(!myFuncVarLink.match(nameRegex)){
            $(".SpanBusinessLink").removeClass("linkAvail");
            $(".SpanBusinessLink").addClass("hvr-buzz-out ErrorRedText");
            $(".businessLinkC").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessLink" ).text("A valid link should be alphanumeric with only hyphens(-)" );
         }

         if(data&&Session.get('backlinkurl') !== myFuncVarLink){
            $(".SpanBusinessLink").removeClass("linkAvail");
            $(".SpanBusinessLink").addClass("hvr-buzz-out ErrorRedText");
            $(".businessLinkC").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessLink" ).text("A unique link should be alphanumeric with only hyphens(-)" );
         }
      }else {
         $(".SpanBusinessLink").removeClass(" ErrorRedText hvr-buzz-out");
         $(".SpanBusinessLink").addClass("linkAvail");
         $(".businessLinkC").removeClass("SpanLandLineRedBorder");
         $( ".SpanBusinessLink" ).text("Link Available");
      }
      $("#businessLink").val(myFuncVarLink);
   },
   'keyup .businessTitleC':function(event){
      if($('.businessLinkC').val().length <= 50 ){
         $('.businessLinkC').val(($('#businessTitle').val()).replace(/ /g,'').substring(0,50));
      }
   },
   'change .businessTitleC':function(event){
      if($('.businessLinkC').val().length <= 50 ){
         $('.businessLinkC').val(($('#businessTitle').val()).replace(/ /g,'').substring(0,50));
      }
   },
   'focusout .businessTitleC': function(event) {
      var myBusinessTitle = $('#businessTitle').val().replace(/ /g,'');
      // To Reflect the link as per title in Link input box
      var myFuncVarLink = $("#businessLink").val();
      var myFuncVar = $("#businessTitle").val();

      var nameRegNotNum = /^\d+$/;
      var nameRegex = /^[A-Za-z0-9'\.\-\s\,/]{1,100}$/;
      var nameRegexLink = /^[A-Za-z0-9-]{1,50}$/;
      // myFuncVarLink = myFuncVarLink.substring(0, 50);


      if (myFuncVar==null||myFuncVar==""||!myFuncVar.match(nameRegex)||myFuncVar.match(nameRegNotNum)) {
         $(".linkValid").removeClass("linkAvail");
         $(".SpanBusinessTitle").addClass("ErrorRedText");
         $(".businessTitleC").addClass("SpanLandLineRedBorder");
         $( ".SpanBusinessTitle" ).text("A valid title should be alphanumeric with space, comma, hyphen(-) & fullstop." );
      } else {
         $(".SpanBusinessTitle").removeClass("ErrorRedText");
         $(".businessTitleC").removeClass("SpanLandLineRedBorder");
      }


      if(myFuncVarLink==null||myFuncVarLink==""||!myFuncVarLink.match(nameRegexLink)){
         if(myFuncVarLink==null||myFuncVarLink==""){
            $(".SpanBusinessLink").addClass("ErrorRedText hvr-buzz-out");
            $(".SpanBusinessLink").text("Please enter link");
            $(".businessLinkC").addClass("SpanLandLineRedBorder");
            $(".SpanBusinessLink").removeClass("linkAvail");
         }else{
            $(".SpanBusinessLink").removeClass("linkAvail");
            $(".SpanBusinessLink").addClass("hvr-buzz-out ErrorRedText");
            $(".businessLinkC").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessLink" ).text("A valid link should be alphanumeric with only hyphens(-)" );
         }
         
      } else {
         if(Session.get('backlinkurl') !== myFuncVarLink){
            var data = Business.findOne({"businessLink":myFuncVarLink});
            if(data){
               $(".SpanBusinessLink").addClass("ErrorRedText hvr-buzz-out");
               $(".SpanBusinessLink").text("Link already exists, Please enter different link");
               $(".businessLinkC").addClass("SpanLandLineRedBorder");
               $(".SpanBusinessLink").removeClass("linkAvail");
            } else {
               $(".SpanBusinessLink").addClass("linkAvail");
               $(".SpanBusinessLink").text("Link Available");
               $(".businessLinkC").removeClass("SpanLandLineRedBorder");
               $(".SpanBusinessLink").removeClass("ErrorRedText hvr-buzz-out");
            }
         }
      }

      $('.businessLinkC').val(myBusinessTitle.substring(0,50));
   },
   'submit .businessInfo': function(event){
      // alert('businessInfo');
      event.preventDefault();
      var id = FlowRouter.getParam('id');

      var venState = $('.addVenState').val();
      var venCity  = $('.addVenCity').val();
      var venArea  = $('.addVenArea').val();
      var venPin   = $('.businessZipCodeC').val();

      var myFuncVar = $("#businessLink").val();
      var myFuncVarLink = $("#businessLink").val().replace(/ /g,'');
      var data = Business.findOne({"businessLink":myFuncVarLink});
      var nameRegexLink = /^[A-Za-z0-9-]{1,50}$/;

      if (myFuncVar==null||myFuncVar==""||data||!myFuncVarLink.match(nameRegexLink)) {
         if(myFuncVarLink==null||myFuncVarLink==""){
            $(".SpanBusinessLink").text("Please enter link");
            $(".SpanBusinessLink").addClass("hvr-buzz-out ErrorRedText");
            $(".businessLinkC").addClass("SpanLandLineRedBorder");
            $(".SpanBusinessLink").removeClass("linkAvail");
         }
         if(!myFuncVarLink.match(nameRegexLink)){
            $(".SpanBusinessLink").addClass("hvr-buzz-out ErrorRedText");
            $(".businessLinkC").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessLink" ).text("A valid link should be alphanumeric with only hyphens(-)" );
         }
         if(data&&Session.get('backlinkurl') !== myFuncVarLink){
            $(".SpanBusinessLink").addClass("hvr-buzz-out ErrorRedText");
            $(".businessLinkC").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessLink" ).text("A unique link should be alphanumeric with only hyphens(-)" );
         }
      } else {
         $(".SpanBusinessLink").removeClass("ErrorRedText hvr-buzz-out");
         $(".SpanBusinessLink").addClass("linkAvail");
         $(".businessLinkC").removeClass("SpanLandLineRedBorder");
         $(".SpanBusinessLink").text("Link Available");
      }

      

      var formValues = {
         "businessTitle"     : event.target.businessTitle.value.trim(),
         "businessLink"      : event.target.businessLink.value.trim(),
         "businessAboutBus"  : event.target.businessAbtBus.value.trim(),
         "businessEmailId"   : event.target.businessEmailId.value.trim(),
         "businessAddress"   : event.target.businessAddress.value.trim(),
         "businessCountry"   : event.target.businessCountry.value,
         "businessState"     : event.target.businessState.value,
         "businessCity"      : event.target.businessCity.value,
         "businessArea"      : event.target.businessArea.value,
         "businessZipCode"   : event.target.businessZipCode.value,
         "businessLatitude"  : event.target.businessLatitude.value.trim(),
         "businessLongitude" : event.target.businessLongitude.value.trim(),
      }



      var errorIn = '';
      if ($(".ErrorRedText").length > 0) {
         errorIn = "true";
      }

      if(errorIn!="true" && formValues.businessTitle && formValues.businessLink && formValues.businessEmailId && formValues.businessAddress && formValues.businessCountry && formValues.businessState && formValues.businessCity && formValues.businessArea && formValues.businessZipCode &&venState != "--Select--" && venCity != "--Select--" && venArea != "--Select--"){
         if(Session.get("backlinkurl")){
            var busLink = Session.get("backlinkurl");
            Meteor.call('updateBusinessInfo', busLink, formValues, 
               function(error,result){
                  if(error){
                     // Bert.alert('There is some error in submitting this form!','danger','growl-top-right');
                     return;
                  } else{
                     var newBusinessId = result;
                     // console.log('newBusinessId: '+ newBusinessId);
                     Bert.alert('Business Information submitted successfully!','success','growl-top-right');
                     event.target.businessTitle.value     = '';
                     event.target.businessLink.value      = '';
                     event.target.businessAbtBus.value    = '';
                     event.target.businessEmailId.value   = '';
                     event.target.businessAddress.value   = '';
                     event.target.businessCountry.value   = '';
                     event.target.businessState.value     = '';
                     event.target.businessCity.value      = '';
                     event.target.businessArea.value      = '';
                     event.target.businessZipCode.value   = '';
                     event.target.businessLatitude.value  = '';
                     event.target.businessLongitude.value = '';

                     var currentVendorURL = "/addNewBusiness/businessInfo";
                     var currentPathURL = FlowRouter.current().path;

                     if (currentPathURL == currentVendorURL) {
                        FlowRouter.go('/addNewBusiness/openingAndClosingDays/:businessLink',{'businessLink':formValues.businessLink});
                     }else{
                        FlowRouter.go('/openingAndClosingDaysAdmin/:businessLink',{'businessLink':formValues.businessLink});
                     }
                  }

               }
            );
         }else{
            Meteor.call('insertBusinessInfo', formValues, 
               function(error,result){
                  if(error){
                     Bert.alert('There is some error in submitting this form!','danger','growl-top-right');
                     return;
                  } else{
                     var newBusinessId = result;
                     // console.log('newBusinessId: '+ newBusinessId);
                     Bert.alert('Business Information submitted successfully!','success','growl-top-right');
                     event.target.businessTitle.value     = '';
                     event.target.businessLink.value      = '';
                     event.target.businessAbtBus.value    = '';
                     event.target.businessEmailId.value   = '';
                     event.target.businessAddress.value   = '';
                     event.target.businessCountry.value   = '';
                     event.target.businessState.value     = '';
                     event.target.businessCity.value      = '';
                     event.target.businessArea.value      = '';
                     event.target.businessZipCode.value   = '';
                     event.target.businessLatitude.value  = '';
                     event.target.businessLongitude.value = '';

                     // ============================================================
                     //          Notification Email / SMS / InApp
                     // ============================================================
                     
                     var admin = Meteor.users.findOne({'roles':'admin'});
                    //  console.log('admin ',admin);
                     var vendorDetail = Meteor.users.findOne({'_id':Meteor.userId()});
                    //  console.log('vendorDetail ',vendorDetail);

                     if(admin&&vendorDetail){
                        var adminId = admin._id;

                        //Send Notification, Mail and SMS to Current Vendor
                        var vendorname    = vendorDetail.profile.name;
                        var username      = admin.profile.firstName;

                        var date        = new Date();
                        var currentDate = moment(date).format('DD/MM/YYYY');
                        var msgvariable = {
                                             '[vendorname]'    : vendorname,
                                             '[currentDate]'   : currentDate,
                                             '[businessName]'  : formValues.businessTitle
                                          };

                        var inputObj = {
                                          notifPath    : formValues.businessLink,
                                          to           : Meteor.userId(),
                                          templateName : 'Thanks for Registering New Business',
                                          variables    : msgvariable,
                                       }
                        sendInAppNotification(inputObj);

                        var inputObj = {
                                          notifPath     : formValues.businessLink,
                                          from          : adminId,
                                          to            : Meteor.userId(),
                                          templateName  : 'Thanks for Registering New Business',
                                          variables     : msgvariable,
                                       }
                        sendMailNotification(inputObj);

                        //Send Notification, Mail and SMS to Admin
                        var date       = new Date();
                        var currentDate = moment(date).format('DD/MM/YYYY');
                        var msgvariable = {
                                             '[vendorname]'    : vendorname,
                                             '[adminname]'     : username,
                                             '[currentDate]'   : currentDate,
                                             '[businessName]'  : formValues.businessTitle,
                                          };

                        var inputObj = {
                                          notifPath    : formValues.businessLink,
                                          to           : adminId,
                                          templateName : 'Vendor Added New Business',
                                          variables    : msgvariable,
                                       }
                        sendInAppNotification(inputObj);

                        var inputObj = {
                                          notifPath    : formValues.businessLink,
                                          from         : adminId,
                                          to           : adminId,
                                          templateName : 'Vendor Added New Business',
                                          variables    : msgvariable,
                                       }
                        sendMailNotification(inputObj);  
                     }
                     //============================================================
                     //          End Notification Email / SMS / InApp
                     //============================================================

                     var currentVendorURL = "/addNewBusiness/businessInfo";
                     var currentPathURL = FlowRouter.current().path;

                     if (currentPathURL == currentVendorURL) {
                        FlowRouter.go('/addNewBusiness/openingAndClosingDays/:businessLink',{'businessLink':formValues.businessLink});
                     }else{
                        FlowRouter.go('/openingAndClosingDaysAdmin/:businessLink',{'businessLink':formValues.businessLink});
                     }
                  }

               }
            );
         }
         
      } else {
         if (!formValues.businessTitle) {
            $(".SpanBusinessTitle").addClass("ErrorRedText");
            $(".businessTitleC").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessTitle" ).text("A valid title should be alphanumeric with space, comma, hyphen(-) & fullstop." );
            $(".linkValid").removeClass("linkAvail");
         }
         // if (formValues.businessAboutBus.length<150) {
         //    $(".SpanbusinessAbtBus").addClass("ErrorRedText");
         //    $(".businessAbtBus").addClass("SpanLandLineRedBorder");
         //    $( ".SpanbusinessAbtBus" ).text("Please Enter About Business information between 300-1000 characters" );
         // }
         if (!formValues.businessEmailId) {
            $(".SpanBusinessEmailId").addClass("ErrorRedText");
            $(".businessEmailIdC").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessEmailId" ).text("Please Enter Valid Business Email Id" );
         }
         if (!formValues.businessAddress) {
            $(".SpanBusinessAddress").addClass("ErrorRedText");
            $(".businessAddressC").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessAddress" ).text("Please Enter Valid Address" );
         }
         if (!formValues.businessState || venState=='--Select--') {
            $(".SpanBusinessState").addClass("ErrorRedText");
            $(".addVenState").addClass("SpanLandLineRedBorder");
            $(".SpanBusinessState").text("Please select State" );
         }
         if (!formValues.businessCity || venCity=='--Select--') {
            $(".SpanBusinessCity").addClass("ErrorRedText");
            $(".addVenCity").addClass("SpanLandLineRedBorder");
            $(".SpanBusinessCity").text("Please select City" );
         }
         if (!formValues.businessArea || venArea=='--Select--') {
            $(".SpanBusinessArea").addClass("ErrorRedText");
            $(".addVenArea").addClass("SpanLandLineRedBorder");
            $(".SpanBusinessArea").text("Please Enter select Area" );
         }
         if (!formValues.businessZipCode || venPin==null || venPin=='') {
            $(".SpanBusinessZipCode").addClass("ErrorRedText");
            $(".businessZipCodeC").addClass("SpanLandLineRedBorder");
            $( ".SpanBusinessZipCode" ).text("Please select Zip Code" );
         }
         $('.SpanLandLineRedBorder:visible:first').focus();
      }
   },
   // 'keypress .businessLat':
   "keyup .businessLat": _.throttle(function(e) {
       initialize();
     }, 200),

   "keyup .businessLng": _.throttle(function(e) {
       initialize();
     }, 200)

});


if (Meteor.isClient) {
   Meteor.startup(function() {
      GoogleMaps.load({ v: '3', key: 'AIzaSyDOuLtZwDZ_ObFu6ASTK8S2wq9mWWShZCA', libraries: 'geometry,places' });
   });
}

Template.addVendorBusInfo.onRendered(function(){
   GoogleMaps.load();
   $("#businessTitle").focus();
   $("html,body").scrollTop(0);

var businessLink = Session.get("backlinkurl");
            console.log('businessLink :',businessLink);
   // Session.set("addVenCountrySes","India");
   // Session.set("addVenStateSes","Maharashtra");
   // Session.set("addVenCitySes","Pune");
   // Session.set("addVenAreaSes","Magarpatta city");
});

Template.addVendorBusInfo.helpers({
   exampleMapOptions: function() {
      // Make sure the maps API has loaded
      if (GoogleMaps.loaded()) {
         return {
            // marker
            center: new google.maps.LatLng(18.5158,73.9272),
            zoom: 11,
         };
      }
   }, 
});

Template.addVendorBusInfo.onCreated(function() {
   // We can use the `ready` callback to interact with the map API once the map is ready.
   GoogleMaps.ready('exampleMap', function(map) {
      var map;
      initialize();
      google.maps.event.addDomListener(window, "load", initialize());
  });
});


function initialize() {
   var mylatOne = 18.5158;
   var mylngOne = 73.9272;
   var mylatTwo = $('#lat').val();
   var mylngTwo = $('#lng').val();
   if(mylatTwo) {
      var myLatlng = new google.maps.LatLng(mylatTwo, mylngTwo);
   }else {
      var myLatlng = new google.maps.LatLng(mylatOne, mylngOne);
   }

   // var myLatlng = new google.maps.LatLng(18.5158, 73.9272);
   var myOptions = {
      zoom: 15,
      center: myLatlng,
      // mapTypeId: google.maps.MapTypeId.ROADMAP
   };
   map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

   var marker = new google.maps.Marker({
      draggable: true,
      position: myLatlng,
      map: map,
      title: "Your location"
   });

   google.maps.event.addListener(marker, 'dragend', function (event) {
      document.getElementById("lat").value = event.latLng.lat();
      document.getElementById("lng").value = event.latLng.lng();

      // Remove Eror Class
      $(".SpanBusinessLatitude").removeClass("ErrorRedText");
      $(".businessLat").removeClass("SpanLandLineRedBorder");
      $( ".SpanBusinessLatitude" ).text("" );
      $(".SpanBusinessLongitude").removeClass("ErrorRedText");
      $(".businessLng").removeClass("SpanLandLineRedBorder");
      $( ".SpanBusinessLongitude" ).text("" );
   });
}

function markerCoords(markerobject){
   google.maps.event.addListener(markerobject, 'dragend', function(evt){
      infoWindow.setOptions({
         content: '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>'
      });
      infoWindow.open(map, markerobject);
   });

   google.maps.event.addListener(markerobject, 'drag', function(evt){
      // console.log("marker is being dragged");
   });     
}

addVendorBusInfoForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'addVendorBusInfo'});
}

export { addVendorBusInfoForm };
   