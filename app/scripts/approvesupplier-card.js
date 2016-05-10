/**
 * Created by praba on 5/9/2016.
 */
(function() {
  Polymer({
    is: "approvesupplier-card",
    ready:function(){
    	localStorage.setItem("curr_sess_showpage","Approve Supplier");
    	this.$.adminsupplierservice.readsuppliertoapproveService();
    }
  });
})();
