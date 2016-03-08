/**
 * Created by praba on 2/13/2016.
 */
//JS page for outwardslip page
Polymer({
  is: "outwardslip-page",
  ready:function()
  {
    //Showing customerinfo page as the initial page in outwardslip page
    localStorage.setItem("curr_sess_saveflag","false");
    if(sessionStorage.getItem("curr_sess_roleflag")=="0")
    {
      localStorage.setItem("curr_sess_showpage","Out Vehicle Info");

      //document.querySelector("webcomponent-service").callWebcomponentService();
      this.page="Out Vehicle Info";
    }
  },
  setPage:function(page)
  {
    //Setting current page in local storage to fetch the labels dynamically
    localStorage.setItem("curr_sess_showpage",page);
    //Calling web component service to fetch label and errro label info from config file
    document.querySelector("webcomponent-service").callWebcomponentService();
    //Changing page view in Outwardslip page
    this.page=page;
  }
});
