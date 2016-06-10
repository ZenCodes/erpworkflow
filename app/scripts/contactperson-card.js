/**
 * Created by praba on 3/14/2016.
 */
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
      if(localStorage.getItem("curr_sess_searchtypeflag")=="nothing") {
        document.querySelector('customer-page').setPage('Show Item');
        document.querySelector('customeritem-card').FnFetchItemInfo(localStorage.getItem('curr_sess_customerloggedid'),this.supname);
        // document.querySelector('customer-page').setPage('Add Tax');
      }
      else if(localStorage.getItem("curr_sess_addcustomereditflag")=="1"&&localStorage.getItem("curr_sess_searchtypeflag")=="1"){
        document.querySelector('customer-page').setPage('Show Item');
        document.querySelector('customeritem-card').FnFetchItemInfo(localStorage.getItem('curr_sess_customerloggedid'),this.supname);
        //this.$.customerservice.callTaxreadService();
        //document.querySelector('customer-page').setPage('Add Tax');
      }
      else{
        document.querySelector('customer-page').setPage('Show Item');
        document.querySelector('customeritem-card').FnFetchItemInfo(localStorage.getItem('curr_sess_customerloggedid'),this.supname);
        //this.$.customerservice.callTaxreadService();
        //document.querySelector('customer-page').setPage('Add Tax');
      }
    }
  });
})();
