import { Session } from 'meteor/session';
// import { Products } from '../../../api/products.js';
// import { Orders } from '../../../api/orderMaster.js';
// import { CompanySettings } from  '../../../api/companysettingsMaster.js';
// import { ProductImgUploadS3 } from '../../../../client/productStoreToS3.js';
import { moment } from "meteor/momentjs:moment";
import { Payment } from '../../api/paymentMaster.js';

import '/imports/admin/commonAdmin/commonAdmin.js';
import './salesReportBanner.html';
import './salesReportTabsBanner.html';
import './todaysSalesReport/todaysSalesReportBanner.js';
import './weeklySalesReport/weeklySalesReportBanner.js';
import './monthlySalesReport/monthlySalesReportBanner.js';
import './yearlySalesReport/yearlySalesReportBanner.js';
import './tabContentBanner.html';
import './fromToFieldsBanner.html';
import './fromToFieldsBanner.js';
import './salesTableViewBanner.html';
import './salesModalBanner.html';
import './reviewOrderViewBanner.html';
import '../businessAds/adsInvoice.html';


Template.salesTableViewBanner.onRendered(function(){
  
  $('.clickableRow').click( function(){
		var id = $(this).attr('id');
		Session.set("id",id);
	});
});
// Template.salesTableViewBanner.events({
//   'click .pdfOne':function(event){
//     event.preventDefault();
  
//     var doc = new jsPDF();
//     var specialElementHandlers = {
//         '#PDF': function (element, renderer) {
//             return true;
//         }
//     };
//       doc.fromHTML($('#PDF').html(), 15, 15, {
//           'width': 170,
//               'elementHandlers': specialElementHandlers
//       });
//       doc.save('todaysSalesReport.pdf');
//   }
// });
Template.salesTableViewBanner.helpers({

  'isGreaterThan0' : function(rowSpanCount){
    return rowSpanCount > 0;
  },
});



Template.salesModalBanner.helpers({

   
    resultVar: ()=> {
     	  var idFromSession = Session.get("id");
        // console.log('idFromSession'+idFromSession);
        var report_data = [];
        var products = [];
        var userInfo = [];
        var noOfOrders = 0;
        var productsVar = 0;
        var myOrders = Payment.findOne({'_id': idFromSession});
        if(myOrders){
          var d = myOrders.createdAt;
          var t = d.toLocaleDateString('en-IN');
          var report_data = ({
                'total'       : myOrders.totalAmount,
                'payMethod'   : myOrders.paymentMethod,
                'date'        : t,
                'orderno'     : myOrders.OrderId,
                'products'    : [],
            });
          var noOfProductsInOrder = myOrders.products.length;
                for(j=0;j<noOfProductsInOrder;j++){

                    var productUniqueId = myOrders.products[j].productId;
                    var productsVar = Products.findOne({'_id' : productUniqueId});
                    if(productsVar){
                    var productID   = productsVar.productCode;
                    if(productsVar.productImages.length != 0){  
                        var productStore       = productsVar.productImages[0].imgId;
                        
                        // var proImgStore      = ProductImgUploadS3.findOne({"_id":imgStoreId});
                        // if(proImgStore){
                        //       var productStore   = ProductImgUploadS3.findOne({"_id":imgStoreId}).url();
                        //     }  
                        }else{
                            var productStore = 'images/default.png';
                        } 

                    
                      report_data.products.push({
                          'planName'         : productsVar.productName,
                          'price'            : myOrders.products[j].price,
                          'total'            : myOrders.products[j].total,
                          'qty'              : myOrders.products[j].quantity,
                          'productthumbnail' : productStore,
                      });
                    }// if productsVar

                } //End of j loop
            }// if myOrders
        
        return report_data;
    },

    customerInfoOrder: ()=>{

      var idFromSession = Session.get("id");
      var userInfo = [];
      var noOfOrders = 0;
      var myOrders = Orders.findOne({'_id': idFromSession});
      if(myOrders){
        var userId = myOrders.userId;
        var user = Meteor.users.findOne({"_id" : userId});
        if(user){
        userInfo.push({
                "No"        : '',
                "name"      : user.profile.deliveryAdd[0].name,
                "houseNo"   : user.profile.deliveryAdd[0].houseNo,
                "street"    : user.profile.deliveryAdd[0].street,
                "landmark"  : user.profile.deliveryAdd[0].landmark,
                "pin"       : user.profile.deliveryAdd[0].pin,
                "city"      : user.profile.deliveryAdd[0].city,
                "state"     : user.profile.deliveryAdd[0].state,
                "mob"       : user.profile.deliveryAdd[0].mob,
        });
      }// if user

      }// if myOrders

      return userInfo;
    },

    "images" : function(){

        var logoImage = CompanySettings.find({"companyId":101}).fetch();
        return logoImage.map(function (d, i) {
          d._index = i + 1;
          return d;
        });

    },
});

salesReportTabsBannerForm = function () {  
  BlazeLayout.render("adminLayout", {main: 'salesReportTabsBanner'});
}

export { salesReportTabsBannerForm }


