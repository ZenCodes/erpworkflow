/**
 * Created by praba on 2/19/2016.
 */
/**
 * Created by praba on 2/12/2016.
 */
Polymer({
  is: "viewintent-page",
  ready:function()
  {    
    //Setting current page in session for fetching labels dynamically
    localStorage.setItem("curr_sess_showpage","viewintent-page");
    //calling webcomponent service to fetch labels for current page
    this.$.ID_Webcomponent_Service.callWebcomponentService();
    //Setting state for reading the items under current INT no
    this.$.gs.FnIntentitemReadService();
  },
  setState:function(){
    //Setting current page in session for fetching labels dynamically
    localStorage.setItem("curr_sess_showpage","viewintent-page");
    //calling webcomponent service to fetch labels for current page
    this.$.ID_Webcomponent_Service.callWebcomponentService();
    //Setting state for reading the items under current INT no
    this.$.gs.FnIntentitemReadService();
  },
  FnRefreshService:function(){
    //alert("hi");
       //Setting current page in session for fetching labels dynamically
    localStorage.setItem("curr_sess_showpage","viewintent-page");
    //calling webcomponent service to fetch labels for current page
    this.$.ID_Webcomponent_Service.callWebcomponentService();
    //Setting state for reading the items under current INT no
    this.$.gs.FnIntentitemReadService();
  }
});
