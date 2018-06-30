import './finalSubmit.html';

Template.body.events({ 

'click #submitHr': function(event) {
     $('#snow').show();
     $(".thankYouFirstLine").fadeIn(5000, 0.3);
   },
});
