/**
 * Created by praba on 3/14/2016.
 */
(function() {
  'use strict';
var supname="";
var supid="";
  Polymer({
    is: 'supplieritem-card',

    ready:function(){
	},
	FnFetchItemInfo:function(supplierid,suppliername){
		supname=suppliername;
		supid=supplierid;
	//alert(supname);
	this.$.adminsupplierservice.callItemService(supplierid);
	},
	FnCreateItemSupplier:function(){
	document.querySelector('supplier-page').setPage('Add Item');
	}
  });
})();
