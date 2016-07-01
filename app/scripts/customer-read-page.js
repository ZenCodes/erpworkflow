//JS file for the supplier-page
Polymer({
  is: "customer-read-page",
  ready:function()
  {    
    localStorage.setItem("curr_sess_showpage","Customer Detail");    
    this.page="Customer Detail";
  },
  //Method to change the page view in base page ie home page
  setPage:function(page)
  {
    this.page = page;
  }
});
