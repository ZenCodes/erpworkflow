/**
 * Created by praba on 2/11/2016.
 */

//JS page for the inwardslip-page element

Polymer({
  is: "inwardslip-page",
  ready:function()
  {
    /*Flag is setting for repeat save validation*/
    localStorage.setItem("curr_sess_saveflag","false");
    /*Initially when security logged in it enables vehicle info page of the Inward slip page*/
    if(sessionStorage.getItem("curr_sess_roleflag")=="0")
    {
      localStorage.setItem("curr_sess_showpage","Vehicle Info");
      this.page="Vehicle Info";
    }
  },
  /*Method used to change the page view for the security inward slip entry either from vehicle page to item page or vice versa*/
  setPage:function(page)
  {
    //Setting current page in local storage to fetch the labels dynamically
    localStorage.setItem("curr_sess_showpage",page);
    //Calling web component service to fetch label and errro label info from config file
    document.querySelector("webcomponent-service").callWebcomponentService();
    this.page=page;
  }
});
