/**
 * Created by praba on 2/12/2016.
 */
(function() {
var flag="true";
  Polymer({
    is: "physicqualifyitem-card",
    ready: function () {
      this.updateflag = "false";
      this.hideradio=true;
      this.url = sessionStorage.getItem("curr_sess_url") + "physicqualifyitem-card";
      if(sessionStorage.getItem("curr_sess_roleflag") == "3")
      this.hideradio=false;
    },
    FnGenerateBatchno:function(e){
      // alert(this.heatno);
      this.callGenerateBatchnoService();
    },
    callGenerateBatchnoService:function(){
      var obj={"heatno":""};
      obj.heatno=this.heatno;
      this.generatebatchnourl=sessionStorage.getItem("curr_sess_url")+"generatebatchno-service";
      this.generatebatchnoparam=obj;
      this.$.generatebatchnoajax.generateRequest();
    },
    generatebatchnoResponse:function(e){      
      // alert(JSON.stringify(e.detail.response.returnval));
      this.batchno=e.detail.response.returnval;
      // document.querySelector('physicqualifyitem-card').batchno=e.detail.response.returnval;
    },
    FnSaveItem: function () {
      document.querySelector("#cont" + this.inwardno).validate();      
      document.querySelector("#qty" + this.inwardno).validate();
      if ((this.ponumber == null || this.ponumber == "") && (localStorage.getItem("curr_sess_POchangeflag") != 1)) {
        alert("PO number should be filled out!");
      }
      else {
        this.inspectionstatus = "1";
        this.createdby= sessionStorage.getItem("loggeduser");
        this.podate = localStorage.getItem("localsess_curr_inwarddate");
        this.ponumber = localStorage.getItem("curr_sess_PONumber");        
        
        switch (parseInt(sessionStorage.getItem("curr_sess_roleflag"))) {
          case 1:
            this.status = localStorage.getItem("curr_sess_currflowstatus");
            this.updatestatus = localStorage.getItem("curr_sess_currflowupdatestatus");
            break;
          case 2:
            this.status = localStorage.getItem("curr_sess_currflowstatus");
            this.updatestatus = localStorage.getItem("curr_sess_currflowupdatestatus");
            break;
          case 3:
            this.status = localStorage.getItem("curr_sess_currflowstatus");
            this.updatestatus = localStorage.getItem("curr_sess_currflowupdatestatus");
            break;
          case 4:
            this.status = localStorage.getItem("curr_sess_currflowstatus");
            this.updatestatus = localStorage.getItem("curr_sess_currflowupdatestatus");
            break;
        }
        
        this.$.form.submit();
      }
      
    },
    FnRejectItem: function () {
      if ((this.ponumber == null || this.ponumber == "") && (localStorage.getItem("curr_sess_POchangeflag") != 1)) {
        alert("PO number should be filled out!");
      }
      else {
        // alert(this.containerid);
        var containerid=this.containerid;
        this.containerid=containerid;
        this.inspectionstatus = "0";
        this.createdby= sessionStorage.getItem("loggeduser");
        this.podate = localStorage.getItem("localsess_curr_inwarddate");
        this.ponumber = localStorage.getItem("curr_sess_PONumber");
        switch (parseInt(sessionStorage.getItem("curr_sess_roleflag"))) {
          case 1:
            this.status = localStorage.getItem("curr_sess_currflowstatus");
            this.updatestatus = localStorage.getItem("curr_sess_currflowupdatestatus");
            break;
          case 2:
            this.status = localStorage.getItem("curr_sess_currflowstatus");
            this.updatestatus = localStorage.getItem("curr_sess_currflowupdatestatus");
            break;
          case 3:
            this.status = localStorage.getItem("curr_sess_currflowstatus");
            this.updatestatus = localStorage.getItem("curr_sess_currflowupdatestatus");
            break;
          case 4:
            this.status = localStorage.getItem("curr_sess_currflowstatus");
            this.updatestatus = localStorage.getItem("curr_sess_currflowupdatestatus");
            break;
        }
        this.$.form.submit();
      }
    },
    FnResponse: function (e) {
      //alert(JSON.stringify(e.detail.response.flag));
      var retflag="";
      if(e.detail.response.flag=="exist")
        retflag="Coil id already exist";
      else
        retflag=e.detail.response.flag;
        this.$.ID_Show_Dialog.FnShowDialog(retflag, "");
    },
    FnExpandInnerCard: function () {
      //alert(this.containerid);
      this.containerid=(this.containerid).replace(/\s/g, '');
    if(flag=="true") {
      if (document.querySelector('#radio' + this.containerid).checked == true && sessionStorage.getItem("curr_sess_roleflag") == "3") {
        localStorage.setItem("curr_sess_expandedcontainer", this.containerid);
        this.$.specificationcard.FnspecificationitemreadService();
        this.$.qualityparameterdisplay.FnparameterdisplayService();
        document.querySelector("#inner" + this.containerid).toggle();
      }
      flag=this.containerid;
    }
      else {
      if(flag==this.containerid) {
        if (document.querySelector('#radio' + this.containerid).checked == false && sessionStorage.getItem("curr_sess_roleflag") == "3") {
          localStorage.setItem("curr_sess_expandedcontainer", this.containerid);
          document.querySelector("#inner" + this.containerid).toggle();
          flag="true";
          //this.$.specificationcard.FnHideSpeccard();
        }
      }
      else{
        document.querySelector('#radio' + flag).checked = false;
        document.querySelector("#inner" + flag).toggle();
        localStorage.setItem("curr_sess_expandedcontainer", this.containerid);
        this.$.specificationcard.FnspecificationitemreadService();
        this.$.qualityparameterdisplay.FnparameterdisplayService();
        document.querySelector("#inner" + this.containerid).toggle();
        flag=this.containerid;
      }
    }
    },
    FnToggle:function(){
      this.$.specificationcard.FnspecificationitemreadService();
      this.$.qualityparameterdisplay.FnparameterdisplayService();
      document.querySelector("#inner" + id).toggle();
    },
    FnReferesh:function(){
        var id=localStorage.getItem("curr_sess_expandedcontainer");
        this.$.specificationcard.FnspecificationitemreadService();
        this.$.qualityparameterdisplay.FnparameterdisplayService();
        document.querySelector("#inner" + id).toggle();
        document.querySelector('#radio' + id).checked = false;
        flag="true";
    },
    Fnhidequality:function(flag){
      if(flag=="true")
        this.hidequality=true;
      if(flag=="false")
        this.hidequality=false;
    },
    FnComponentSize:function(){
      // alert('calling'+this.querySelector('paper-input'));
      this.querySelector('.repeatcard').style.width='120%';
      this.querySelector('#cont'+this.inwardno).style.width='25%';
      this.querySelector('#qty'+this.inwardno).style.width='25%';
      this.querySelector('textarea').style.width='40%'; 
      // this.querySelector('paper-icon-button').style.width='5%';      
    },
    FnComponentReSize:function(){
      // alert('calling'+this.querySelector('paper-input'));
      this.querySelector('.repeatcard').style.width='100%';
      this.querySelector('#cont'+this.inwardno).style.width='20%';
      this.querySelector('#qty'+this.inwardno).style.width='15%';
      this.querySelector('textarea').style.width='18%'; 
      }
  });
})();
