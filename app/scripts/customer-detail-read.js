//JS file for the customer-detail-read
Polymer({
  is: "customer-detail-read",
  ready:function()
  {
  	this.read=true;
    localStorage.setItem("curr_sess_showpage","Customer Detail");
  }
});
