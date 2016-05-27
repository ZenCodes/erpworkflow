/**
 * Created by praba on 5/9/2016.
 */
(function() {
  Polymer({
    is: "approvesupplier-card",
    ready:function(){

    	localStorage.setItem("curr_sess_showpage","approvesupplier-card");
      this.$.ID_Webcomponent_Service.callWebcomponentService();
    	this.$.adminsupplierservice.readsuppliertoapproveService();
    }
  });
})();
