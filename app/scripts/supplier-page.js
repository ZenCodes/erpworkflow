/**
 * Created by praba on 2/11/2016.
 */

//JS page for the supplier-page element

Polymer({
  is: "supplier-page",
  ready:function()
  {

    if(sessionStorage.getItem("curr_sess_roleflag")=="6")
    {

      localStorage.setItem("curr_sess_showpage","Add Supplier");
      this.page="Add Supplier";
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
