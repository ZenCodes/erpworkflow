/**
 * Created by praba on 2/12/2016.
 */

//JS file for the supplier-page
Polymer({
  is: "customer-detail-read",
  ready:function()
  {
    localStorage.setItem("curr_sess_showpage","Customer Detail");
    //calling webcomponent service to fetch labels for current page
    //this.$.webcomponentservice.callWebcomponentService();
  }
});
