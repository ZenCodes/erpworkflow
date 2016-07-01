/**
 * Created by praba on 3/14/2016.
 */
 // JS component for the card contactperson card
(function() {
  'use strict';
  Polymer({
    is: 'contactperson-card',
    ready:function(){
    },
    FnCreateContact:function(){
      document.querySelector('customer-page').setPage('Add Contact Detail');
    },
    FnNextContact:function(){
      // Condition which calls the function to store the customer contact information
      if(localStorage.getItem("curr_sess_searchtypeflag")=="nothing") {
        document.querySelector('customer-page').setPage('Show Item');
        document.querySelector('customeritem-card').FnFetchItemInfo(localStorage.getItem('curr_sess_customerloggedid'),this.supname);
      }
      // Condition which calls the function to update the customer contact information in serach mode
      else if(localStorage.getItem("curr_sess_addcustomereditflag")=="1"&&localStorage.getItem("curr_sess_searchtypeflag")=="1"){
        document.querySelector('customer-page').setPage('Show Item');
        document.querySelector('customeritem-card').FnFetchItemInfo(localStorage.getItem('curr_sess_customerloggedid'),this.supname);
      }
      // Condition which calls the function to fetch the customer contact information in search mode
      else{
        document.querySelector('customer-page').setPage('Show Item');
        document.querySelector('customeritem-card').FnFetchItemInfo(localStorage.getItem('curr_sess_customerloggedid'),this.supname);
      }
    }
  });
})();
