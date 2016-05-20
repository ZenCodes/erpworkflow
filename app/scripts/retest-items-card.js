/**
 * Created by praba on 2/12/2016.
 */
//JS file for the supplierlist page
//The same card is reused in inwardslip page and the additem card
(function() {
  Polymer({is:"retest-items-card",
    ready:function() {
    },
    FnChecktoresend:function(){
      if(document.querySelector('#check'+this.inwardregno).checked==true){
        document.querySelector('retest-card').Fngetresendvalue(this.inwardregno);
      }
    }
  });
})();
