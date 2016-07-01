/**
 * Created by praba on 2/12/2016.
 */
Polymer({
  is: "flowbutton-card",
  ready:function()
  {
    this.sessupdateflag="true";
    this.changeupdateflag="true";
    if(sessionStorage.getItem("curr_sess_roleflag")=="1")
      this.label='Inward Accept';
    if(sessionStorage.getItem("curr_sess_roleflag")=="2")
      this.label='Physical Inspection';
    else if(sessionStorage.getItem("curr_sess_roleflag")=="3")
      this.label='Quality Inspection';
    else if(sessionStorage.getItem("curr_sess_roleflag")=="4")
      this.label='Confirm purchase';
  },
  click:function(){
   if(sessionStorage.getItem("curr_sess_roleflag")=="1"){
      if(localStorage.getItem("curr_sess_PONumber")==null||localStorage.getItem("curr_sess_PONumber")==""){
        this.sessupdateflag="false";
      }
      else
        this.sessupdateflag="true";
      if(localStorage.getItem("curr_sess_POchangeflag")=="0"){
        this.changeupdateflag="false";
      }
      else
        this.changeupdateflag="true";
      if(this.sessupdateflag=="false"&&this.changeupdateflag=="false") {
        alert("Please enter PO Number!");
      }
      else{
        this.$.pqs.physicqualifyacceptcheckService(sessionStorage.getItem("sess_curr_inwardregno"));
      }
    }
    else
    {
      this.$.pqs.physicqualifyacceptcheckService(sessionStorage.getItem("sess_curr_inwardregno"));
    }
  }
});
