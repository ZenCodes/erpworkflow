/**
 * Created by praba on 2/19/2016.
 */
/**
 * Created by praba on 2/12/2016.
 */

//JS file for the home-page
Polymer({
  is: "intenthome-page",
  ready:function()
  {    
    localStorage.setItem("curr_sess_showpage", "Add Intent");
    this.page="Add Intent";
  },
  //Method to change the page view in base page ie home page
  setPage:function(page)
  {
    if(localStorage.getItem("curr_sess_wardflag")=="2") {
      //Setting current page in local storage to fetch the labels dynamically
      localStorage.setItem("curr_sess_showpage", page);
      //Calling web component service to fetch label and errro label info from config file
      document.querySelector("webcomponent-service").callWebcomponentService();
      this.page=page;
    }
    else if(localStorage.getItem("curr_sess_wardflag")=="3") {
      //Setting current page in local storage to fetch the labels dynamically
      localStorage.setItem("curr_sess_showpage", page);
      //Calling web component service to fetch label and errro label info from config file
      document.querySelector("webcomponent-service").callWebcomponentService();
      this.page=page;
    }
    else {

      //alert(page);
      this.page = page;
      //Setting current page in local storage to fetch the labels dynamically
      //localStorage.setItem("curr_sess_showpage", page);
      //Calling web component service to fetch label and errro label info from config file
      // document.querySelector("webcomponent-service").callWebcomponentService();
    }
  }
});
