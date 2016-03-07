/**
 * Created by praba on 2/13/2016.
 */
//Service file for outwardslip module
(function() {

  Polymer({
    is: "outwarditem-service",
    ready:function()
    {
      this.length=0;
      this.no=0;
      this.sequrl=sessionStorage.getItem("curr_sess_url")+"outwardseq-service";
      this.outwardurl=sessionStorage.getItem("curr_sess_url")+"outwarditem-service";
    },
    //Calling ajax to generate seq
    FnSeqItemwriteService:function(itemarr){
      this.items=[];
      this.items=itemarr;
      this.length=this.items.length;
      this.seqparam={"invoiceno":this.items[0].invoiceno};
      this.$.seqitemwriteAjax.generateRequest();
    },
    //Receiving res for itemwrite operation
    FnOutwarditemwriteResponse:function(e)
    {

      if(e.detail.response.inwardregno!='not okay')
        this.no=this.no+1;
      if(this.no==this.length){
        //localStorage.setItem("curr_sess_saveflag","true");
        //document.querySelector('outwarditem-page').FnBtnDisable();
        this.$.ID_Show_Dialog.FnShowDialog("Outward Register Note is created!",e.detail.response.outwardregno);
        document.querySelector('outwarditem-page').FnRefreshPage();
        this.no=0;
        this.length=0;
        document.querySelector('item-card').FnsetValue();
        document.querySelector('autocompleteitemlist-card').FnsetValue();
        //document.querySelector('outwarditem-page').FnBtnDisable();
        //alert("Invoice Stored: "+e.detail.response.outwardregno);
      }
      //else
        //alert("Invoice already exist....Create new invoice...!");
    },
    //Generating seq res and calling itemwrite servicee
    FnSeqitemwriteResponse:function(e)
    {
      //alert(e.detail.response.returnval);
      if(e.detail.response.returnval=="succ"){
        for(var i=0;i<this.items.length;i++){
          var obj={"outdate":"","outtime":"","customername":"","invoiceno":"","city":"","vehicleno":"","transportname":"","drivername":"","driverno":"","ownername":"","ownerphone":"","panno":"","quantity":"","unit":"","itemdes":"","weight":""};
          obj.outdate=this.items[i].outdate;
          obj.outtime=this.items[i].outtime;
          obj.customername=this.items[i].customername;
          obj.invoiceno=this.items[i].invoiceno;
          obj.city=this.items[i].city;
          obj.vehicleno=this.items[i].vehicleno;
          obj.transportname=this.items[i].transportname;
          obj.drivername=this.items[i].drivername;
          obj.driverno=this.items[i].driverno;
          obj.ownername=this.items[i].ownername;
          obj.ownerphone=this.items[i].ownerphone;
          obj.panno=this.items[i].panno;
          obj.itemdes=this.items[i].itemdes;
          obj.unit=this.items[i].unit;
          obj.quantity=this.items[i].quantity;
          obj.weight=this.items[i].weight;
          this.params=obj;
          this.$.outwarditemwriteAjax.generateRequest();
        }
      }
      else {
        localStorage.setItem("curr_sess_outinvoiceflag","1");
        alert("Invoice already exist....Create new invoice...!");
      }

    }
  });
})();
