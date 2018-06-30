import { Business } from '/imports/api/businessMaster.js';

import { State } from '/imports/api/masterData/stateMaster.js';
import { City } from '/imports/api/masterData/cityMaster.js';
import { Area } from '/imports/api/masterData/areaMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


import './VendorBusinessInformation.html'
// Template.vendorBusinessInformation.onRendered(function(){

// });

Template.vendorBusinessInformation.events({
  'keydown .businessAbtBus':function(){
      setTimeout(function() {
         var aboutBus = $('.businessAbtBus').val();
         if(aboutBus){
            var aboutBuslen = aboutBus.length;
            var remainText = 2500- aboutBuslen;
            $('.textRemain').text(remainText + ' Characters Remaining');
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
  'click .checkLink': function (event) {
    event.preventDefault();
    var myFuncVarLink = $("#businessLink").val().replace(/ /g,'');
    var data = Business.findOne({"businessLink":myFuncVarLink});
    var inputBoxLink = Session.get('inputBoxLink');
    $( ".SpanBusinessLink" ).text("");
    if(data){
      if(myFuncVarLink==inputBoxLink){
        $(".SpanBusinessLink").removeClass("linkAvail ErrorRedText hvr-buzz-out");
        $(".businessLinkC").removeClass("SpanLandLineRedBorder");
      }
      else if(inputBoxLink!=myFuncVarLink){
        $(".SpanBusinessLink").addClass("ErrorRedText hvr-buzz-out");
        $(".businessLinkC").addClass("SpanLandLineRedBorder");
        $(".SpanBusinessLink").text("Link already exists, Please enter different link");
        $(".SpanBusinessLink").removeClass("linkAvail");
      }
    }      
    else {
        $(".SpanBusinessLink").removeClass("ErrorRedText hvr-buzz-out");
        $(".SpanBusinessLink").addClass("linkAvail");
        $(".businessLinkC").removeClass("SpanLandLineRedBorder");
        $(".SpanBusinessLink").text("Link Available");
    }
    $("#businessLink").val(myFuncVarLink.replace(/ /g,''));
  },
  'keyup .businessTitleC':function(){
    if($('.businessLinkC').val().length <= 50 ){
      // $('.businessLinkC').val(($('#businessTitle').val()).replace(/ /g,'').substring(0,50));
    }
  },

  "keyup .businessLat": _.throttle(function(e) {
       initialize();
     }, 200),

   "keyup .businessLng": _.throttle(function(e) {
       initialize();
     }, 200)
});


Template.vendorBusinessInformation.helpers({
    exampleMapOptions: function() {
      // Make sure the maps API has loaded
      if (GoogleMaps.loaded()) {
        return {
          // marker
          center: new google.maps.LatLng(18.5158,73.9272),
          zoom: 10,

        };
      }
    },
  });

// Google Map Start
if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load({ v: '3', key: 'AIzaSyDOuLtZwDZ_ObFu6ASTK8S2wq9mWWShZCA', libraries: 'geometry,places' });
  });
}

Template.vendorBusinessInformation.onRendered(function(){
  GoogleMaps.load();

  var country = $(".venCountry").val();
  Session.set("addVenCountrySesEdit",country);
});

Template.vendorBusinessInformation.onCreated(function() {
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
// Google Map End
Template.vendorBusinessInformation.events({

  'submit .vendorBusInfoAC': function(event){
    event.preventDefault();
    var bizLink = FlowRouter.getParam('businessLink');
    var data = Business.findOne({'businessLink':bizLink}); 
    var id = data._id;
    var venState = $('.venState').val();
    var venCity  = $('.venCity').val();
    var venArea  = $('.venArea').val();
    var venPin   = $('.venPin').val();

    var myFuncVarLink = $("#businessLink").val().replace(/ /g,'');
    var dataLink = Business.findOne({"businessLink":myFuncVarLink});
    var inputBoxLink = Session.get('inputBoxLink');

    var nameRegexr = /^[A-Za-z0-9-]{1,50}$/;
    if(myFuncVarLink==null||myFuncVarLink==''||!myFuncVarLink.match(nameRegexr)){
      $(".SpanBusinessLink").addClass("ErrorRedText hvr-buzz-out");
      $(".businessLinkC").addClass("SpanLandLineRedBorder");
      $(".SpanBusinessLink").text("Please valid Business link");
      $(".SpanBusinessLink").removeClass("linkAvail");
    } else{
      if(dataLink){
        if(myFuncVarLink==inputBoxLink){
          $(".SpanBusinessLink").removeClass("linkAvail ErrorRedText hvr-buzz-out");
          $(".businessLinkC").removeClass("SpanLandLineRedBorder");
        }
        else if(inputBoxLink!=myFuncVarLink){
          $(".SpanBusinessLink").addClass("ErrorRedText hvr-buzz-out");
          $(".businessLinkC").addClass("SpanLandLineRedBorder");
          $(".SpanBusinessLink").text("Link already exists, Please enter different link");
          $(".SpanBusinessLink").removeClass("linkAvail");
        }
      }      
      else {
          $(".SpanBusinessLink").removeClass("ErrorRedText hvr-buzz-out");
          $(".SpanBusinessLink").addClass("linkAvail");
          $(".businessLinkC").removeClass("SpanLandLineRedBorder");
          $(".SpanBusinessLink").text("Link Available");
      }
    }

    var formValues = {
      "businessTitle"     : event.target.businessTitle.value,
      "businessLink"      : myFuncVarLink,
      "businessAboutBus"  : event.target.businessAbtBus.value.trim(),
      "businessEmailId"   : event.target.businessEmailId.value,
      "businessAddress"   : event.target.businessAddress.value,
      "businessCountry"   : event.target.businessCountry.value,
      "businessState"     : event.target.businessState.value,
      "businessCity"      : event.target.businessCity.value,
      "businessArea"      : event.target.businessArea.value,
      "businessZipCode"   : event.target.businessZipCode.value,
      "businessLatitude"  : event.target.businessLatitude.value,
      "businessLongitude" : event.target.businessLongitude.value,
    }

    // if(formValues.businessLatitude){
    //   $(".SpanBusinessLatitude").removeClass("ErrorRedText");
    //   $(".businessLat").removeClass("SpanLandLineRedBorder");
    //   $( ".SpanBusinessLatitude" ).text("" );
    // }
    // if(formValues.businessLongitude){
    //    $(".SpanBusinessLongitude").removeClass("ErrorRedText");
    //     $(".businessLng").removeClass("SpanLandLineRedBorder");
    //     $( ".SpanBusinessLongitude" ).text("" );
    // }

    var errorIn = '';
    if ($(".ErrorRedText").length > 0) {
      errorIn = "true";
    } 

    if(errorIn!="true" && formValues.businessTitle && formValues.businessLink && formValues.businessEmailId && formValues.businessAddress && formValues.businessCountry && formValues.businessState && formValues.businessCity && formValues.businessArea && formValues.businessZipCode && venState != "--Select--" && venCity != "--Select--" && venArea != "--Select--") {
      // if(venState != "--Select--" && venCity != "--Select--" && venArea != "--Select--") {
        Meteor.call('updateBusInfoAcc', id, formValues, 
          function(error,result){
            if(error){
              // Bert.alert('There is some error in submitting this form!','danger','growl-top-right');
              return;
            }else{
              var newBusinessId = result;
              Bert.alert('Business Information saved successfully!','success','growl-top-right');

              var currentVendorURL = "/aboutBusiness";
              var currentPathURL = FlowRouter.current().path;

              var currentPathArray = currentPathURL.split('/');
              var currentpathstring =  currentVendorURL + '/' + currentPathArray[2];
              
              if (currentPathURL == currentpathstring) {
                  FlowRouter.go('/aboutBusiness/:businessLink',{'businessLink':formValues.businessLink});
              }else{
                  FlowRouter.go('/editBusinessAdmin/:businessLink',{'businessLink':formValues.businessLink});
              }

            }

          }
        );
      // } else {
      //     // Bert.alert('Select State, City, Area, Zipcode','danger','growl-top-right');
      // }
    }
    else {
        // Bert.alert('Please fill all the fields in form!','danger','growl-top-right');
        if (!formValues.businessState || venArea=='--Select--') {
          $(".SpanBusinessState").addClass("ErrorRedText");
          $(".venState").addClass("SpanLandLineRedBorder");
          $( ".SpanBusinessState" ).text("Please select State" );
        }
        if (!formValues.businessCity || venCity=='--Select--') {
          $(".SpanBusinessCity").addClass("ErrorRedText");
          $(".venCity").addClass("SpanLandLineRedBorder");
          $( ".SpanBusinessCity" ).text("Please select City" );
        }
        if (!formValues.businessArea || venArea=='--Select--') {
          $(".SpanBusinessArea").addClass("ErrorRedText");
          $(".venArea").addClass("SpanLandLineRedBorder");
          $( ".SpanBusinessArea" ).text("Please select Area" );
        }
        if (!formValues.businessZipCode || venPin==null || venPin=='') {
          $(".SpanBusinessZipCode").addClass("ErrorRedText");
          $(".venPin").addClass("SpanLandLineRedBorder");
          $( ".SpanBusinessZipCode" ).text("Please select Zip Code" );
        }
        // if(!formValues.businessLatitude){
        //   $(".SpanBusinessLatitude").addClass("ErrorRedText");
        //   $(".businessLat").addClass("SpanLandLineRedBorder");
        //   $( ".SpanBusinessLatitude" ).text("Please select or enter valid Latitude" );
        // }
        // if(!formValues.businessLongitude){
        //    $(".SpanBusinessLongitude").addClass("ErrorRedText");
        //     $(".businessLng").addClass("SpanLandLineRedBorder");
        //     $( ".SpanBusinessLongitude" ).text("Please select or enter valid Longitude" );
        // }
        $('.SpanLandLineRedBorder:visible:first').focus();
    }

    
    
  },
  'change .venState': function (events) {
    var state = $(".venState").val();
    Session.set("addVenStateSesEdit",state);

    var country = Session.get("addVenCountrySesEdit");
    var states = State.find({"country":country,"status":"active"}).fetch();

  },
  'change .venCity': function (events) {
    var city = $(".venCity").val();
    Session.set("addVenCitySesEdit",city);

    var country = Session.get("addVenCountrySesEdit");
      var state = Session.get("addVenStateSesEdit");
      var cities = City.find({"country":country,"state":state,"status":"active"}).fetch();
  },
  'change .venArea': function (events) {
    var area = $(".venArea").val();
    Session.set("addVenAreaSesEdit",area);

    var country = Session.get("addVenCountrySesEdit");
      var state = Session.get("addVenStateSesEdit");
      var city = Session.get("addVenCitySesEdit");
      var areas = Area.find({"country":country,"state":state,"city":city,"status":"active"}).fetch();
  },
});

