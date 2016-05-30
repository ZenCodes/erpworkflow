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
        document.querySelector('customer-page').setPage('Add Tax');
      }
      else if(localStorage.getItem("curr_sess_addcustomereditflag")=="1"&&localStorage.getItem("curr_sess_searchtypeflag")=="1"){
        this.$.customerservice.callTaxreadService();
        document.querySelector('customer-page').setPage('Add Tax');
      }
      else{
        this.$.customerservice.callTaxreadService();
        document.querySelector('customer-page').setPage('Add Tax');
      }
    }
  });
})();
