/**
 * Created by praba on 2/20/2016.
 */
Polymer({
  is: "viewtype-card",
  ready:function() {
    this.Label="Create";
    if (sessionStorage.getItem("loggedrole") == "Security guard"||localStorage.getItem("curr_sess_wardflag")=="2"||sessionStorage.getItem("curr_sess_roleflag")=="admin") {
      this.$.create.style.visibility = 'visible';
      //this.$.list.style.visibility='hidden';
    }
    else {
      this.$.create.style.visibility = 'hidden';
      //this.$.list.style.visibility='visible';
    }
  },
  FnViewlist:function(){
    this.$.create.style.visibility = 'visible';
  },
  create:function(){
    if(localStorage.getItem("curr_sess_wardflag")=="0"){
     //alert("hi");
      window.location.href="indexhome.html";
      //document.querySelector('my-app').setPage("inwardslip-page");
      //document.querySelector('inwardslip-page').setPage("Vehicle Info");
    }
    if(localStorage.getItem("curr_sess_wardflag")=="1"){
      //alert("hii");
      window.location.href="indexhome.html";
      //document.querySelector('my-app').setPage("outwardslip-page");
      //document.querySelector('outwardslip-page').setPage("Customer Info");
    }
    if(localStorage.getItem("curr_sess_wardflag")=="2"){
      //alert("hiii");
      window.location.href="indexhome.html";
      //document.querySelector('my-app').setPage("outwardslip-page");
      //document.querySelector('outwardslip-page').setPage("Customer Info");
    }
    if(sessionStorage.getItem("curr_sess_roleflag")=="admin"){
      //alert(localStorage.getItem("curr_sess_searchitemflag"));
      if(localStorage.getItem("curr_sess_searchitemflag")!="1") {
        //alert("yes");
        //localStorage.setItem("curr_sess_searchitemflag", "0");
        window.location.href = "indexhome.html";
      }
      else
      {
        //alert("no");
        this.Label="Create";
      document.querySelector('additem-card').FnEnableFields();
      }

    }
  },

  FnLabelChange:function(){

    this.Label="Edit";
  }
});
