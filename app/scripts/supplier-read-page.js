/**
 * Created by praba on 2/12/2016.
 */

//JS file for the supplier-page
Polymer({
  is: "supplier-read-page",
  ready:function()
  {
    localStorage.setItem("curr_sess_showpage","Supplier Detail");
    this.page="Supplier Detail";
  },
  //Method to change the page view in base page ie home page
  setPage:function(page)
  {
    this.page = page;
  }
});
