/**
 * Created by praba on 2/12/2016.
 */
Polymer({
  is: "physicinsread-page",
  ready:function()
  {

  },
  setState:function(state){
    //Setting current page in session for fetching labels dynamically
    localStorage.setItem("curr_sess_showpage","physicinsread-page");
    //calling webcomponent service to fetch labels for current page
    this.$.ID_Webcomponent_Service.callWebcomponentService();
    //Setting state for reading the items under current IRN no
    this.$.gs.flowphysicreadService(state);
    //Calling webcomponent service to fetch labels dynamically for this card from config file
    this.$.ps.callWebcomponentService();
    //Calling service component to fetch the Item info
    this.$.ps.physicqualifyreadService(this.inwardregno);
  }
});
