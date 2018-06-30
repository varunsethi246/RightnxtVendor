import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './homepageServicesCarousel.html'


Template.homepageServicesCarousel.onRendered(function(){
  // var rows=0,windowWidth=$(window).width();$(window).on("scroll",function(i){1==++rows&&(this.$("#serviceCarousel").carousel({interval:!1}),this.$("#serviceCarousel .carousel-inner .item").each(function(){var i=$(this).next();if(i.length||(i=$(this).siblings(":first")),i.children(":first-child").clone().appendTo($(this)),windowWidth>=320&&windowWidth<450)for(n=0;n<0;n++)(i=i.next()).length||(i=$(this).siblings(":first")),i.children(":first-child").clone().appendTo($(this));else if(windowWidth>=450&&windowWidth<=767)for(n=0;n<1;n++)(i=i.next()).length||(i=$(this).siblings(":first")),i.children(":first-child").clone().appendTo($(this));else for(var n=0;n<4;n++)(i=i.next()).length||(i=$(this).siblings(":first")),i.children(":first-child").clone().appendTo($(this))}))});
var rows = 0,
      windowWidth = $(window).width();
  $(window).on("scroll", function(i) {
      1 == ++rows && (this.$("#serviceCarousel").carousel({
          interval: !1
      }), this.$("#serviceCarousel .carousel-inner .item").each(function() {
          var i = $(this).next();
          if (i.length || (i = $(this).siblings(":first")), i.children(":first-child").clone().appendTo($(this)), windowWidth >= 320 && windowWidth < 450)
              for (n = 0; n < 0; n++)(i = i.next()).length || (i = $(this).siblings(":first")), i.children(":first-child").clone().appendTo($(this));
          else if (windowWidth >= 450 && windowWidth <= 767)
              for (n = 0; n < 1; n++)(i = i.next()).length || (i = $(this).siblings(":first")), i.children(":first-child").clone().appendTo($(this));
          else
              for (var n = 0; n < 4; n++)(i = i.next()).length || (i = $(this).siblings(":first")), i.children(":first-child").clone().appendTo($(this))
      }))
  });
});


Template.homepageServicesCarousel.events({
   'click .item' : function(event){

        event.preventDefault();
        var searchCatg = $(event.target).attr('title'); 
        // console.log("searchCatg; ",searchCatg);
        
        var currentCity = $('#getCity').val();
        var currentArea = $('#getArea').val();
        var path =  "/search/"+currentCity+"/"+currentArea+"/"+searchCatg;
        FlowRouter.go(path);

  },
});