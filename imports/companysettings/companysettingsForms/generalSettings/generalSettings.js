import './generalSettings.html';
import { CompanySettings } from '/imports/api/companysettingsAPI.js';

Meteor.subscribe('companySettings');

Template.generalSettings.events({

	'submit .generalSettings':function(event){
	event.preventDefault();
    generalSettingsFormValue = {

      	shopType    : $('input[name=process1]:checked').val(),
      	processType : $('input[name="process2"]:checked').val(),
      	storeType   : $('input[name="process3"]:checked').val(),
        scaleType   : $('input[name=scaleprocess1]:checked').val(),
      }
    // console.log(generalSettingsFormValue.shopType);
    Meteor.call('insertGeneralSettings', generalSettingsFormValue,  function(error,result){
                  console.log(error,result);
                  if(error) {
                      return error;
                  } else {
                      FlowRouter.go('/');
                      return result;
                  }
              });
 
   
  },

});

Template.generalSettings.helpers({
  'themeDetails':function(){
        var companyData1 = CompanySettings.findOne({'companyId':101});
        if(companyData1){
            var companyData = {
               
                scaleProcess         : companyData1.generalSettings[0].scaleProcess,
                shopType       : companyData1.generalSettings[0].shopType,
                processType       : companyData1.generalSettings[0].processType,
                storeType            : companyData1.generalSettings[0].storeType,

            };            
        }else{
            var companyData = {
               scaleProcess : '',
               shopType : '',
               processType : '',
               storeType : '',
              
            };

        }
        return companyData;

  },

   scaleProcessType : function(){
        var scaleProcess = CompanySettings.findOne({"companyId" : 101});
        if(scaleProcess){
          var scaleSettings = scaleProcess.generalSettings;
          if(scaleSettings){
            var scaleProcessConfig = {
              'selectedProcess'    : scaleProcess.generalSettings.scaleProcess,
            }
          }else{
            var scaleProcessConfig = {
              'selectedProcess'    : '',
            }
          }
          return scaleProcessConfig;
          
        }else{
           var scaleProcessConfig ={
            'selectedProcess'    : '',
           }
        }
        return scaleProcessConfig;
    },

    shopType : function(){
      var shopType = CompanySettings.findOne({"companyId" : 101});
        if(shopType){
          var shopTypeSettings = shopType.generalSettings;
          if(shopTypeSettings){
             var shopTypeConfig = {
            'selectedShopType'   : shopType.generalSettings.shopType,
           }
          }else{
            var shopTypeConfig = {
              'selectedShopType'    : '',
            }
          }
          return shopTypeConfig;
          
        }else{
           var shopTypeConfig ={
            'selectedShopType'    : '',
           }
        }
        return shopTypeConfig;
    },

    ProcessType : function(){
      var processType = CompanySettings.findOne({"companyId" : 101});
        if(processType){
          var processTypeSettings = processType.generalSettings;
          if(processTypeSettings){
             var processTypeConfig = {
            'selectedProcessType'   : processType.generalSettings.processType,
           }
          }else{
            var processTypeConfig = {
              'selectedProcessType'    : '',
            }
          }
          return processTypeConfig;
          
        }else{
           var processTypeConfig ={
            'selectedProcessType'    : '',
           }
        }
        return processTypeConfig;
    },

    StoreType : function(){
      var storeType = CompanySettings.findOne({"companyId" : 101});
        if(storeType){
          var storeTypeSettings = storeType.generalSettings;
          if(storeTypeSettings){
             var storeTypeConfig = {
            'selectedStoreType'   : storeType.generalSettings.storeType,
           }
          }else{
            var storeTypeConfig = {
              'selectedStoreType'    : '',
            }
          }
          return storeTypeConfig;
          
        }else{
           var storeTypeConfig ={
            'selectedStoreType'    : '',
           }
        }
        return storeTypeConfig;
    },


   isCheckedscale: function(scaleProcess) {
      return (this.selectedProcess === scaleProcess) ? "checked" : "";
    },

    isCheckedshop: function(shopType) {
      return (this.selectedShopType === shopType) ? "checked" : "";
    },
    isCheckedprocess: function(processType) {
      return (this.selectedProcessType === processType) ? "checked" : "";
    },
    isCheckedstore: function(storeType) {
      return (this.selectedStoreType === storeType) ? "checked" : "";
    }
});
