// import { Enquiry } from '/imports/api/enquiryMaster.js';
import '../../../common/searchinitialisation.js'
import { Business } from '/imports/api/businessMaster.js';
import { EnquiryImgUploadS3 } from '/client/cfsjs/enquiryImages.js';
import { BusinessImgUploadS3 } from '/client/cfsjs/businessImage.js';
import { Bert } from 'meteor/themeteorchef:bert';
// import { Review } from '/imports/api/reviewMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';



import './businessMap.html';
import './businessMapView.html';
import './allBusinessMapView.html';
import './thumbnailBusinessMap.html';



if (Meteor.isClient) {
   Meteor.startup(function() {
      GoogleMaps.load({ v: '3', key: 'AIzaSyCIxR9lCmbgk46wSoqQNpG7jwM4Hdx_-Jw', libraries: 'geometry,places' });
   });
}

// Template.businessList.onRendered(function() {
//    GoogleMaps.load();
// });

// console.log("Session.get('currentMarker'): ",Session.get('currentMarker'));

function sleep(milliseconds) {
   var start = new Date().getTime();
   for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
         break;
      }
   }
}

Template.businessMap.helpers({
   businessMapView: function() {
      var data = Template.currentData(self.view);
      if (!data) return;
      // Make sure the maps API has loaded
      if(data && GoogleMaps.loaded()){
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(geoSuccess);
            function geoSuccess(position) {
                   var currentLt = position.coords.latitude;
                   Session.set("currentLatMap",currentLt);
                   var currentLg = position.coords.longitude;
                   Session.set("currentLngMap",currentLg);
            }
        }
        var currentLat = Session.get("currentLatMap");
        var currentLng = Session.get("currentLngMap");

         return {
            center: new google.maps.LatLng(currentLat, currentLng),
            zoom: 13
         };
      }
   }
});


Template.businessMap.onCreated(function() {
   setTimeout(function() {
      GoogleMaps.ready('mapView', function(map) {
         if(GoogleMaps.loaded()){
            var businessDetails = businessSearch1.getData();
            var pinCodeArray = [];
            var contentString = [];
            var posArr = [];
            var infowindow = [];
            var mapPosition;

            var getUniqueLatLng = FlowRouter.getParam('currentMap');
            var uniqueLatitudeBusId = "";
            if(getUniqueLatLng){
                var uniqueLtLngPont = getUniqueLatLng.split('-');
                uniqueLatitudeBusId = uniqueLtLngPont[2];
                businessDetails = businessDetails.filter(function( obj ) {
                    return obj._id === uniqueLatitudeBusId;
                });
            }

            var markerBounds = new google.maps.LatLngBounds();
            if(businessDetails){
                for(n=0;n<businessDetails.length;n++){
                    var businessTitle    = businessDetails[n].businessTitle;
                    var city             = businessDetails[n].businessCity;
                    var addr             = businessDetails[n].businessAddress;
                    var city             = businessDetails[n].businessCity;
                    var state            = businessDetails[n].businessState;
                    var pincode          = businessDetails[n].businessZipCode;
                    var lat              = businessDetails[n].businessLatitude;
                    var lng              = businessDetails[n].businessLongitude;
                    var mobileNo         = businessDetails[n].businessMobile;
                    var landlineNo       = businessDetails[n].businessLandline;
                    var contactNumbers   = '';
                    var businessLink     = businessDetails[n].businessLink;

                    posArr[n]=[lat, lng];

                    // Mobile and Landline Number combination
                    if(mobileNo){
                        contactNumbers = mobileNo;
                        if(landlineNo){
                            contactNumbers = contactNumbers + ", " + landlineNo;
                        }
                    } else {
                        contactNumbers = landlineNo;
                    }

                    // Total No. of Votes
                    if(!businessDetails[n].totalVote){
                        businessDetails[n].totalVote = 0;
                    }

                    // Show Star Rating 
                    var ratingObj = businessDetails[n].businessRating;
                    
                    // InfoWindow Content String
                    contentString[n] = `<div class="">
                                            <div class=" thumbBusDivMarker">
                                                <div class=" thumImgDimMarkerNew">
                                                    <img  class="imgSearchMarkerNew" src="
                                                    ` + businessDetails[n].businessSelectedImagesNew.img + `
                                                    ">
                                                    <div class="starMarkerNew">
                                                    <div class="markerStarClass">
                                                        <div class="userBusinessRating col-lg-12 col-md-12 col-sm-12 col-xs-12"><div class="boxmain boxm1
                                                        ` + ratingObj.star1 + `
                                                        "></div><div class="boxmain boxm2 
                                                        ` + ratingObj.star2 + ` 
                                                        ">&nbsp;</div><div class="boxmain boxm3
                                                        ` + ratingObj.star3 + ` 
                                                        "></div><div class="boxmain boxm4
                                                        ` + ratingObj.star4 + ` 
                                                        ">&nbsp;</div><div class="boxmain boxm5
                                                        ` + ratingObj.star5 + ` 
                                                        "></div><div class="boxmain boxm6
                                                        ` + ratingObj.star6 + ` 
                                                        ">&nbsp;</div><div class="boxmain boxm7
                                                        ` + ratingObj.star7 + ` 
                                                        "></div><div class="boxmain boxm8
                                                        ` + ratingObj.star8 + ` 
                                                        "> &nbsp;</div><div class="boxmain boxm9
                                                        ` + ratingObj.star9 + ` 
                                                        "></div><div class="boxmain boxm10
                                                        ` + ratingObj.star10 + `
                                                        ">&nbsp;</div></div></div>
                                                    ` + `
                                                    <span class="MarkerNoOfVotes">
                                                    ` + businessDetails[n].totalVote + `
                                                    votes
                                                    </span>
                                                    </div>
                                                </div>
                                                <div class="markerSInfoMain">
                                                    <div class="markerSInfoModal markerBusTitle">
                                                    <strong>
                                            ` + businessTitle + `
                                                        </strong>
                                                    </div>
                                                    <div class="markerSInfoModal markerBusAddr">
                                            ` + addr + `
                                                    </div>
                                                    <div class="markerSInfoModal">
                                                        <img src="/images/search/phone-icon.png" style="display:inline-block">
                                                        <div style="display:inline-block">
                                            ` + contactNumbers + `
                                                        </div>
                                                    </div>
                                                    </div>
                                                </div>
                                            </div>
                                        `;

                    mapPosition = new google.maps.LatLng(posArr[n][0],posArr[n][1]);
                    markerBounds.extend(mapPosition);

                    var marker  =  new google.maps.Marker({
                                        position : mapPosition,
                                        icon     : "/images/location-icon.png",
                                        map      : map.instance,
                                    });

                    var InfoWindow = new google.maps.InfoWindow(), marker, n;

                    // To close info modal on mouse over/hover
                    google.maps.event.addListener(marker, 'mouseover', (function(marker,n) {
                        return function(){
                            InfoWindow.setContent(contentString[n]);
                            InfoWindow.open(map, marker);
                        }
                    })(marker, n));


                    // To close info modal on mouse out
                    google.maps.event.addListener(marker, 'mouseout', function(){
                        InfoWindow.close();
                    });
                }
            }
            map.instance.fitBounds(markerBounds);

            if(posArr.length<2){
                map.instance.setZoom(15);
            }

         }else{
            console.log('map not loading');
         }
      });
   }, 1);

});


