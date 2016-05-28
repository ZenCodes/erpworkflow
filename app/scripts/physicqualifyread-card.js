/**
 * Created by praba on 2/12/2016.
 */
Polymer({is:"physicqualifyread-card",
  ready:function(){

    this.url=sessionStorage.getItem("curr_sess_url")+"physicqualify-card";

  },
  physicqualifyreadService:function(inwardregno){
    //Reading item info under the expanded IRN card
    //alert(inwardregno)
    this.inwardno=inwardregno;

    var arg={"inwardregno":"","status":""};
    arg.inwardregno=inwardregno;

    arg.status=localStorage.getItem('curr_sess_expandstate');
    //alert(arg.inwardregno+"  "+arg.status);
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
          var obj={"id":"","number":"","hideflag":""};
          obj.hideflag=false;
          this.specarr.push(obj);
        }
      }
      else{
        localStorage.setItem("curr_sess_repeatitementry","0");
        var obj={"id":"","number":"","hideflag":""};
        obj.hideflag=true;
        this.specarr.push(obj);
      }
      this.specificationArray=this.specarr;
      //document.querySelector('physicqualified-service').FnSetOldContainerArray(this.specificationArray);
    }
    else{
      var arr=e.detail.response;
      for(var i=0;i<arr.length;i++) {
        if(arr[i].Inspection_Status=="Approved")
          arr[i].readflag=false;
        else
          arr[i].readflag=true;
        if(arr[i].Quantity_Measure=="Coil")
          arr[i].hideflag=false;
        else
          arr[i].hideflag=true;
      }
      //alert(JSON.stringify(arr));
      this.specificationArray = arr;
      this.ponumber=this.specificationArray[0].PO_Number;

      //document.querySelector('physicqualified-service').FnSetOldContainerArray(this.specificationArray);
    }
  },
  //Method to invoke webcomponent service to read the dynamic label from config file
  callWebcomponentService:function(){
    this.$.webcomponentreadajax.generateRequest();
  },
  //Response binding to the label
  FnWebcomponentreadResponse:function(e) {
    this.current_page="physicqualifyread-card";
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
