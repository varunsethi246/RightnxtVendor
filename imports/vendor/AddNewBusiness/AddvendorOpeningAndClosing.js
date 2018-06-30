
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


import { Business } from '../../api/businessMaster.js';

import '../vendor.js';
import '../categoriesSearchField/categoriesSearchField.js';
import '/imports/common/tagInputField/tagInputField.js';
import '/imports/vendor/AddNewBusiness/AddvendorOpeningAndClosing.html'

Meteor.subscribe('vendorBusiness');

var dataIndex = 0;
var dataIndexTag = 0;


Template.addvendorOpeningAndClosing.helpers({
  'editDisplayTags' : function (businesstags) {
    
    if(businesstags){
      var businesstagList = [];
      var counter = 0;
      for(var i = 0 ; i < businesstags.length ; i++){
        if(!businesstags[i] || businesstags[i] == "") continue;
        businesstagList[counter] = {
          tagIndex :  i,
          tags : businesstags[i],
        }; 
        counter = counter + 1;
      }
      // console.log('businesstagsList ' , businesstagList);
      dataIndexTag = businesstags.length;
      return businesstagList;
    }
  },
  'editDisplayCategories' : function (businesscategories) {
    // console.log('editDisplayCategories display');
    
    if(businesscategories){
      
      var categoryList = [];
      for(var i = 0 ; i < businesscategories.length ; i++){
        if(!businesscategories[i]) {
          continue;
        }
        var categoryString = businesscategories[i].toString();
        
        var category = categoryString.split('>');
        var tempCategoryListCollection = '';
        for(var j = 0 ; j < category.length; j++){
          if((category[j].trim() != '--') || !(typeof category[j] == 'undefined')){
            if(j == 0){
              tempCategoryListCollection = category[j].trim();
            }else{
              tempCategoryListCollection = tempCategoryListCollection + ' > ' + category[j].trim();
            }
          }
        }
        // console.log('tempCategoryListCollection |', tempCategoryListCollection,'|');
        selectedCategoriesList.push(tempCategoryListCollection);
        // if(category)
        var showData =category[4];
        if(category[4] == ' --' || !category[4]){
          showData = category[3];
        }
        if(category[3] == ' -- ' || !category[3]){
          showData = category[2];
        }
        if(category[2] == ' -- ' || !category[2]){
          showData = category[1];
        }
        if(category[1] == ' -- ' || !category[1]){
          showData = category[0];
        }
        if(category[0] == ' -- ' || !category[0]){
          continue;
        }
        
        categoryList[i] = {
            dataI     : i,
            category  : showData,
        };
      }
      dataIndex = businesscategories.length;
      // console.log('categoryList');
      return categoryList;
    }

  },
  vendorBusOpAndClsRetrive() {
    var BusLink = FlowRouter.getParam('businessLink');
    // Session.set("backlinkurl",BusLink);
    var busData = Business.findOne({"businessLink":BusLink});

    if(busData){
      var paymentModeE = {};
      
      
      if(busData.businessModeOfPay){
        paymentModeE = busData.businessModeOfPay;
        if (paymentModeE.CreditCard && paymentModeE.DebitCard && paymentModeE.Netbanking &&
            paymentModeE.Paytm && paymentModeE.Cheque && paymentModeE.Cash) {
          busData.businessModeOfPay.allVal = true;        
        }else{
          busData.businessModeOfPay.allVal = false;
        }
      }else {
        paymentModeE = {};
      }
      if(busData.businessMobile){
        busData.businessMobile=busData.businessMobile.substring(3);
      }
      if(busData.businessAltMobile){
        busData.businessAltMobile=busData.businessAltMobile.substring(3);
      }



      // console.log("paymentModeE: ",paymentModeE);
      // Payment Mode Option Text
      var finalText = "";
      var preText = "Select Payment Modes [Selected Options: ";
      var endText = "]";
      busData.paymentModeCash = false;
      var paySeparator = ", ";

      
      if(paymentModeE.Cash){
        if(finalText){
          finalText = finalText + paySeparator + "Cash";
        }else{
          finalText = "Cash";
        }
          busData.paymentModeCash = true;
      }

      if(paymentModeE.Cheque){
        if(finalText){
          finalText = finalText + paySeparator + "Cheque";
        }else{
          finalText = "Cheque";
        }
      }

      if(paymentModeE.CreditCard){
        if(finalText){
          finalText = finalText + paySeparator + "CreditCard";
        }else{
          finalText = "CreditCard";
        }
      }

      if(paymentModeE.DebitCard){
        if(finalText){
          finalText = finalText + paySeparator + "DebitCard";
        }else{
          finalText = "DebitCard";
        }
      }

      if(paymentModeE.Netbanking){
        if(finalText){
          finalText = finalText + paySeparator + "Netbanking";
        }else{
          finalText = "Netbanking";
        }
      }

      if(paymentModeE.Paytm){
        if(finalText){
          finalText = finalText + paySeparator + "Paytm";
        }else{
          finalText = "Paytm";
        }
      }

      if(finalText){
        finalText = preText + finalText + endText;
      } else {
        finalText = "Select Payment Modes";
      }
      
      busData.paymentModeETextString = finalText;
      if(busData.businessLandline || busData.businessMobile){
        busData.completedPercent = 50;
      }else{
        busData.completedPercent = 25;
      }


    }else{
      busData = {};
      busData.paymentModeETextString = "Select Payment Modes";
      busData.paymentModeCash = true;
      busData.completedPercent = 25;
    }

    var currentPathURL = FlowRouter.current().path;
    var splitPath = currentPathURL.split('/');

    if(splitPath[1] == "openingAndClosingDaysAdmin") {
      busData.currentPath = '/addnewbusinessAdmin'; 
    }
    if(splitPath[1] == "addNewBusiness") {
      // busData.currentPath = '/aboutBusiness/'+BusLink; 
      busData.currentPath = '/addNewBusiness/businessInfo'; 
    }

    return busData;
  },
  
});


  
Template.addvendorOpeningAndClosing.onRendered(function(){
  $("#agetCategory").focus();
  $("html,body").scrollTop(0);
  $('#datetimepicker4').datetimepicker({format: 'LT'});
  $('#datetimepicker3').datetimepicker({format: 'LT'});
  selectedCategoriesList = [];
  
});


