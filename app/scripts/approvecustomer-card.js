/**
 * Created by praba on 5/9/2016.
 */
 // JS component for customer approve card
(function() {
  Polymer({
    is: "approvecustomer-card",
    ready:function(){
      
      localStorage.setItem("curr_sess_showpage","approvecustomer-card");
      // Calling webcomponent service to fetch the label for the components
      this.$.ID_Webcomponent_Service.callWebcomponentService();
      // Calling service to fetch the customer created for approve
      this.$.customerservice.readcustomertoapproveService();    
    }
  });
})();
