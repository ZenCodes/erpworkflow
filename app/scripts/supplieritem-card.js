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

	this.$.adminsupplierservice.callItemService(supplierid);
    //alert('fetch item info...'+supplierid);
	},
	FnCreateItemSupplier:function(){
	document.querySelector('supplier-page').setPage('Add Item');
	},
	FnDelete:function(e){

	}
  });
})();
