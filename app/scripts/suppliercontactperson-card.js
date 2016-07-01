/**
 * Created by praba on 3/14/2016.
 */
 // JS component for the card supplier contactperson card
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
      // Condition which calls the function to store the supplier contact information
      if(localStorage.getItem("curr_sess_searchtypeflag")=="nothing") {        
        document.querySelector('supplier-page').setPage('Show Item');
        document.querySelector('supplieritem-card').FnFetchItemInfo(localStorage.getItem('curr_sess_supplierloggedid'),this.supname);
      }
      // Condition which calls the function to update the supplier contact information in serach mode
      else if(localStorage.getItem("curr_sess_addsuppliereditflag")=="1"&&localStorage.getItem("curr_sess_searchtypeflag")=="1"){
        document.querySelector('supplier-page').setPage('Show Item');
        document.querySelector('supplieritem-card').FnFetchItemInfo(localStorage.getItem('curr_sess_supplierloggedid'),this.supname);
      }
      // Condition which calls the function to fetch the supplier contact information in search mode
      else{
        document.querySelector('supplier-page').setPage('Show Item');
        document.querySelector('supplieritem-card').FnFetchItemInfo(localStorage.getItem('curr_sess_supplierloggedid'),this.supname);
      }
    }
  });
})();
