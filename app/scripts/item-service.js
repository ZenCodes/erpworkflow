/**
 * Created by praba on 2/12/2016.
 */
/*JS page for item-service component*/

(function() {
var intentregno;
  Polymer({
    is: "item-service",
    ready:function()
    {
      this.length=0;
      this.no=0;
      this.url=sessionStorage.getItem("curr_sess_url")+"itemsave-service";
      this.url1=sessionStorage.getItem("curr_sess_url")+"inwardregnoseq-service";
    },
    //Method it will pass req to the server to insert vehicle info and generating seq no
    FnItemwriteService:function(invoiceno,invoicedate,vno,vname,dname,dno,itemarr){
      this.items=[];
      this.items=itemarr;
      this.length=this.items.length;
      var vobj={"invoiceno":"","invoicedate":"","vehno":"","vehname":"","drivername":"","driverno":""};
      vobj.invoiceno=invoiceno;
      vobj.invoicedate=invoicedate;
      vobj.vehno=vno;
      vobj.vehname=vname;
      vobj.drivername=dname;
      vobj.driverno=dno;
      this.params1=vobj;
      //alert(JSON.stringify(vobj));
      this.$.itemwriteAjax1.generateRequest();
    },
    //Inward item save response received and showing reg no to the user
    FnItemwriteResponse:function(e)
    {
      if(e.detail.response.inwardregno!='not okay')
        this.no=this.no+1;
      if(this.no==this.length){
        localStorage.setItem("curr_sess_saveflag","true");
        document.querySelector('item-page').FnBtnDisable();        
        this.$.ID_Show_Dialog.FnShowDialog("Inward Register Note is created!",e.detail.response.inwardregno);

        //alert("Invoice Stored: "+e.detail.response.inwardregno);
      }
    },
    //Response received for inward seq creation req on successful creation it will call itemsave request to the server
    FnSeqItemwriteResponse:function(e)
    {
      //alert(e.detail.response);
      //Sending row by row of item info to the server
      if(e.detail.response.returnval=="succ"){
        for(var i=0;i<this.items.length;i++){
          var obj={"purchasetype":"","purchasetypeflag":"","podate":"","ponumber":"","invoiceno":"","invoicedate":"","supplier":"","itemdes":"","qtyreceived":"","remark":"","unit":"","qtymeasure":"","unitmeasure":""};
          //obj.purchasetype=this.items[i].purchasetype;
          obj.purchasetypeflag=this.items[i].purchasetypeflag;
          obj.podate=this.items[i].podate;
          obj.ponumber=this.items[i].ponumber;
          obj.invoiceno=this.items[i].invoiceno;
          obj.invoicedate=this.items[i].invoicedate;
          obj.supplier=this.items[i].supplier;
          obj.itemdes=this.items[i].itemdes;
          obj.qtyreceived=this.items[i].qtyreceive;
          obj.unit=this.items[i].unit;
          obj.qtymeasure=this.items[i].qtymeasure;
          obj.unitmeasure=this.items[i].unitmeasure;
          obj.remark=this.items[i].remark;
          this.params=obj;
          this.$.itemwriteAjax.generateRequest();
        }
      }
      //if inward no is already exists it will revert the message
      else if(e.detail.response.returnval=="exists"){
        alert("Invoice already exist....Create new invoice...!");
      }
    },
    FnIntentItemwriteService:function(itemarr){
      //alert(JSON.stringify(itemarr));
      this.items=[];
      this.items=itemarr;
      this.length=this.items.length;
      this.intentsequrl=sessionStorage.getItem("curr_sess_url")+"intentseq-service";
      this.$.intentseqitemwriteAjax.generateRequest();
    //alert(JSON.stringify(itemarr));
    },
    FnSeqIntentItemwriteResponse:function(e){
      //alert(sessionStorage.getItem("loggeduser"));
      if(e.detail.response.returnval=="succ"){
        for(var i=0;i<this.items.length;i++){
          var obj={"state":"","loggedrole":"","loggeduser":"","duedate":"","intentdate":"","specification":"","itemdes":"","qtyreceived":"","remark":"","unit":"","qtymeasure":"","unitmeasure":""};
          obj.loggedrole=sessionStorage.getItem("loggedrole");
          obj.loggeduser=sessionStorage.getItem("loggeduser");
          obj.duedate=this.items[i].duedate;
          obj.state=this.items[i].state;
          obj.intentdate=this.items[i].invoicedate;
          obj.specification=this.items[i].specification;
          obj.itemdes=this.items[i].itemdes;
          obj.qtyreceived=this.items[i].qtyreceive;
          obj.unit=this.items[i].unit;
          obj.qtymeasure=this.items[i].qtymeasure;
          obj.unitmeasure=this.items[i].unitmeasure;
          obj.remark=this.items[i].remark;
          this.intentwrite=obj;
          this.intentwriteurl=sessionStorage.getItem("curr_sess_url")+"intentitemwrite-service";
          this.$.intentitemwriteAjax.generateRequest();
        }
      }
      //if inward no is already exists it will revert the message
      else if(e.detail.response.returnval=="exists"){
        alert("This Intent is already saved, Please click 'Create' for new intent!");
      }
    },
    //Inward item save response received and showing reg no to the user
    FnIntentItemwriteResponse:function(e)
    {
      if(e.detail.response.intentregno!='not okay') {

        this.no = this.no + 1;
      }
      if(this.no==this.length){
        localStorage.setItem("curr_sess_saveflag","true");
        document.querySelector('intent-page').FnBtnDisable();
        //document.querySelector('intentflow-card').setStateCreate();
        //this.$.ID_Show_Dialog.FnShowDialog("Intent Register Note is created!",e.detail.response.intentregno);
        //alert("Invoice Stored: "+e.detail.response.inwardregno);
        this.FnIntentRolereadService(e.detail.response.intentregno);
      }
    },
    FnIntentRolereadService:function(intentno){
      intentregno=intentno;
      //alert(intentno);
      this.intentrolereadurl=sessionStorage.getItem("curr_sess_url")+"intentroleread-service";
      var obj={"intentno":""};
      obj.intentno=intentno;
      this.intentroleread=obj;
      this.$.intentRolereadAjax.generateRequest();
    },
    FnIntentRolereadResponse:function(e){
      if(e.detail.response.itemarr=="succ")
      {
      this.promoterolereadurl=sessionStorage.getItem("curr_sess_url")+"promoteroleread-service";
      var obj={"intentno":""};
      obj.intentno=intentregno;
      this.promoteroleread=obj;
      this.$.promoteRolereadAjax.generateRequest();
      }
      else
      alert("fail");
      //alert(e.detail.response.itemarr);
      //alert(JSON.stringify(e.detail.response.itemarr));
    },
    FnPromoteRolereadResponse:function(e){
      var arr=e.detail.response.itemarr;
      // for(var i=0;i<arr.length;i++){
        // alert("Intent goes for approval with...."+arr[i].Intent_Approver+"  manager!");
      // }
      if(localStorage.getItem("curr_sess_spotorderflag")=='true')
      this.$.ID_Show_Dialog.FnShowDialog("Intent Register Note is created! Sent for the Approval with  "+"Purchase Department",intentregno);
      else
      this.$.ID_Show_Dialog.FnShowDialog("Intent Register Note is created! Sent for the Approval with  "+arr[0].Intent_Approver,intentregno);
    }
  });
})();
