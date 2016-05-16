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
  physicqualifyitemService:function(contreceived,contmeasure){
    //alert(contreceived+" "+contmeasure);
    this.speccardlength=contreceived;
    this.specarr=[];
    if(contmeasure=='Coil'){
      for(var i=0;i<parseInt(this.speccardlength);i++){
        var obj={"id":"","number":""};
        this.specarr.push(obj);
      }
    }
    else{
      var obj={"id":"","number":""};
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
