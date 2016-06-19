/**
 * Created by praba on 5/9/2016.
 */
(function() {
  Polymer({
    is: "approvesupplier-card",
    ready:function(){
	// if(sessionStorage.getItem("curr_sess_roleflag")=="9"&&localStorage.getItem("curr_sess_wardflag")=="8"){
    	localStorage.setItem("curr_sess_showpage","approvesupplier-card");
      	this.$.ID_Webcomponent_Service.callWebcomponentService();
    	this.$.adminsupplierservice.readsuppliertoapproveService();
    // }
    }
  });
})();
