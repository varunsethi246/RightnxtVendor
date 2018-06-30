import { Discount } from '../../api/discountMaster.js';
import { Position } from '../../api/discountMaster.js';
import { Session } from 'meteor/session';

import './discountManagement.html';
import './positionManagement.html';
import '/imports/admin/commonAdmin/commonAdmin.js';

Template.discountManagement.events({
	'keypress #discount':function(e){
		if (e.keyCode == 13){
			e.preventDefault();
		    var id = Session.get("id");
			var rate     = $('#price').val();
			var discount = $('#discount').val();
			// console.log('id :' ,id);
			// console.log('rate :',rate);
			// console.log('discount :', discount);
			if(id){
				Meteor.call('updateDiscount',id,rate,discount,function(error,result){
					if(error){
						console.log(error);
					}else{
						$('#price').val('');
						$('#discount').val('');
						$('#price').focus();

						delete Session.keys['id'];
					}
				});
			}else if(rate != '' && discount != ''){
				Meteor.call('insertDiscount',rate,discount,function(error,result){
					if(error){
						console.log(error);
					}else{
						$('#price').val('');
						$('#discount').val('');
						$('#price').focus();
					}
				});
			}else if(discount == '' || rate == ''){

				Bert.alert("Please select rate and discount first.","success","growl-top-right");
			}
	    }
	},

	
	'click .delete':function(event){
		event.preventDefault();
		var value = this;
		var id = value.id;

		Meteor.call('removeDiscount',id,function(error,result){
			if(error){
				console.log(error);
			}else{
				Bert.alert("Deleted Successfully!","success","growl-top-right");
			}
		})
	},

	'click .edit':function(event){
		event.preventDefault();
		var value = this;
		var id = value.id;
		
		$('input[name="price"]').val(this.price);
    	$('input[name="discount"]').val(this.discount);
	    Session.set("id",id);
				
	}
});

Template.discountManagement.helpers({
	'discounts':function(){
		var discountData = Discount.find({}).fetch();
		var discountArray = [];
		if(discountData){
			for(var i=0 ; i<discountData.length ; i++){
				discountArray.push({
					// 'srno'     : i++,
					'id'       : discountData[i]._id,
					'price'    : discountData[i].price,
					'discount' : discountData[i].discount,
				});
			}//i
		}//discountData
		return discountArray;
	}
});

Template.positionManagement.helpers({
	'positions':function(){
		return Position.find({},{sort: {position:1}});
	}
});

Template.positionManagement.events({
	'keydown #rate': function(e){
         if ($.inArray(e.keyCode, [8, 9, 27, 13]) !== -1 ||
                // Allow: Ctrl+A, Command+A
                (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true))||
                (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true))||
                (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true))||
                // Allow: home, end, left, right, down, up
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                    // let it happen, don't do anything
                    return;
           }
           // Ensure that it is a number and stop the keypress
           if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105 || e.keyCode===190 || e.keyCode===46 || e.keyCode===110)) {
               e.preventDefault();
           }
      },
	'keypress #rate':function(e){
		if(e.keyCode == 13){
			e.preventDefault();
			var id = Session.get("positionId");
			var position = $('.selectPosition').val();
			console.log('position :',position);
			var positionAdded = '';
			var positionTrue = false;
			var posId = id;

			if(id){
				positionAdded = Position.find({"position":id}).fetch();
				if(positionAdded.length>0){
					positionTrue = true;
				}
			}else{
				positionAdded = Position.find({"position":position}).fetch();
				if(positionAdded.length>0){
					posId = positionAdded[0]._id;
					positionTrue = true;
				}
			}


			var rate     = $('#rate').val();
			if((id || positionTrue) && position != '-- Select --' && position != null){
				Meteor.call('updatePosition',posId,position,rate,function(error,result){
					if(error){
						console.log(error);

					}else{
							// Bert.alert("Please select position number first.","success","growl-top-right");
						$('.selectPosition').val('');
						$('#rate').val('');
        				Session.set("positionId",'');
        				$('.selectPosition').focus();

					}
				})
			}
			else if(position != '-- Select --' && position != null && rate != '' && rate != null){
					Meteor.call('insertPosition',position,rate,function(error,result){
						if(error){
							console.log(error);
						}else{
							// Bert.alert("Please select position number first.","success","growl-top-right");
							$('.selectPosition').val('');
							$('#rate').val('');
						}
					})
			}
			else if(position == '-- Select --' || rate == '' || rate == null){

				Bert.alert("Please select position number and rate first.","danger","growl-top-right");
			}
		}
	},

	'click .deletePosBtn':function(event){
		event.preventDefault();
		var value = this;
		var id = value._id;

		Meteor.call('removePosition',id,function(error,result){
			if(error){
				console.log(error);
			}else{
				Bert.alert("Deleted Successfully!","success","growl-top-right");
				$('.modal-backdrop').hide();

			}
		})
	},

	'click .edit':function(event){
		event.preventDefault();
		var value = this;
		var id = value._id;
		$('.selectPosition').val(this.position);
        $('#rate').val(this.rate);	
        Session.set("positionId",id);
	}
});
discountManagementForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'discountManagement'});
}
export { discountManagementForm };

positionManagementForm = function () {  
  BlazeLayout.render("adminLayout",{main: 'positionManagement'});
}
export { positionManagementForm };