Template.addvendorOpeningAndClosing.events({
  'click .backlinkClick':function(event){
    var BusLink = FlowRouter.getParam('businessLink');
    console.log(BusLink);
    Session.set("backlinkurl",BusLink);
  },
  'keypress #fromTime':function(event){
    return false;
  },
  'keypress #toTime':function(event){
    return false;
  },
  'click #fromTime':function(event){
    $( ".fromTimeC" ).click();
  },
  'click #toTime':function(event){
    $( ".toTimeC" ).click();
  },

  'click .showTagsAdd' : function(event){
      
      var businessLink = FlowRouter.getParam('businessLink');
      var getdataIndex = $(event.target).parent().attr('id');
      var ind = getdataIndex.split('-') ;
      
      Meteor.call('removeSelectedtags',businessLink,parseInt(ind[1]),function (err,res) {
        if(err){
          console.log('error ', err.reason);
        }
        else{
          // $(event.target).parent().remove();      
        }
      });
    },

  'click .showCategoryAdd' : function(event){
    var businessLink = FlowRouter.getParam('businessLink');
    
    var getdataIndex = $(event.target).parent().attr('id');
    
    var ind = getdataIndex.split('-') ;
    var integerInd = parseInt(ind[1]);

    var removeCategory = Business.findOne({"businessLink":businessLink} , { businesscategories : { $slice : [integerInd , 1] } });
    
    Meteor.call('removeSelectedCategories',businessLink,integerInd,function (err,res) {
      if(err){
        console.log('error ', err.reason);
      }
      else{
        
        var indexx = selectedCategoriesList.indexOf(removeCategory.businesscategories[integerInd]);
     
        if (indexx > -1) {
           selectedCategoriesList.splice(indexx, 1);
        } 
      }
    });
  },

  'focusin .vendorPayHideInput':function(){
    // $('.selectOption').css('background','red');
    $('.selectOption').focus();
    if($('.selectOption').focus()){
      $('.showOption').toggleClass( 'hideDiv');
      $('#checkAll').focus();
    }
  },

  'submit .businessOpenAndClose': function(event){
    event.preventDefault();
    var businessLink = FlowRouter.getParam('businessLink');
    
    // Use to add comma separated array in array
    
    var catglist = $('#asearchCategories').val();
    
    var sepratelist = catglist.split('|');
    var listCatg = [];
    var c = 0;
    for( var i = 0 ; i < sepratelist.length ; i++){
      if(sepratelist[i] == "" || sepratelist[i] == null)
        continue;
      listCatg[c] = sepratelist[i];
      c++;
    }
    var dbCategories = Business.findOne({"businessLink":businessLink});
    if(dbCategories){
      if(dbCategories.businesscategories){
        for(var j = 0 ; j < dbCategories.businesscategories.length ; j++){
          listCatg[c] = dbCategories.businesscategories[j];
          c++;
        }
      }
    }

    //tag List
      var tagList = $('#searchTags').val();
      
      var tagParts = tagList.split(",");
      var tagArray = [];
      var t = 0;
      for (var i = 0; i < tagParts.length; i++) {
        if(tagParts[i] == "" || tagParts[i] == null)
          continue;
        tagArray[t] = tagParts[i];
        t++;
      }
      if(dbCategories.businessTag){
        for(var j = 0 ; j < dbCategories.businessTag.length ; j++){
          tagArray[t] = dbCategories.businessTag[j];
          t++;
        }
      }

    var errorIn = '';
    if ($(".ErrorRedText").length > 0) {
        errorIn = "true";
    }


    var mobNumber = $('.businessMobileC').val();    
    if(mobNumber){
      mobNumber = "+91" + mobNumber;
    }

    var mobNumberAlt = $('.businessAltMobileC').val();
    if(mobNumberAlt){
      mobNumberAlt = "+91" + mobNumberAlt;
    }

    paymentMode = {};
    $('.selectAll').each(function(){
      var pVal = $(this).val();
      paymentMode[pVal] = $(this).prop('checked'); 
    });

    var allCategories = listCatg.toString();
    var alltags        = tagArray.toString();

    var formValues = {
        "businesscategories"      : listCatg,
        "businessAnythingElse"    : ($('#businessAnythingElse').val()).trim(),
        "businessLandline"        : event.target.businessLandline.value,
        "businessMobile"          : mobNumber,
        "businessAltMobile"       : mobNumberAlt,
        "businessWebAdress"       : event.target.businessWebAdress.value,
        "businessTag"             : tagArray,
        "businessModeOfPay"       : paymentMode,
        "allCategories"           : allCategories,
        "alltags"                 : alltags,
      }
    $(".SpanMobileErrors").removeClass("ErrorRedText");

    //Check Anything Else Field Before Submiting if its touched/changed
    var oldAnythingElse = '';
    // if((data.businessAnythingElse==formValues.businessAnythingElse)||!formValues.businessAnythingElse){
    if((dbCategories.businessAnythingElse==formValues.businessAnythingElse)||!formValues.businessAnythingElse){
      oldAnythingElse = false;
    } else {
      oldAnythingElse = true;
    }



    if(errorIn!="true" && (formValues.businessMobile||formValues.businessLandline)) {
      Meteor.call('updateBusinessOpenAndClose', businessLink, formValues, 
        function(error,result){
          if(error){
            // Bert.alert('There is some error in submitting this form!','danger','growl-top-right');
            return;
          }else{
            if(result){

              // ============================================================
              //      Notification Email / SMS / InApp
              // ============================================================
              if(oldAnythingElse){
                     var vendorId = dbCategories.businessOwnerId;
                     var admin = Meteor.users.findOne({'roles':'admin'});
                     var vendorDetail = Meteor.users.findOne({'_id':vendorId});
                     if(admin&&vendorDetail){
                        var adminId = admin._id;

                        //Send Notification, Mail and SMS to Current Vendor
                        var vendorname  = vendorDetail.profile.name;
                        var username  = admin.profile.firstName;

                        //Send Notification, Mail and SMS to Admin
                        var date    = new Date();
                        var currentDate = moment(date).format('DD/MM/YYYY');
                        var msgvariable = {
                           '[vendorname]'   : vendorname,
                           '[adminname]'    : username,
                           '[currentDate]'  : currentDate,
                           '[businessName]' : dbCategories.businessTitle
                        };

                        var inputObj = {
                                    notifPath     : businessLink,
                                    to            : adminId,
                                    templateName  : 'Anything Else Business Admin',
                                    variables     : msgvariable,
                        }
                        sendInAppNotification(inputObj);

                        var inputObj = {
                                    notifPath     : businessLink,
                                    from          : adminId,
                                    to            : adminId,
                                    templateName  : 'Anything Else Business Admin',
                                    variables     : msgvariable,
                        }
                        sendMailNotification(inputObj); 
                      }
                  }
                  //============================================================
                  //      End Notification Email / SMS / InApp
                  //============================================================

              selectedCategoriesList = [];
              $('#asearchCategories').val('');
              $('#alistCategory').empty();

              $('#searchTags').val('');
              $('#listTags').empty();

              $('.showOption').hide();
              var newBusinessId = result;

              Bert.alert('Business categories and timing information submitted successfully!','success','growl-top-right');
              listCatg                  = '';
              event.target.businessAnythingElse.value   = '';
              event.target.businessLandline.value       = '';
              event.target.businessMobile.value         = '';
              event.target.businessAltMobile.value      = '';
              event.target.businessWebAdress.value      = '';
              tagArray                      = '';
              // paymentModeE                    = '';
              paymentModeE = {
                  CreditCard  : false, 
                  DebitCard   : false,
                  Netbanking  : false,
                  Paytm       : false,
                  Cheque      : false,
                  Cash        : true,
                };

              selectedCategoriesList = [];
  
              var currentVendorURL = "/addNewBusiness/openingAndClosingDays/"+businessLink;
              var currentPathURL = FlowRouter.current().path;

              if (currentPathURL == currentVendorURL) {
                  FlowRouter.go('/addNewBusiness/aboutOwner/:businessLink',{'businessLink':businessLink});
              }else{
                  FlowRouter.go('/aboutOwnerAdmin/:businessLink',{'businessLink':businessLink});
              }
            }

          }
        }
      );
    } else {
        // Bert.alert('Please fill all the fields in form!','danger','growl-top-right');
        var mobNumberBox = $('.businessMobileC').val();
        if (!formValues.businessLandline||!mobNumberBox) {
          $(".SpanMobileErrors").addClass("ErrorRedText");
          $(".businessLandlineC").addClass("SpanLandLineRedBorder");
          $(".businessMobileC").addClass("SpanLandLineRedBorder");
          $(".SpanMobileErrors").text("Please Enter Valid Landline or 10 digit Mobile Number");
        }
        $('.SpanLandLineRedBorder:visible:first').focus();
    }
    
    
  },
  'click .WeekClassPre':function(event){
    var id = $(event.target).attr("id");
    $("#"+id).toggleClass("WeekClassPost");
  },

  'click .TimeFrameBtn': function(event) {
    event.preventDefault();
    var saveDay = [];
    var formValues = [];
    var weekVar = 1;
    var n = 0;
    var dayNum = [];
    dayNum['Monday']    = 1;
    dayNum['Tuesday']   = 2;
    dayNum['Wednesday'] = 3;
    dayNum['Thursday']  = 4;
    dayNum['Friday']    = 5;
    dayNum['Saturday']  = 6;
    dayNum['Sunday']    = 7;


    $( ".WeekClassPost" ).each(function() {
      saveDay[n] = $(this).attr('id');
      n++;
    });

    $('.WeekClassPre').removeClass("WeekClassPost");
    
    var saveFromTime  = $("#fromTime").val();
    // fsdfs
      var time = $("#fromTime").val();
      var hours = Number(time.match(/^(\d+)/)[1]);
      var minutes = Number(time.match(/:(\d+)/)[1]);
      var AMPM = time.match(/\s(.*)$/)[1];
      if(AMPM == "PM" && hours<12) hours = hours+12;
      if(AMPM == "AM" && hours==12) hours = hours-12;
      var sHours = hours.toString();
      var sMinutes = minutes.toString();
      if(hours<10) sHours = "0" + sHours;
      if(minutes<10) sMinutes = "0" + sMinutes;
      var time1 = sHours + ":" + sMinutes;

    var saveToTime    = $("#toTime").val();
    // sdsdf
      var time = $("#toTime").val();
      var hoursTwo = Number(time.match(/^(\d+)/)[1]);
      var minutesTwo = Number(time.match(/:(\d+)/)[1]);
      var AMPM = time.match(/\s(.*)$/)[1];
      if(AMPM == "PM" && hoursTwo<12) hoursTwo = hoursTwo+12;
      if(AMPM == "AM" && hoursTwo==12) hoursTwo = hoursTwo-12;
      var sHoursTwo = hoursTwo.toString();
      var sMinutesTwo = minutesTwo.toString();
      
      if(hoursTwo<10) sHoursTwo = "0" + sHoursTwo;
      if(minutesTwo<10) sMinutesTwo = "0" + sMinutesTwo;
      var time2 = sHoursTwo + ":" + sMinutesTwo;

      if(time1 > time2){
        alert('From time should be greater than To time');
      }else{
              // Bert.alert('Business categories and timing information submitted successfully!','success','growl-top-right');
        var docLink = FlowRouter.getParam('businessLink');
        var docId = Business.findOne({"businessLink":docLink});
        for(i=0;i<saveDay.length;i++){
          var valueObj = {
            "day"       :  saveDay[i],
            "dayNum"    :  dayNum[saveDay[i]],
            "fromTime"  :  saveFromTime,
            "toTime"    :  saveToTime,      
          }
          formValues[i] = valueObj;
        }
        if(saveFromTime&&saveToTime&&formValues[0]){
          Meteor.call('insertOpenCloseTiming', docId._id, formValues, function(error,result){
            if(error){
              return;
            }else{
              $('.shwDayError').text('');
              $('.shwDayError').removeClass('redTextDays fadeOut');
              return;
            }
          });
        }else {
          $('.shwDayError').text('Select Days & Time before adding your Business Timings');
          $('.shwDayError').addClass('redTextDays fadeOut');

        }
      }
  },

  'click .selectOption': function(e){
    e.stopPropagation(); 
    $('.showOption').toggleClass( 'hideDiv');
  },
  'click .showOption': function(e){
    e.stopPropagation(); 
  },

  'click #checkAll' : function(event){
    $(".selectAll").prop('checked',$('#checkAll').prop('checked'));
    if($('#checkAll').prop('checked')){
      paymentModeE = {
        CreditCard  : true, 
        DebitCard   : true,
        Netbanking  : true,
        Paytm       : true,
        Cheque      : true,
        Cash        : true,
      };
    }
    else{
      paymentModeE = {
        CreditCard  : false, 
        DebitCard   : false,
        Netbanking  : false,
        Paytm       : false,
        Cheque      : false,
        Cash        : false,
      };  
    }

    //=============================================

    var selectField = $(event.currentTarget).parent().siblings('.selectOption').children('.selecttext');
    var originalSelText = selectField.text();
    // console.log(originalSelText);

    var newSelText1 = 'Select Payment Modes [Selected Options: ';
    var newSelText2 = '';
    $('.selectAll').each(function(){
      if($(this).prop('checked')){
        if(newSelText2 == ''){
          newSelText2 = $(this).val();
        }else{
          newSelText2 = newSelText2 + ', ' + $(this).val();
        }
      }
    });
    if(newSelText2 !== ''){
      var newSelText = newSelText1 + newSelText2 + ']';
      selectField.text(newSelText);      
    }else{
      selectField.text('Select Payment Modes');
    }
  },

  'click .selectAll' : function(event){

    if($('#checkAll').prop('checked')){
      $("#checkAll").prop('checked',false);
    }
    var selectField = $(event.currentTarget).parent().siblings('.selectOption').children('.selecttext');
    var originalSelText = selectField.text();

    var newSelText1 = 'Select Payment Modes [Selected Options: ';
    var newSelText2 = '';
    $('.selectAll').each(function(){
      if($(this).prop('checked')){
        if(newSelText2 == ''){
          newSelText2 = $(this).val();
        }else{
          newSelText2 = newSelText2 + ', ' + $(this).val();
        }
      }
    });
    if(newSelText2 !== ''){
      var newSelText = newSelText1 + newSelText2 + ']';
      selectField.text(newSelText);      
    }else{
      selectField.text("Select Payment Modes"); 
    }

  },

});

