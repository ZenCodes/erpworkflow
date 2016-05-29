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
      document.querySelector('customer-page').setPage('Add Tax');
    }
  });
})();
