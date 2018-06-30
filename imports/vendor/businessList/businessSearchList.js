import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';
import { Tracker } from 'meteor/tracker';

import { Categories } from '/imports/api/masterData/categoriesMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../../general/homepage/homepageProductCarousel.js'
import '../../general/homepage/homepageServicesCarousel.js'
import '../../common/searchinitialisation.js'
import './sidebarBusinessList.html'
var categoryRouteList = '';
Template.homepageProductCarousel.events({
   'click .item' : function(event){
        $("html,body").scrollTop(0);
        event.preventDefault();
        var searchCatg = $(event.target).attr('title'); 
        console.log("searchCatg; ",searchCatg);
        
        var currentCity = $('#getCity').val();
        var currentArea = $('#getArea').val();
        var path =  "/search/"+currentCity+"/"+currentArea+"/"+searchCatg;
        FlowRouter.go(path);
    
  },
});

Template.homepageServicesCarousel.events({
   'click .item' : function(event){
        $("html,body").scrollTop(0);
        event.preventDefault();
        var searchCatg = $(event.target).attr('title'); 
        console.log("searchCatg; ",searchCatg);
        
        var currentCity = $('#getCity').val();
        var currentArea = $('#getArea').val();
        var path =  "/search/"+currentCity+"/"+currentArea+"/"+searchCatg;
        FlowRouter.go(path);
  },
});

Template.sidebarBusinessList.helpers({
   searchList(){
      var levelDisplayShow = [];
      var busList = businessSearch1.getData();
      var listCategory = [];

      if(busList){
            for(var i = 0  ; i < busList.length ; i++){
                  if(busList[i].businesscategories){
                        for(var j = 0 ; j < busList[i].businesscategories.length; j++){
                              if(busList[i].businesscategories[j]){
                                    var catArrayString = (busList[i].businesscategories[j]).split('>');
                                    if(catArrayString[1]){
                                          catArrayString[1] = catArrayString[1].trim();
                                    }
                                    listCategory.push(catArrayString[1]);
                              }
                        }
                  }
            }
      }

      for(var i =0 ; i<listCategory.length;i++){
            listCategory = jQuery.unique( listCategory );
      }
      listCategory = listCategory.filter(Boolean);

      // Current Business list Page Search Categories   
      if(listCategory){
            if(listCategory){
            for(var j = 0 ; j < listCategory.length; j++){
                  var levelTextShow = {
                  title   : listCategory[j],
                  sublist : [],
                  };
                  var data = Categories.find({'level1':listCategory[j]}).fetch();
                  if(data){
                  for(i = 0 ; i < data.length; i++){
                        if(data[i].level4 == '--'){
                        if(data[i].level3 == '--'){
                              if(data[i].level2 == '--'){

                              }else{
                              var list = {
                                    categories : data[i].level2,
                              };
                              levelTextShow.sublist.push(list); 
                              }
                        }else{
                              var list = {
                              categories : data[i].level3,
                              };
                        levelTextShow.sublist.push(list);
                        }
                        }else{
                        var list = {
                        categories : data[i].level4,
                        };
                        levelTextShow.sublist.push(list);
                        }
                  }
                  }
                  levelDisplayShow.push(levelTextShow);
            }
            return levelDisplayShow;            
            }        
      }
   },
});