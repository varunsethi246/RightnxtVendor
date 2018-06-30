import { Business } from '/imports/api/businessMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '/imports/vendor/AddNewBusiness/showOpenCloseTiming.html';
import '/imports/vendor/categoriesSearchField/categoriesSearchField.js';
import '/imports/common/tagInputField/tagInputField.js';
import './VendorOpeningAndClosing.html';

Meteor.subscribe('vendorBusiness');

var dataIndex = 0;
var dataIndexTag = 0;

paymentmodeE = {};



Template.vendorOpeningAndClosing.onRendered(function(){
  $('#datetimepicker4').datetimepicker({format: 'LT'});
  $('#datetimepicker3').datetimepicker({format: 'LT'});
  selectedCategoriesList = [];
});


Template.vendorOpeningAndClosing.events({

  // 'click :not(.selectOption)':function(event){
  //     $('.showOption').addClass('hideDiv');
  // },

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
  'focusin .vendorPayHideInput':function(){
    // $('.selectOption').css('background','red');
    $('.selectOption').focus();
    if($('.selectOption').focus()){
      $('.showOption').toggleClass( 'hideDiv');
      $('#editcheckAll').focus();
    }
  },
  'submit .vendorBusOpClAC': function(event){
    event.preventDefault();
    
    var bizLink = FlowRouter.getParam('businessLink');
    var data = Business.findOne({'businessLink':bizLink}); 
    var id = data._id;
    //categories List

    var catglist = $('#asearchCategories').val();
    
    var sepratelist = catglist.split('|');
    var listCatg = [];
    var c = 0;

    if(sepratelist){
      for( var i = 0 ; i < sepratelist.length ; i++){
        if(sepratelist[i] == "" || sepratelist[i] == null)
          continue;
        listCatg[c] = sepratelist[i];
        c++;
      }
    }
    

    var dbCategories = Business.findOne({"businessLink":bizLink});
    if(dbCategories){
      if(dbCategories.businesscategories){
        for(var j = 0 ; j < dbCategories.businesscategories.length ; j++){
          listCatg[c] = dbCategories.businesscategories[j];
          c++;
        }
      }
    
      //tag List
      var tagList = $('#searchTags').val();
      
      var tagParts = tagList.split(",");
      var tagArray = [];
      var t = 0;

      if(tagParts){
        for (var i = 0; i < tagParts.length; i++) {
          if(tagParts[i] == "" || tagParts[i] == null)
            continue;
          tagArray[t] = tagParts[i];
          t++;
        }
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
          "businessAnythingElse"    : event.target.businessAnythingElse.value,
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
      if((data.businessAnythingElse==formValues.businessAnythingElse)||!formValues.businessAnythingElse){
        oldAnythingElse = false;
      } else {
        oldAnythingElse = true;
      }

      if(errorIn!="true" && (formValues.businessMobile||formValues.businessLandline)) {
        Meteor.call('updateBusOpClAcc', id, formValues, 
          function(error,result){
            if(error){
                // Bert.alert('There is some error in submitting this form!','danger','growl-top-right');
                return;
            }else{
                  Bert.alert('Business categories and timing information saved successfully!','success','growl-top-right');
                  var newBusinessId = result;
                  $('#asearchCategories').val('');
                  $('#alistCategory').empty();

                  $('#searchTags').val('');
                  $('#listTags').empty();
                  selectedCategoriesList = [];
                  $(".selecttext").text(Session.get('originalSelText'));
                  // $('.showOption').hide();
                  $('.showOption').addClass('hideDiv');

                  if(oldAnythingElse){
                  // ============================================================
                  //      Notification Email / SMS / InApp
                  // ============================================================
                     var vendorId = data.businessOwnerId;
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
                           '[businessName]' : data.businessTitle
                        };

                        var inputObj = {
                                    notifPath     : bizLink,
                                    to            : adminId,
                                    templateName  : 'Anything Else Business Admin',
                                    variables     : msgvariable,
                        }
                        sendInAppNotification(inputObj);

                        var inputObj = {
                                    notifPath     : bizLink,
                                    from          : adminId,
                                    to            : adminId,
                                    templateName  : 'Anything Else Business Admin',
                                    variables     : msgvariable,
                        }
                        sendMailNotification(inputObj); 
                      }
                  //============================================================
                  //      End Notification Email / SMS / InApp
                  //============================================================

                  }
            }

          }
        );
      } else {
          // Bert.alert('Please fill all the fields in form!','danger','growl-top-right');
          var mobNumberBox = $('businessMobileC').val();

          if (!formValues.businessLandline||!mobNumberBox) {
            $(".SpanMobileErrors").addClass("ErrorRedText");
            $(".businessLandlineC").addClass("SpanLandLineRedBorder");
            $(".businessMobileC").addClass("SpanLandLineRedBorder");
            $(".SpanMobileErrors").text("Please Enter Valid Landline or 10 digit Mobile Number");
          }
          $('.SpanLandLineRedBorder:visible:first').focus();
      }
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
    var saveToTime    = $("#toTime").val();

    var bizLink = FlowRouter.getParam('businessLink');
    var data = Business.findOne({'businessLink':bizLink}); 
    var docId = data._id;

    for(i=0;i<saveDay.length;i++){
      var valueObj = {
        "day"       :  saveDay[i],
        "dayNum"    :  dayNum[saveDay[i]],
        "fromTime"  :  saveFromTime,
        "toTime"    :  saveToTime,      
      }
      formValues[i] = valueObj;
    }
    // console.log(formValues);

     if(saveFromTime&&saveToTime&&formValues[0]){
      Meteor.call('insertOpenCloseTiming', docId, formValues, function(error,result){
        if(error){
          return;
        }else{
          $('.shwDayError').text('');
          $('.shwDayError').removeClass('redTextDays fadeOut');
          return;
        }
      });
    } else {
      $('.shwDayError').text('Select Days & Time before adding your Business Timings');
      $('.shwDayError').addClass('redTextDays fadeOut');
    }
  }, 

  'change #editcheckAll' : function(){
    $(".selectAll").prop('checked',$('#editcheckAll').prop('checked'));
    if($('#editcheckAll').prop('checked')){
      paymentModeE = {
        CreditCard  : true, 
        DebitCard   : true,
        Netbanking  : true,
        Paytm   : true,
        Cheque    : true,
        Cash    : true,
      };
    }
    else{
      paymentModeE = {
        CreditCard  : false, 
        DebitCard   : false,
        Netbanking  : false,
        Paytm   : false,
        Cheque    : false,
        Cash    : false,
      };  
    }

    //=============================================
    var originalSelText = $('.selecttext').text();
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
      $('.selecttext').text(newSelText);      
    }else{
      $('.selecttext').text('Select Payment Modes');
    }

  },

  'click .selectOption': function(e){
    e.stopPropagation(); 
    $('.showOption').toggleClass( 'hideDiv');
  },
  'click .showOption': function(e){
    e.stopPropagation(); 
  },

  'focusout .selectOption': function(){
    $('.showOption').addClass('hideDiv');
  },

  'click .selectAll' : function(event){
    var chked = $(event.target).prop('checked');
    
    if($('#editcheckAll').prop('checked')){
      $("#editcheckAll").prop('checked',false);
    }

    // var val = $(event.target).val();
    // paymentModeE[val] = $(event.target).prop('checked');

    //=============================================
    var originalSelText = $('.selecttext').text();
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
      $('.selecttext').text(newSelText);      
    }else{
      $('.selecttext').text('Select Payment Modes');
    }

  },
});

