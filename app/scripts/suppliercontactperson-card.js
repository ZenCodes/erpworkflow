/**
 * Created by praba on 3/14/2016.
 */
(function() {
  'use strict';
  Polymer({
    is: 'suppliercontactperson-card',
    ready:function(){
    },
    FnCreateContact:function(){
      document.querySelector('supplier-page').setPage('Add Contact Detail');
    },
    FnNextContact:function(){
      if(localStorage.getItem("curr_sess_searchtypeflag")=="nothing") {
        // document.querySelector('supplier-page').setPage('Add Tax');
        document.querySelector('supplier-page').setPage('Show Item');
        document.querySelector('supplieritem-card').FnFetchItemInfo(localStorage.getItem('curr_sess_supplierloggedid'),this.supname);
      }
      else if(localStorage.getItem("curr_sess_addsuppliereditflag")=="1"&&localStorage.getItem("curr_sess_searchtypeflag")=="1"){
        document.querySelector('supplier-page').setPage('Show Item');
        document.querySelector('supplieritem-card').FnFetchItemInfo(localStorage.getItem('curr_sess_supplierloggedid'),this.supname);
        // this.$.adminsupplierservice.callTaxreadService();
        // document.querySelector('supplier-page').setPage('Add Tax');
      }
      else{
        document.querySelector('supplier-page').setPage('Show Item');
        document.querySelector('supplieritem-card').FnFetchItemInfo(localStorage.getItem('curr_sess_supplierloggedid'),this.supname);
        // this.$.adminsupplierservice.callTaxreadService();
        // document.querySelector('supplier-page').setPage('Add Tax');
      }
    }
  });
})();
