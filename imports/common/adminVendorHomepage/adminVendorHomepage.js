import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Template } from 'meteor/templating';
import { Area } from '/imports/api/masterData/areaMaster.js';
import { City } from '/imports/api/masterData/cityMaster.js';
import '/imports/common/common.js';
import './adminVendorHomepage.html';
import '../../general/mainBusinessSearch/mainBusinessSearch.js';
import '/imports/general/homepage/homepageBanner.js';

Template.adminVendorHomepage.onCreated(function(){
    // FlowRouter.go('/claim');
    $('html, body').scrollTop(0);
	$(window).on('popstate', function() {
    	$('.modal').modal('hide');
    	$('.modal-backdrop').hide();
	});
});

// var options = {
//   keepHistory: 0,
//   localSearch: false
// };

// var fields = ['city'];
// citySearch1 = new SearchSource('city', fields, options);
// var dataIndex = 0;


// Template.adminVendorHomepage.onRendered(function(){
//   $(window).on('popstate', function() {
//     $('.modal').modal('hide');
//     $('.modal-backdrop').hide();
//   });
  
//   Session.set('showGridView',true);
  
//   var userId = Meteor.userId();
//   if(userId){
//     var cityObject = Meteor.users.findOne({"_id":userId});
//     if(cityObject.selectedCity){
//       var currentCity = cityObject.selectedCity;
//     }else {
//       var sesVal = Session.get('userSelecetedRXTCity');
//       if(sesVal){
//         currentCity = sesVal;
//       }else{
//         var currentCity = "Pune";
//       }
//     }
//   }else{
//     var sesVal = Session.get('userSelecetedRXTCity');
//     if(sesVal){
//       currentCity = sesVal;
//     }else{
//       var currentCity = "Pune";
//     }
//   }
//   // $("#video").get(0).play();
//   $('#getCity').val(currentCity);
//   $('.curUserCity').text(currentCity);
  
//     // var video = document.getElementById("myVideo").autoplay;
//     // console.log('videoHome:',videoHome);
//     // video.autoplay = true;
//     // video.load();
// });

// Template.adminVendorHomepage.helpers({
//   shwCityAndArea(){
//       var currentCityList=citySearch1.getData();
//       var currentAreaList = [];

//       var userId = Meteor.userId();
//       if(userId){
//         var cityObject = Meteor.users.findOne({"_id":userId});
//         if(cityObject.selectedCity){
//           var currentCity = cityObject.selectedCity;
//         }else {
//           // var currentCity = "Pune";
//           var sesVal = Session.get('userSelecetedRXTCity');
//           if(sesVal){
//             currentCity = sesVal;
//           }else{
//             var currentCity = "Pune";
//           }
//         }
//       }else{
//         var sesVal = Session.get('userSelecetedRXTCity');
//         if(sesVal){
//           currentCity = sesVal;
//         }else{
//           var currentCity = "Pune";
//         }

//         // var city = $('#getCity').val();
//         // if(city){
//         //   var currentCity = city;
//         // }else{
//         //   var currentCity = "Pune";
//         // }
       
//         // Most Important Sesion to pass Dynamic City to footer links
//         Session.set("rxtNxtCityDatlist",currentCity);
//       }

//       var currentAreaList = Area.find({'city':currentCity,"status":"active"}).fetch();
//       var areaArray = [];
//       var areaList = [];
//       if(currentAreaList){
//         for(var i=0;i<currentAreaList.length;i++){
//           areaArray.push({'area':currentAreaList[i].area})
//         }//i
//         var pluck = _.pluck(areaArray, 'area');
//         data = _.uniq(pluck);
//         // console.log('data ...',data);

