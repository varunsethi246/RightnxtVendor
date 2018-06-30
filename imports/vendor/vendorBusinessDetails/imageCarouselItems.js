import './imageCarouselItems.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';


Template.imageCarouselItems.onRendered(function(){
    $('#imageSliderCarousel').hide();

    Meteor.setTimeout(function(){
        $('#imageSliderCarousel').show();
    },1990);

    Meteor.setTimeout(function(){
        $('#imageSliderCarousel').slick({
            infinite: true,
              slidesToShow: 5,
              slidesToScroll: 1,
                dots:false,
                responsive: [
                {
                  breakpoint: 991,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                            dots:false,
                  }
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                            dots:false,
                  }
                }
                ]
        });
    },2000);

});
