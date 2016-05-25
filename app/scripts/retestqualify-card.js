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
  Polymer({is:"retestqualify-card",
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
        this.speccardlength=contreceived;
        this.specarr=[];
        if(contmeasure=='Coil'){
          localStorage.setItem("curr_sess_repeatitementry","1");
          for(var i=0;i<parseInt(this.speccardlength);i++){
            var obj={"id":"","number":""};
            this.specarr.push(obj);
          }
        }
        else{
          localStorage.setItem("curr_sess_repeatitementry","0");
          var obj={"id":"","number":""};
          this.specarr.push(obj);
        }
        this.specificationArray1=this.specarr;
        document.querySelector('physicqualified-service').FnSetOldContainerArray(this.specificationArray1);
      }
      else{
        var arr=e.detail.response;
        for(var i=0;i<arr.length;i++) {
          if(arr[i].Inspection_Status=="Approved")
            arr[i].readflag=false;
          else
            arr[i].readflag=true;
        }
        //alert(JSON.stringify(arr));
        this.specificationArray1 = arr;
        localStorage.setItem("curr_sess_PONumber",this.specificationArray1[0].PO_Number);
        document.querySelector('physicqualified-service').FnSetOldContainerArray(this.specificationArray1);
      }
    },
    physicqualifyitemService:function(contreceived,contmeasure){
      containerreceived=contreceived;
      containermeasure=contmeasure;
      this.speccardlength=contreceived;
      this.specarr=[];
      if(contmeasure=='Coil'){
        localStorage.setItem("curr_sess_repeatitementry","1");
        for(var i=0;i<parseInt(this.speccardlength);i++){
          var obj={"id":"","number":""};
          this.specarr.push(obj);
        }
      }
      else{
        localStorage.setItem("curr_sess_repeatitementry","0");
        var obj={"id":"","number":""};
        this.specarr.push(obj);
      }
      this.specificationArray1=this.specarr;
    },
    callWebcomponentService:function(){
      this.$.webcomponentreadajax.generateRequest();
    },
    FnWebcomponentreadResponse:function(e) {
      this.current_page="retestqualify-card";
      var arr = e.detail.response;
      //alert(JSON.stringify(arr));
      var labelvalue=[];
      var errorlabelvalue=[];
      //Binding labels to card
      for(var i=1;i<arr.length;i++) {
        if ((arr[i].Page[0].page[0]) == this.current_page) {
          //alert('coming...');
          labelvalue = arr[i].Page[1].Label;
          /*Binding Labels and error message to the respective card*/
          this.label = labelvalue;
        }
      }
    }
  });
})();