//         if(data.length>0){
//           for(var j=0;j<data.length;j++){
//               var uniqueArea = data[j];
//               var areaLists = Area.findOne({'area':uniqueArea});
//               if(areaLists){
//                 areaList.push({
//                               'area'    : uniqueArea,
//                               'country' : areaLists.country,
//                               'state'   : areaLists.state,
//                               'city'    : areaLists.city,
//                               'zipcode' : areaLists.zipcode,
//                               'status'  : areaLists.status,
//                             });
//               }
//           }//j
//         }//length
//       }//currentAreaList

//       areaList.sort(function(a, b) {
//         var textA = a.area.toUpperCase();
//         var textB = b.area.toUpperCase();
//         return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
//       });
//       currentAreaList = areaList;
//       return {currentCityList, currentAreaList};
//   },
// });


// Template.adminVendorHomepage.events({
//   'click .TopCity':function(e){
//     // $("#getCity").val($(e.currentTarget).text());var id=$(e.currentTarget).text().trim();id=id.toLowerCase().replace(/\b[a-z]/g,function(e){return e.toUpperCase()}),Session.set("userSelectedCity",id),$("#changeCityModal").modal("hide");var cityCookie="getCurrentCityName="+id;document.cookie=cityCookie;var currentCity=Cookie.get("getCurrentCityName");if(currentCity)$(".curUserCity").text(currentCity);else{var sesCity=Session.get("userSelectedCity");sesCity?$(".curUserCity").text(sesCity):$(".curUserCity").text("Pune")}
//   },

//   'click .searchBusList':function() {
//     $(".homeSearchBarList").addClass("searchDisplayShow").removeClass("searchDisplayHide");
//     var searchString=$("#getBusiness").val().split(' ').join('-');
//     var currentCity = $('#getCity').val();
//     var currentArea = $('#getArea').val().split(' ').join('-');

//     if(searchString){
//       var path =  "/search/"+currentCity+"/"+currentArea+"/"+searchString;
//       FlowRouter.go(path);
//     }else{
//       var path =  "/search/"+currentCity+"/"+currentArea;
//       FlowRouter.go(path);
//     }
//   },
  
//   'keypress #getCity': function(e) {
//     if(e.keyCode === 13){
//       $('#changeCityModal').modal('hide');
//     }
//     var text=$('#getCity').val().trim();

//     if(!text){
//       text = "Pune";
//     }
//     citySearch1.search(text);
//     $(".curUserCity").text(text);
//     Session.set("userSelecetedRXTCity",text);

//     var userId = Meteor.userId();
//     if(userId){
//       Meteor.call("storeUserSelectedCity", userId, text);
//     }else{
//       Session.set("rxtNxtCityDatlist",text);
//     }
//   },

//   'change #getCity': function(e) {
//     // if(e.keyCode === 13){
//     $('#changeCityModal').modal('hide');
//     $('.modal-backdrop').hide();
//     // }
//     var text=$('#getCity').val().trim();

//     if(!text){
//       text = "Pune";
//     }
//     $(".curUserCity").text(text);
//     Session.set("userSelecetedRXTCity",text);

//     var userId = Meteor.userId();
//     if(userId){
//       Meteor.call("storeUserSelectedCity", userId, text);
//     }else{
//       Session.set("rxtNxtCityDatlist",text);
//     }
//   },

//   'click #getCity':function(e){
//     var text=$('#getCity').val().trim();
//     if(!text){
//       text = "Pune";
//     }

//     citySearch1.search(text);
//     $(".curUserCity").text(text);
//   },
//   'click .cityShowCloseModal': function(event){
//       var text=$('#getCity').val().trim();
//       if(!text){
//         text = "Pune";
//       }
//       $(".curUserCity").text(text);
//       Session.set("userSelecetedRXTCity",text);
  
//       var userId = Meteor.userId();
//       if(userId){
//         Meteor.call("storeUserSelectedCity", userId, text);
//       }
//   },

// });

AdminVendorHomepage = function () {  
  BlazeLayout.render("anonymousUserLayout",{main: 'adminVendorHomepage'});
}

export { AdminVendorHomepage };