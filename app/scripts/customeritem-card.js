/**
 * Created by praba on 3/14/2016.
 */
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
	
	this.$.customerservice.callItemService(supplierid);
	},
	FnCreateItemSupplier:function(){	
	document.querySelector('customer-page').setPage('Add Item');
	}
  });
})();
