/**
 * Created by praba on 5/9/2016.
 */
(function() {
  Polymer({
    is: "approvecustomer-card",
    ready:function(){
      localStorage.setItem("curr_sess_showpage","approvecustomer-card");
      this.$.ID_Webcomponent_Service.callWebcomponentService();
      this.$.customerservice.readcustomertoapproveService();
    }
  });
})();
