/**
 * Created by praba on 2/14/2016.
 */
Polymer({is:"outwardsearchexpand-card",
  ready:function(){

    this.url=sessionStorage.getItem("curr_sess_url")+"outwardsearchexpand-card";

  },
  outwardsearchreadService:function(inwardregno){
    this.inwardno=inwardregno;

    var arg={"inwardregno":""};
    arg.inwardregno=inwardregno;

    this.param=arg;
    this.url=sessionStorage.getItem("curr_sess_url")+"outwardsearchexpand-card";
    this.$.outwardsearchitemreadajax.generateRequest();
  },
  outwardsearchitemreadResponse:function(e)
  {
    var arr=e.detail.response.itemarr;
    //alert(JSON.stringify(arr));
    //var state=e.detail.response.state;
    //var stateno=e.detail.response.statecount;
    //alert(JSON.stringify(e.detail.response.state));
    //alert(JSON.stringify(e.detail.response.statecount));

    var commarr=[];
    var prodarr=[];
    //var potempflag="";
    /*for(var i=0;i<arr.length;i++)
     {
     var obj={"inwardno":"","inwarddate":"","ponumber":"","podate":"","supname":""};
     obj.inwardno=arr[i].inwardno;
     obj.inwarddate=arr[i].inwarddate;
     obj.ponumber=arr[i].ponumber;
     if(arr[i].ponumber!=null||arr[i].ponumber!="")
     potempflag=arr[i].ponumber;
     obj.podate=arr[i].podate;
     obj.supname=arr[i].supname;
     }
     commarr.push(obj);*/
    for(var i=0;i<arr.length;i++)
    {
      var obj={"itemdes":"","quantity":"","weight":""};
      //if(arr[i].state==state){
      obj.itemdes=arr[i].itemdes;
      obj.quantity=arr[i].quantity;
      obj.weight=arr[i].weight;

      prodarr.push(obj);
      //}
    }
    //this.mainArray=commarr;
    this.itemArray=prodarr;
    //document.querySelector('grnflow-card').setSearchflowState(state,stateno);
    //this.pono=potempflag;
    //this.ponumber=potempflag;
    //localStorage.setItem("curr_sess_PONumber",potempflag);
    //this.suppliername=commarr[0].supname;
    //alert(JSON.stringify(commarr));
    //alert(JSON.stringify(prodarr));
  },
  callWebcomponentService:function(){
    this.$.webcomponentreadajax.generateRequest();
  },
  FnWebcomponentreadResponse:function(e) {
    this.current_page="outwardsearchexpand-card";
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
