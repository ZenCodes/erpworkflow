/**
 * Created by praba on 2/12/2016.
 */
  (function(){
    var inwardno;
    var ponumber;
    var podate;
    var supname;
    var containerreceived;
    var containermeasure;
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
   },
  FnInputChanged:function(e){
    //alert(this.ponumber);
    //When PO changes changing flag
    localStorage.setItem("curr_sess_POchangeflag","1");
    localStorage.setItem("curr_sess_PONumber",this.ponumber);
  },
  setPodate:function(){
    //setting PO selection date
    this.podate=localStorage.getItem("localsess_curr_inwarddate");
  },
    FnexpandcardreadService:function(){
      //alert("calling");
      var arg={"inwardregno":"","status":""};
      arg.inwardregno=sessionStorage.getItem("sess_curr_inwardregno");
      if(sessionStorage.getItem("curr_sess_roleflag")=="1"){

        arg.status=localStorage.getItem("curr_sess_currflowstatus");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="2"){

        arg.status=localStorage.getItem("curr_sess_currflowstatus");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="3"){

        arg.status=localStorage.getItem("curr_sess_currflowstatus");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="4"){

        arg.status=localStorage.getItem("curr_sess_currflowstatus");
      }
      else if(sessionStorage.getItem("curr_sess_roleflag")=="5"){

        arg.status=localStorage.getItem("curr_sess_currflowstatus");
      }
      this.physicqualifyexpanditemreadparam=arg;
      //alert(JSON.stringify(arg));
      this.physicqualifyexpanditemreadurl=sessionStorage.getItem("curr_sess_url")+"physicqualifyexpanditemread-service";
      //alert(this.expanditemreadurl);
      this.$.physicqualifyexpanditemreadajax.generateRequest();
    },
    FnphysicqualifyexpanditemreadResponse:function(e){
      //alert(JSON.stringify(e.detail.response));
      if(e.detail.response=="no items")
      {
        //alert('yeas');
        this.speccardlength=containerreceived;
        this.specarr=[];
        if(containermeasure.toUpperCase()==('Coil').toUpperCase()){
          //alert('coil');
          // document.querySelector('physicqualifyitem-card').FnComponentSize();
          localStorage.setItem("curr_sess_repeatitementry","1");
          for(var i=0;i<parseInt(this.speccardlength);i++){
            var obj={"hideflag":"","serialno":"","heatno":"","id":"","number":""};
            obj.serialno=i;
            obj.heatno="0";
            obj.hideflag=false;
            this.specarr.push(obj);
          }
        }
        else{
          //alert('no coil');
          // document.querySelector('physicqualifyitem-card').FnComponentSize();
          localStorage.setItem("curr_sess_repeatitementry","0");
          var obj={"hideflag":"","serialno":"","heatno":"","id":"","number":""};
          obj.serialno=i;
          obj.heatno="0";
          obj.hideflag=true;
          this.specarr.push(obj);

        }
        this.specificationArray=this.specarr;
        //alert(JSON.stringify(this.specificationArray));
        document.querySelector('physicqualified-service').FnSetOldContainerArray(this.specificationArray);
      }
      else{
        var arr=e.detail.response;
        //alert(JSON.stringify(arr));
        for(var i=0;i<arr.length;i++) {
          if(arr[i].Inspection_Status=="Approved")
          arr[i].readflag=false;
          else
          arr[i].readflag=true;

         if(containermeasure.toUpperCase()==('Coil').toUpperCase())
         arr[i].hideflag=false;
         else{
         // document.querySelector('physicqualifyitem-card').FnComponentSize();
         arr[i].hideflag=true;
         }
        }
        //alert(JSON.stringify(arr));
        this.specificationArray = arr;
        localStorage.setItem("curr_sess_productid",this.specificationArray[0].Product_ID);
        localStorage.setItem("curr_sess_PONumber",this.specificationArray[0].PO_Number);
        document.querySelector('physicqualified-service').FnSetOldContainerArray(this.specificationArray);
      }
    },
  physicqualifyitemService:function(contreceived,contmeasure){
    containerreceived=contreceived;
    containermeasure=contmeasure;
    localStorage.setItem("curr_sess_containermeasure",containermeasure);
    this.speccardlength=contreceived;
    this.specarr=[];
    if(contmeasure.toUpperCase()==('Coil').toUpperCase()){
      localStorage.setItem("curr_sess_repeatitementry","1");
      for(var i=0;i<parseInt(this.speccardlength);i++){
        var obj={"serialno":"","hideflag":"","id":"","number":""};
        obj.hideflag=false;
        obj.serialno=i;
        this.specarr.push(obj);
      }
    }
    else{
      localStorage.setItem("curr_sess_repeatitementry","0");
      var obj={"serialno":"","hideflag":"","id":"","number":""};
      obj.hideflag=true;
      obj.serialno=i;
      this.specarr.push(obj);
    }
    this.specificationArray=this.specarr;
  },
  callWebcomponentService:function(){
    this.$.webcomponentreadajax.generateRequest();
  },
  FnWebcomponentreadResponse:function(e) {
    this.current_page="physicqualify-card";
    var arr = e.detail.response;
    var labelvalue=[];
    var errorlabelvalue=[];
    //Binding labels to card
    for(var i=1;i<arr.length;i++) {
      if ((arr[i].Page[0].page[0]) == this.current_page) {
        labelvalue = arr[i].Page[1].Label;
        /*Binding Labels and error message to the respective card*/
        this.label = labelvalue;
      }
    }
  }
});
})();
