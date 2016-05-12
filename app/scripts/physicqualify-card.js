/**
 * Created by praba on 2/12/2016.
 */ 
  (function(){
    var inwardno;
    var ponumber;
    var podate;
    var supname;
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
    //this.physicqualifyreadService(sessionStorage.getItem("sess_curr_inwardregno"));
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
    // alert(JSON.stringify(arg));
    this.url=sessionStorage.getItem("curr_sess_url")+"physicqualify-card";
    this.$.physicqualifyitemreadajax.generateRequest();
  },
  FnPhysicqualifyitemreadResponse:function(e)
  {
    //Response binding to the card
    var arr=e.detail.response;
    //alert(arr.length);
    //alert(JSON.stringify(arr));
    // if(arr!='no items'){

    var commarr=[];
    var prodarr=[];
    var potempflag="";
    if(arr.length>0){
    for(var i=0;i<1;i++)
    {
      var obj={"inwardno":"","inwarddate":"","ponumber":"","podate":"","supname":""};
      this.purchasetypeflag=arr[i].purchasetypeflag;

      if(this.purchasetypeflag!="1") {

        document.querySelector('#supplier').style.paddingTop='-5%';
        this.isHidden = false;

      }
      else {
        //document.querySelector('#supplier').style.paddingTop='12%';
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

      /*inwardno=arr[i].inwardno;      
      ponumber=arr[i].ponumber;
      podate=arr[i].podate;
      supname=arr[i].supname;*/
    }
    commarr.push(obj);
    this.suppliername=commarr[0].supname;
    }
    
    // alert(JSON.stringify(commarr));
    for(var i=0;i<arr.length;i++)
    {
      var obj={"inwardno":"","ponumber":"","podate":"","supname":"","itemdes":"","qtyreceived":"","qtyaccepted":"","remarks":"","containerreceived":"","containeraccepted":"","contmeasure":"","qtymeasure":"","ctrreceived":"","qtyyreceived":""};
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
      /*obj.inwardno=inwardno;
      obj.ponumber=ponumber;
      obj.podate=podate;
      obj.supname=supname;*/
      prodarr.push(obj);
    }
    // alert(JSON.stringify(prodarr));
    this.mainArray=commarr;
    this.itemArray=prodarr;
    this.pono=potempflag;
    this.ponumber=potempflag;
    localStorage.setItem("curr_sess_PONumber",potempflag);

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
})();