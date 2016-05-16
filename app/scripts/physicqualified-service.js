/**
 * Created by praba on 2/12/2016.
 */
(function() {
  Polymer({
    is: "physicqualified-service",
    ready:function()
    {
      this.no=0;
      this.length=0;
      this.emptyflag=0;
      this.inwardno="";
    },
    physicqualifyacceptcheckService:function(inwardnumber){
      var arg={"inwardregno":"","checkstatus":"","repeatflag":""}
      arg.inwardregno=inwardnumber;
      arg.repeatflag=localStorage.getItem("curr_sess_repeatitementry");
      if(sessionStorage.getItem("curr_sess_roleflag")=="1"){
        arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
      }
      this.inwardacceptparam=arg;
      this.inwardaccepturl=sessionStorage.getItem("curr_sess_url")+"physicqualifyinwardacceptcheck-service";
      this.$.inwardacceptcheckajax.generateRequest();
    },
    inwardacceptcheckResponse:function(e){
      //alert(JSON.stringify(e.detail.response));
      if(e.detail.response.flag=="succ")
      {
        //alert("All rows wr filled");
        this.oldphysicinsertService();
      }
      else{
        alert("some rows not filled");
      }
    },
    oldphysicinsertService:function(){
      var arg={"inwardregno":"","status":"","checkstatus":""};
      arg.inwardregno=sessionStorage.getItem("sess_curr_inwardregno");

      if(sessionStorage.getItem("curr_sess_roleflag")=="1"){
        arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
      }
      this.oldphysicinsertparam=arg;
      this.oldphysicinserturl=sessionStorage.getItem("curr_sess_url")+"oldphysicinsert-service";
      this.$.oldphysicinsertajax.generateRequest();
    },
    oldphysicinsertResponse:function(e){
      if(e.detail.response.flag=="succ")
      {
        this.physicupdateService();
      }
      else{

      }
    },
    physicupdateService:function(){
      var arg={"inwardregno":"","status":"","checkstatus":""};
      arg.inwardregno=sessionStorage.getItem("sess_curr_inwardregno");

      if(sessionStorage.getItem("curr_sess_roleflag")=="1"){
        arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
      }
      this.physicupdateparam=arg;
      this.physicupdateurl=sessionStorage.getItem("curr_sess_url")+"physicqualified-service";
      this.$.physicupdateajax.generateRequest();
    },
    physicupdateResponse:function(e){
      alert(e.detail.response.flag);
      if(e.detail.response.flag=="updated"){
        localStorage.setItem('curr_sess_flowstate',"1");
        document.querySelector('grnflow-card').disableBackstate();
        document.querySelector('grnflow-card').setFlag();
        document.querySelector('physicinsread-page').setState(e.detail.response.state);
        localStorage.setItem("curr_sess_forwardstate",'0');
        localStorage.setItem('curr_sess_expandstate',e.detail.response.state);
        document.querySelector('home-page').setPage("Inward Flow");
        document.querySelector('app-homepage').setVisible("false");
        localStorage.setItem("curr_sess_PONumber",null);
      }
      else {

      }
    }
  });
})();
