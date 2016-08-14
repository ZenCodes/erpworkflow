/**
 * Created by praba on 2/12/2016.
 */
(function() {
 var oldcontainerarr=[];
 var arrlength=0;
 var countno=0;
  Polymer({
    is: "physicqualified-service",
    ready:function()
    {
      this.no=0;
      this.length=0;
      this.emptyflag=0;
      this.inwardno="";
    },
    FnSetOldContainerArray: function (array) {
      //alert(JSON.stringify(array));
      oldcontainerarr=array;
      //localStorage.setItem("curr_sess_PO_Number",oldcontainerarr[0].PO_Number);
      //alert(JSON.stringify(oldcontainerarr));
    },
    physicqualifyacceptcheckService:function(inwardnumber){
      var arg={"inwardregno":"","checkstatus":"","status":"","repeatflag":""}
      arg.inwardregno=inwardnumber;
      arg.repeatflag=localStorage.getItem("curr_sess_repeatitementry");
      if(sessionStorage.getItem("curr_sess_roleflag")=="1"){
        arg.status=localStorage.getItem("curr_sess_currflowstatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowupdatestatus");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="2"){
        arg.status=localStorage.getItem("curr_sess_currflowstatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowupdatestatus");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="3"){
        arg.status=localStorage.getItem("curr_sess_currflowstatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowupdatestatus");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="4"){
        arg.status=localStorage.getItem("curr_sess_currflowstatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowupdatestatus");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="5"){
        arg.status=localStorage.getItem("curr_sess_currflowstatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowupdatestatus");
      }
      this.inwardacceptparam=arg;
      this.inwardaccepturl=sessionStorage.getItem("curr_sess_url")+"physicqualifyinwardacceptcheck-service";
      this.$.inwardacceptcheckajax.generateRequest();
    },
    inwardacceptcheckResponse:function(e){
      //alert(JSON.stringify(e.detail.response));
      if(e.detail.response.flag=="succ")
      {
        alert("All rows wr filled");
        this.oldphysicinsertService();
      }
      else{
        alert("some rows not filled");
      }
    },
    oldphysicinsertService:function(){
      var arg={"inwardregno":"","status":"","checkstatus":"","createdby":""};
      arg.inwardregno=sessionStorage.getItem("sess_curr_inwardregno");

      if(sessionStorage.getItem("curr_sess_roleflag")=="1"){
        arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
        arg.createdby=sessionStorage.getItem("loggeduser");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="2"){
        arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
        arg.createdby=sessionStorage.getItem("loggeduser");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="3"){
        arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
        arg.createdby=sessionStorage.getItem("loggeduser");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="4"){
        arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
        arg.createdby=sessionStorage.getItem("loggeduser");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="5"){
        arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
        arg.createdby=sessionStorage.getItem("loggeduser");
      }
      this.oldphysicinsertparam=arg;
      this.oldphysicinserturl=sessionStorage.getItem("curr_sess_url")+"oldphysicinsert-service";
      this.$.oldphysicinsertajax.generateRequest();
    },
    oldphysicinsertResponse:function(e){
      //alert("Inward material update: "+e.detail.response.flag);
      if(e.detail.response.flag=="succ")
      {
        //this.physicupdateService();
        this.oldcontainerupdateService();
      }
      else{

      }
    },

    oldcontainerupdateService:function(){
      arrlength=oldcontainerarr.length;
      //alert(arrlength);
      if(arrlength>0&&sessionStorage.getItem("curr_sess_roleflag")!="1") {
        for (var i = 0; i < oldcontainerarr.length; i++) {
          var obj = {
            "updatestatus": "",
            "checkstatus": "",
            "Inward_Register_Number": "",
            "Product_ID": "",
            "PO_Number": "",
            "PO_Date": "",
            "Supplier_ID": "",
            "Container_ID": "",
            "Heat_Number": "",
            "Quantity": "",
            "Quantity_Measure": "",
            "Remarks": "",
            "status": "",
            "Inspection_Status": "",
            "createdby":""
          };
          
          obj.Inward_Register_Number = oldcontainerarr[i].Inward_Register_Number;
          obj.Product_ID = oldcontainerarr[i].Product_ID;
          obj.PO_Number = oldcontainerarr[i].PO_Number;
          obj.PO_Date = oldcontainerarr[i].PO_Date;
          obj.Supplier_ID = oldcontainerarr[i].Supplier_ID;
          obj.Container_ID = oldcontainerarr[i].Container_ID;
          obj.Heat_Number = oldcontainerarr[i].Heat_Number;
          obj.Batch_No = oldcontainerarr[i].Batch_No;
          obj.Quantity = oldcontainerarr[i].Quantity;
          obj.Quantity_Measure = oldcontainerarr[i].Quantity_Measure;
          obj.Remarks = oldcontainerarr[i].Remarks;
          obj.status = localStorage.getItem("curr_sess_currflownewstatus");
          obj.Inspection_Status = oldcontainerarr[i].Inspection_Status;
          obj.createdby = sessionStorage.getItem("loggeduser");          
          this.oldcontainerupdateparam = obj;
          this.oldcontainerupdateurl = sessionStorage.getItem("curr_sess_url") + "oldcontainerupdate-service";
          this.$.oldcontainerupdateajax.generateRequest();
        }
      }
      else{
        this.physicupdateService();
      }
    },
    oldcontainerupdateResponse:function(e){
      //alert(e.detail.response);
      if(e.detail.response=="succ"){
          countno=countno+1;
      }
      if(countno==arrlength){
        alert('containers updated');
        this.physicupdateService();
      }
    },
    physicupdateService:function(){
      var arg={"inwardregno":"","status":"","checkstatus":"","createdby":""};
      arg.inwardregno=sessionStorage.getItem("sess_curr_inwardregno");

      if(sessionStorage.getItem("curr_sess_roleflag")=="1"){
        arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
        arg.createdby=sessionStorage.getItem("loggeduser");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="2"){
        arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
        arg.createdby=sessionStorage.getItem("loggeduser");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="3"){
        arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
        arg.createdby=sessionStorage.getItem("loggeduser");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="4"){
        arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
        arg.createdby=sessionStorage.getItem("loggeduser");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="5"){
        arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
        arg.createdby=sessionStorage.getItem("loggeduser");
      }
      this.physicupdateparam=arg;
      //alert(JSON.stringify(arg));
      this.physicupdateurl=sessionStorage.getItem("curr_sess_url")+"physicqualified-service";
      this.$.physicupdateajax.generateRequest();
    },
    physicupdateResponse:function(e){
      //alert(e.detail.response.flag+"  "+e.detail.response.state);
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
