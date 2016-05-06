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
    this.$.dialog.toggle();
    //Setting current page in session for fetching labels dynamically
    localStorage.setItem("curr_sess_showpage","viewintent-page");
    //calling webcomponent service to fetch labels for current page
    this.$.ID_Webcomponent_Service.callWebcomponentService();
    //Setting state for reading the items under current INT no
    this.$.gs.FnIntentitemReadService();
  },
  FnStopSpinner:function(){
    this.$.dialog.toggle();
    var spin=document.querySelector('paper-spinner');
    spin.active=!spin.active;
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
  /*,
   FnIntentitemReadService:function(){
      this.intenturl=sessionStorage.getItem("curr_sess_url")+"intentitemread-service";
      var arg={"loggeduser":""};
      arg.loggeduser=sessionStorage.getItem("loggeduser");
      this.intentparam=arg;
      //alert(JSON.stringify(arg));
      this.$.intentitemreadajax.generateRequest();
    },
    intentitemreadResponse:function(e){
      //alert(JSON.stringify(e.detail.response));
      document.querySelector('viewintent-page').itemArray=e.detail.response.itemarr;
      //alert(JSON.stringify(document.querySelector('viewintent-page').itemArray));
    }*/
});
