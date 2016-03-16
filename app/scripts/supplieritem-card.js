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
	//document.querySelector('app-homepage').setPage('admin-page');
	//document.querySelector('admin-page').setPage('additem-card');
	//alert(document.querySelector('additem-card').shadowRoot.querySelector('supplier-list'));
	//document.querySelector('additem-card').FnSetValue(supname,supid);
	}
  });
})();
