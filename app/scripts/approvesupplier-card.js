/**
 * Created by praba on 5/9/2016.
 */
 // JS component for approve supplier card
(function() {
  Polymer({
    is: "approvesupplier-card",
    ready:function(){	
    	  localStorage.setItem("curr_sess_showpage","approvesupplier-card");
        // Calling service to fetch the label for the component
      	this.$.ID_Webcomponent_Service.callWebcomponentService();
        // Calling service to fetch the supplier name s who have to approve
    	  this.$.adminsupplierservice.readsuppliertoapproveService();    
    }
  });
})();
