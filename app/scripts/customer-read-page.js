/**
 * Created by praba on 2/12/2016.
 */

//JS file for the supplier-page
Polymer({
  is: "customer-read-page",
  ready:function()
  {
    //alert('yes comings!');

    localStorage.setItem("curr_sess_showpage","Customer Detail");
    //if(localStorage.getItem("curr_sess_showpage")=="additem-card")
    this.page="Customer Detail";
    //if(localStorage.getItem("curr_sess_showpage")=="addsupplier-card")
    //this.page="addsupplier-card";
  },
  //Method to change the page view in base page ie home page
  setPage:function(page)
  {
    //alert("pagenae"+page);
    //Setting current page in local storage to fetch the labels dynamically
    //localStorage.setItem("curr_sess_showpage",page);
    //Calling web component service to fetch label and errro label info from config file
    //document.querySelector("webcomponent-service").callWebcomponentService();
    this.page = page;
  }
});
