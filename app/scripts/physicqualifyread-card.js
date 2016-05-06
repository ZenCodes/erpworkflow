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
    this.param=arg;
    this.url=sessionStorage.getItem("curr_sess_url")+"physicqualify-card";
    this.$.physicqualifyitemreadajax.generateRequest();
  },
  FnPhysicqualifyitemreadResponse:function(e)
  {
    //Binding inforamtion to the card
    var arr=e.detail.response;
    //alert(JSON.stringify(arr));
    var commarr=[];
    var prodarr=[];
    for(var i=0;i<arr.length;i++)
    {
      var obj={"inwardno":"","inwarddate":"","ponumber":"","podate":"","supname":""};
      this.purchasetypeflag=arr[i].purchasetypeflag;
      if(this.purchasetypeflag!="1") {
        document.querySelector('#readsuplr').style.paddingTop='0%';
        this.isHidden = false;
      }
      else {
        document.querySelector('#readsuplr').style.paddingTop='6%';
        //document.querySelector('#readsuplr').style.marginLeft='65%';
        this.isHidden = true;
      }
      obj.inwardno=arr[i].inwardno;
      obj.inwarddate=arr[i].inwarddate;
      obj.ponumber=arr[i].ponumber;
      if(arr[i].ponumber!=null||arr[i].ponumber!="")
        this.potempreadflag=arr[i].ponumber;
      obj.podate=arr[i].podate;
      obj.supname=arr[i].supname;
    }
    commarr.push(obj);
    for(var i=0;i<arr.length;i++)
    {
      var obj={"itemdes":"","qtyordered":"","qtyreceived":"","qtyaccepted":"","remarks":""};
      obj.itemdes=arr[i].itemdes;
      obj.qtyordered=arr[i].qtyordered;
      obj.qtyreceived=(arr[i].containerreceived)+" / "+(arr[i].qtyreceived);
      obj.qtyaccepted=(arr[i].containeraccepted+arr[i].contmeasure)+" / "+(arr[i].qtyaccepted+arr[i].qtymeasure);
      obj.remarks=arr[i].remarks;
      prodarr.push(obj);
    }
    this.mainArray=commarr;
    this.itemArray=prodarr;
    this.pono=this.potempreadflag;
    this.suppliername=commarr[0].supname;
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
