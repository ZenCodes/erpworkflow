/**
 * Created by praba on 2/20/2016.
 */
Polymer({
  is: "viewtype-card",
  ready:function() {
    if (sessionStorage.getItem("loggedrole") == "Security guard"||localStorage.getItem("curr_sess_wardflag")=="2") {
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
      window.location.href="indexhome.html";
      //document.querySelector('my-app').setPage("inwardslip-page");
      //document.querySelector('inwardslip-page').setPage("Vehicle Info");
    }
    if(localStorage.getItem("curr_sess_wardflag")=="1"){
      window.location.href="indexhome.html";
      //document.querySelector('my-app').setPage("outwardslip-page");
      //document.querySelector('outwardslip-page').setPage("Customer Info");
    }
    if(localStorage.getItem("curr_sess_wardflag")=="2"){
      window.location.href="indexhome.html";
      //document.querySelector('my-app').setPage("outwardslip-page");
      //document.querySelector('outwardslip-page').setPage("Customer Info");
    }
    
  }
});
