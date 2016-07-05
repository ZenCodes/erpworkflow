
//JS file for the supplier-page
Polymer({
  is: "user-read-page",
  ready:function()
  {
    localStorage.setItem("curr_sess_showpage","Employee Detail");    
    this.page="Employee Detail";
  },
  //Method to change the page view in base page ie home page
  setPage:function(page)
  {
    //Setting current page in local storage to fetch the labels dynamically
    localStorage.setItem("curr_sess_showpage",page);
    //Calling web component service to fetch label and errro label info from config file
    document.querySelector("webcomponent-service").callWebcomponentService();
    this.page = page;
  }
});
