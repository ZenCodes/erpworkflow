//JS file for the supplier-detail-read
Polymer({
  is: "supplier-detail-read",
  ready:function()
  {
  	this.read=true;
    localStorage.setItem("curr_sess_showpage","Supplier Detail");
  }
});
