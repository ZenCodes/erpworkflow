/**
 * Created by praba on 2/12/2016.
 */

//JS file for the supplier-page
Polymer({
  is: "supplier-detail-read",
  ready:function()
  {
    localStorage.setItem("curr_sess_showpage","Supplier Detail");
    //calling webcomponent service to fetch labels for current page
    //this.$.webcomponentservice.callWebcomponentService();
  }
});
