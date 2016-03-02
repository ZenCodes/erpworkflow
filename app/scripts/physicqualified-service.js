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
    physicupdateService:function(inwardnumber){
      var arg={"inwardnumber":"","status":"","checkstatus":"","updateflag":"","ponumber":""};
      arg.inwardnumber=inwardnumber;
      this.inwardno=inwardnumber;
      arg.ponumber=localStorage.getItem("curr_sess_PONumber");
      if(sessionStorage.getItem("curr_sess_roleflag")=="1"){
        arg.updateflag="1";
        arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="2"){
        arg.updateflag="0";
        arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="3"){
        arg.updateflag="0";
        arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="4"){
        arg.updateflag="0";
        arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
      }
      this.param=arg;
      //this.url='http://127.0.0.1:3000/physicqualified-service';
      this.url=sessionStorage.getItem("curr_sess_url")+"physicqualified-service";
      this.$.physicupdateajax.generateRequest();
    },
    physicupdateResponse:function(e)
    {
      this.url1=sessionStorage.getItem("curr_sess_url")+"physicinsertupdate-service";
      //alert(JSON.stringify(e.detail.response));
      var rows=e.detail.response;
      this.length=rows.length;
      if(rows.length>0){
        for(var i=0;i<rows.length;i++){
          var obj={"purchasetype":"","purchasetypeflag":"","inwardno":"","inwarddate":"","ponumber":"","podate":"","supname":"","itemdes":"","qtyreceived":"","qtyaccepted":"","remarks":"","state":"","inwardregno":"","containeraccepted":"","containerreceived":"","contmeasure":"","qtymeasure":""};
          //obj.purchasetype=rows[i].purchasetype;
          obj.purchasetypeflag=rows[i].purchasetypeflag;
          obj.inwardno=rows[i].inwardno;
          obj.inwarddate=rows[i].inwarddate;
          obj.ponumber=rows[i].ponumber;
          //obj.ponumber=localStorage.getItem("curr_sess_PONumber");
          obj.podate=rows[i].podate;
          obj.supname=rows[i].supname;
          obj.itemdes=rows[i].itemdes;
          //obj.qtyordered=rows[i].Qty;
          obj.qtyreceived=rows[i].qtyreceived;
          obj.qtyaccepted=rows[i].qtyaccepted;
          obj.containerreceived=rows[i].containerreceived;
          obj.containeraccepted=rows[i].containeraccepted;
          obj.qtymeasure=rows[i].qtymeasure;
          obj.contmeasure=rows[i].contmeasure;
          obj.remarks=rows[i].remarks;
          obj.state=rows[i].state;
          obj.inwardregno=rows[i].inwardregno;
          this.param1=obj;
          this.$.oldinsertupdateajax.generateRequest();
        }
      }
      else
      {
        //alert('Empty array');
        //this.emptyflag=1;

        var arg={"inwardnumber":"","status":"","checkstatus":""};
        arg.inwardnumber=this.inwardno;
        if(sessionStorage.getItem("curr_sess_roleflag")=="1"){
          arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
          arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
        }
        else if(sessionStorage.getItem("curr_sess_roleflag")=="2"){
          arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
          arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
        }
        else if(sessionStorage.getItem("curr_sess_roleflag")=="3"){
          arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
          arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
        }
        else if(sessionStorage.getItem("curr_sess_roleflag")=="4"){
          arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
          arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
        }
        this.param2=arg;
        //alert(JSON.stringify(arg));
        //this.url='http://127.0.0.1:3000/physicqualified-service';
        this.url2=sessionStorage.getItem("curr_sess_url")+"flowstateupdate-service";
        this.$.flowstateupdateajax.generateRequest();

      }
    },
    oldinsertupdateResponse:function(e){
      //alert(e.detail.response.inwardno);
      this.no=this.no+1;

      var arg={"inwardnumber":"","status":"","checkstatus":""};
      arg.inwardnumber=e.detail.response.inwardno;
      if(sessionStorage.getItem("curr_sess_roleflag")=="1"){
        arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="2"){
        arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="3"){
        arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="4"){
        arg.status=localStorage.getItem("curr_sess_currflowupdatestatus");
        arg.checkstatus=localStorage.getItem("curr_sess_currflowstatus");
      }
      this.param2=arg;
      //this.url='http://127.0.0.1:3000/physicqualified-service';
      this.url2=sessionStorage.getItem("curr_sess_url")+"flowstateupdate-service";


      if(this.no==this.length){
        //alert("yes");
        this.$.flowstateupdateajax.generateRequest();
      }
      /*if(this.emptyflag==1){
       this.$.flowstateupdateajax.generateRequest();
       //alert('Unable to update');
       }*/
    },
    flowstateupdateResponse:function(e){
      //alert(e.detail.response.flag+" "+e.detail.response.state);
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
    }
  });
})();
