/**
 * Created by praba on 2/12/2016.
 */
Polymer({is:"physicqualify-card",
  ready:function(){

    //Flag is setting to make PO read only and writable
    if(sessionStorage.getItem("curr_sess_roleflag")=="1"){
      //localStorage.setItem("curr_sess_PONumber",this.pono);

      this.read = false;
    }
    if(sessionStorage.getItem("curr_sess_roleflag")!="1"){

      this.read = true;
    }

    this.url=sessionStorage.getItem("curr_sess_url")+"physicqualify-card";

    /*if(this.pono!=""||this.pono!=null)
     alert("yes");
     else
     alert("no");*/
  },
  FnInputChanged:function(e){
    //When PO changes changing flag
    localStorage.setItem("curr_sess_POchangeflag","1");
    //alert(this.pono);
    localStorage.setItem("curr_sess_PONumber",this.pono);
    //this.ponumber=this.pono;
  },
  setPodate:function(){
    //alert('calling');
    //setting PO selection date
    this.podate=localStorage.getItem("localsess_curr_inwarddate");
    //alert(this.podate);
  },
  physicqualifyreadService:function(inwardregno){
    //fetches item info under the IRN corresponding to the user loggedin role
    //alert(inwardregno);
    this.inwardno=inwardregno;
    var arg={"inwardregno":"","status":""};
    arg.inwardregno=inwardregno;
    switch(parseInt(sessionStorage.getItem("curr_sess_roleflag"))){
      case 1:
            arg.status=localStorage.getItem("curr_sess_currflowstatus");
            break;
      case 2:
            arg.status=localStorage.getItem("curr_sess_currflowstatus");
            break;
      case 3:
            arg.status=localStorage.getItem("curr_sess_currflowstatus");
            break;
      case 4:
            arg.status=localStorage.getItem("curr_sess_currflowstatus");
            break;
    }
    /*if(sessionStorage.getItem("curr_sess_roleflag")=="1"){
      arg.status=localStorage.getItem("curr_sess_currflowstatus");
    }
    if(sessionStorage.getItem("curr_sess_roleflag")=="2"){
      arg.status=localStorage.getItem("curr_sess_currflowstatus");
    }
    else if(sessionStorage.getItem("curr_sess_roleflag")=="3"){
      arg.status=localStorage.getItem("curr_sess_currflowstatus");
    }
    else if(sessionStorage.getItem("curr_sess_roleflag")=="4"){
      arg.status=localStorage.getItem("curr_sess_currflowstatus");
    }*/
    this.param=arg;
    this.url=sessionStorage.getItem("curr_sess_url")+"physicqualify-card";
    this.$.physicqualifyitemreadajax.generateRequest();
  },
  FnPhysicqualifyitemreadResponse:function(e)
  {
    //Response binding to the card
    var arr=e.detail.response;

    var commarr=[];
    var prodarr=[];
    var potempflag="";
    for(var i=0;i<arr.length;i++)
    {
      var obj={"inwardno":"","inwarddate":"","ponumber":"","podate":"","supname":""};
      this.purchasetypeflag=arr[i].purchasetypeflag;

      if(this.purchasetypeflag=="0")
        this.isHidden=false;
      else {
        document.querySelector('.topright').style.marginTop='3%';
        this.isHidden = true;
      }
      obj.inwardno=arr[i].inwardno;
      obj.inwarddate=arr[i].inwarddate;
      obj.ponumber=arr[i].ponumber;
      if(arr[i].ponumber==null||arr[i].ponumber=="") {
      }
      else
      {
        potempflag = arr[i].ponumber;
      }
      obj.podate=arr[i].podate;
      obj.supname=arr[i].supname;
    }
    commarr.push(obj);
    for(var i=0;i<arr.length;i++)
    {
      var obj={"itemdes":"","qtyreceived":"","qtyaccepted":"","remarks":"","containerreceived":"","containeraccepted":"","contmeasure":"","qtymeasure":"","ctrreceived":"","qtyyreceived":""};
      obj.itemdes=arr[i].itemdes;
      obj.qtyreceived=arr[i].qtyreceived;
      obj.containerreceived=arr[i].containerreceived+" / "+arr[i].qtyreceived;
      if(sessionStorage.getItem("curr_sess_roleflag")=="0"){
        obj.qtyaccepted=arr[i].qtyreceived;
        obj.containeraccepted=arr[i].containerreceived;
      }
      if(sessionStorage.getItem("curr_sess_roleflag")!="0"){
        obj.qtyaccepted=arr[i].qtyaccepted;
        obj.containeraccepted=arr[i].containeraccepted;
      }
      obj.qtymeasure=arr[i].qtymeasure;
      obj.contmeasure=arr[i].contmeasure;
      obj.ctrreceived=arr[i].ctrreceived;
      obj.qtyyreceived=arr[i].qtyyreceived;
      obj.remarks=arr[i].remarks;
      prodarr.push(obj);
    }
    this.mainArray=commarr;
    this.itemArray=prodarr;
    this.pono=potempflag;
    this.ponumber=potempflag;
    localStorage.setItem("curr_sess_PONumber",potempflag);
    this.suppliername=commarr[0].supname;

    //alert(JSON.stringify(commarr));
    //alert(JSON.stringify(prodarr));

  },
  callWebcomponentService:function(){
    this.$.webcomponentreadajax.generateRequest();
  },
  FnWebcomponentreadResponse:function(e) {
    this.current_page="physicqualify-card";
    //alert(this.current_page);
    var arr = e.detail.response;
    //alert(arr.length);
    var labelvalue=[];
    var errorlabelvalue=[];
    //Binding labels to login-card
    for(var i=1;i<arr.length;i++) {
      //alert(arr[i].Page[0].page[0]);
      if ((arr[i].Page[0].page[0]) == this.current_page) {
        labelvalue = arr[i].Page[1].Label;
        /*Binding Labels and error message to the respective card*/
        this.label = labelvalue;
      }
    }
  }
});
