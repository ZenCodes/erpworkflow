// JS component for customer item card
(function() {
  'use strict';
var supname="";
var supid="";
  Polymer({
    is: 'customeritem-card',
    ready:function(){
	},
	FnFetchItemInfo:function(supplierid,suppliername){    
		supname=suppliername;
		supid=supplierid;
		// Function calls service to fetch the item info which attache to the customer
	    this.$.customerservice.callItemService(supplierid);
	},
	// Function shows the add item page in customer module
	FnCreateItemSupplier:function(){
	document.querySelector('customer-page').setPage('Add Item');
	}
  });
})();
