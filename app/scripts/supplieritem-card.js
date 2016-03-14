/**
 * Created by praba on 3/14/2016.
 */
(function() {
  'use strict';

  Polymer({
    is: 'supplieritem-card',

    ready:function(){
	},
	FnFetchItemInfo:function(supplierid){
	//alert(supplierid);
	this.$.adminsupplierservice.callItemService(supplierid);
	},
	FnCreateSupplier:function(){
	document.querySelector('supplier-page').setPage('Add Item');
	}
  });
})();
