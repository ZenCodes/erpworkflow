/**
 * Created by praba on 2/12/2016.
 */

//JS file for the supplier-page
Polymer({
  is: "customer-payment-read",
  ready:function()
  {
  	this.read=true;
    localStorage.setItem("curr_sess_showpage","Payment Detail");
    //calling webcomponent service to fetch labels for current page
    this.$.ID_Webcomponent_Service.callWebcomponentService();
  }
});
