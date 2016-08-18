/**
 * Created by praba on 5/9/2016.
 */
 // JS component for approve usser card
(function() {
  Polymer({
    is: "approveuser-card",
    ready:function(){	
        // if(sessionStorage.getItem("curr_sess_roleflag")=="9"&&localStorage.getItem("curr_sess_wardflag")=="12"){
    	  localStorage.setItem("curr_sess_showpage","approveuser-card");
        // Calling service to fetch the label for the component
      	// this.$.ID_Webcomponent_Service.callWebcomponentService();
        // Calling service to fetch the supplier name s who have to approve
    	  this.$.userservice.readusertoapproveService(); 
        // }   
    }
  });
})();
