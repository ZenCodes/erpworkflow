/**
 * Created by praba on 2/12/2016.
 */

//JS file for the home-page
Polymer({
  is: "admin-page",
  ready:function()
  {

    //Intially setting Inwarditems as show page in base page ie home-page

    this.page="additem-card";

  },
  //Method to change the page view in base page ie home page
  setPage:function(page)
  {
    this.page = page;

  }
});
