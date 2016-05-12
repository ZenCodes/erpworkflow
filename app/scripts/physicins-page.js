/**
 * Created by praba on 2/12/2016.
 */
//JS file for physicins page
Polymer({
  is: "physicins-page",
  ready:function()
  {    
    //Setting current page in session for fetching labels dynamically
    localStorage.setItem("curr_sess_showpage","physicins-page");
    //calling webcomponent service to fetch labels for current page
    this.$.ID_Webcomponent_Service.callWebcomponentService();
    //To initially show current logged role state items requesting service component to make req to the server
    this.$.gs.physicreadService();
  }
});
