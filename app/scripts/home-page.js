/**
 * Created by praba on 2/12/2016.
 */

//JS file for the home-page
Polymer({
  is: "home-page",
  ready:function()
  {

    //Intially setting Inwarditems as show page in base page ie home-page
    this.page="Inward Items";

    //Setting the initial flow is forward flow of GRN flow,which refers with the flag 0
    localStorage.setItem('curr_sess_flowstate','0');
    //this.setPage(this.page);
  },
  //Method to change the page view in base page ie home page
  setPage:function(page)
  {
    this.page = page;

  }
});