Template.showOpenCloseTiming.helpers({
  businessOpenCloseTiming(){
    var businessTiming = [];
    var vendorLink = FlowRouter.getParam('businessLink');
    var businessObj = Business.findOne({"businessLink":vendorLink},{"businessTimings":1});
    
    if(businessObj){
      for(i=0;i<businessObj.businessTimings.length;i++){
        businessTiming[i] = businessObj.businessTimings[i];
        businessTiming[i].index = i;
      }     

      var result = businessTiming.sort(function (a,b) {
        if (a.dayNum > b.dayNum){
          return 1;
        }
        if (a.dayNum < b.dayNum){
          return -1;
        }
        return 0;
      });
    return result;      
    }

    // return businessTiming;
  },
});

Template.showOpenCloseTiming.events({
  'click .btClear': function(event){
    var btId = event.currentTarget.id;
    // console.log(btId);
    var docLink = FlowRouter.getParam('businessLink');
    var docId = Business.findOne({"businessLink" : docLink});
    Meteor.call('deleteBusinessTime',btId,docId._id,
          function(error,result){
            return;
          });
  },
  
});


$(document).on("click",function() {
    if(!($('.showOptionAdd').hasClass('hideDiv'))){
      $('.showOptionAdd').addClass('hideDiv');
    }
});

addvendorOpeningAndClosingForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'addvendorOpeningAndClosing'});
}

export { addvendorOpeningAndClosingForm };