Template.vendorOpeningAndClosing.helpers({
  'businessOpenCloseTiming' : function(){
    var businessTiming = [];
    var businessLink = FlowRouter.getParam('businessLink');
    var data = Business.findOne({"businessLink":businessLink});
    var vendorId = data._id;
    // console.log('id : ', data);
    var businessObj = Business.findOne({"_id":vendorId},{"businessOpenCloseTimings":1});
    if(businessObj){
      if(businessObj.businessTimings){
          for(i=0;i<businessObj.businessTimings.length;i++){
            businessTiming[i] = businessObj.businessTimings[i];
            businessTiming[i].index = i;
          }
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
        if(category){
          for(var j = 0 ; j < category.length; j++){
            if((category[j].trim() != '--') || !(typeof category[j] == 'undefined')){
              if(j == 0){
                tempCategoryListCollection = category[j].trim();
              }else{
                tempCategoryListCollection = tempCategoryListCollection + ' > ' + category[j].trim();
              }
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
});

Template.vendorOpeningAndClosing.events({
  'click .showCategory' : function(event){
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
  'click .showTagsEdit' : function(event){
      
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

  'click .btClear': function(event){
    var btId = event.currentTarget.id;
    // console.log(btId);
    // var docId = FlowRouter.getParam('id');

    var businessLink = FlowRouter.getParam('businessLink');
    var data = Business.findOne({"businessLink":businessLink});
    var docId = data._id;
    
    Meteor.call('deleteBusinessTime',btId,docId,
          function(error,result){
            return;
          });
  },
});

// To close the Payment div on click of anywhere on body
$(document).on("click",function() {
    if(!($('.showOptionEdit').hasClass('hideDiv'))){
      $('.showOptionEdit').addClass('hideDiv');
    }
});
