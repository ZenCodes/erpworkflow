Polymer({
  is: "intentview-card",
  ready:function()
  {
    this.$.dialog.toggle();
    //Setting current page in session for fetching labels dynamically
    localStorage.setItem("curr_sess_showpage","intentview-card");
    //calling webcomponent service to fetch labels for current page
    this.$.ID_Webcomponent_Service.callWebcomponentService();
    //Setting state for reading the items under current INT no
    this.$.gs.FnIntentViewitemReadService();
  },
    FnStopSpinner:function(){
    this.$.dialog.toggle();
    var spin=document.querySelector('paper-spinner');
    spin.active=!spin.active;
  },
  setState:function(){
    //Setting current page in session for fetching labels dynamically
    localStorage.setItem("curr_sess_showpage","intentview-card");
    //calling webcomponent service to fetch labels for current page
    this.$.ID_Webcomponent_Service.callWebcomponentService();
    //Setting state for reading the items under current INT no
    this.$.gs.FnIntentViewitemReadService();
  }
});
