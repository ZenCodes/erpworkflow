/**
 * Created by praba on 2/12/2016.
 */

/*JS file for item-page*/
(function(){
  var itemarr=[];

  Polymer({
    is: "item-page",
    ready:function()
    {
      this.Btn_disable_flag=false;
      this.Supplier_Name="Supplier Name";
      this.Supplier_Name_error="Enter supplier name";
      this.nullflag=0;
      this.flag=0;
      this.itemflag=0;
      this.idd=0;
      this.isHidden=true;
      localStorage.setItem("curr_sess_unitset",this.idd);
      localStorage.setItem("curr_sess_othersupplierflag","false");
      /*Dynamic array for creating rows of item card*/
      this.itemArray=[{id:this.idd,description:'',received:'',unit:'',remark:'','measure':''}];
      this.splice('itemArray',1,1);
    },
    FnSetCustomInputValue:function(itemdes,container,qtyreceived,remark,unit,measure,itemid,ponumber,purchasetypeflag){
      this.flag=1;
      this.itemflag=1;
      this.container=container;
      this.qtyreceived=qtyreceived;
      this.remark=remark;
      this.unit=unit;
      this.measure=measure;
      this.itemid=itemid;
      this.purchasetypeflag=1;
      this.podate=localStorage.getItem("localsess_curr_inwarddate");
      this.ponumber=ponumber;
      this.itemdes=itemdes;
    },
    FnOthersInputChanged:function(){
      this.nullflag=1;
    },
    FnInputChanged:function(supplierid,suppliername){
      //alert('yes');
      this.supid=supplierid;
      this.supname=suppliername;
      this.nullflag=1;
    },
    FnSetVehicleinfo:function(invoiceno,vno,vname,dname,dno)
    {
      this.invoiceno=invoiceno;
      this.invoicedate=localStorage.getItem("localsess_curr_inwarddate");
      this.vno=vno;
      this.vname=vname;
      this.dname=dname;
      this.dno=dno
      //alert(this.vno+"  "+this.vname+" an "+this.dname+"  "+this.dno);
    },
    FnSetIteminfo:function(container,qtyreceived,remark){
      this.flag=1;
      this.container=container;
      this.qtyreceived=qtyreceived;
      this.remark=remark;
    },
    FnSetMenuinfo:function(itemdes,unit,measure,itemid,ponumber,purchasetypeflag){
      //alert(itemdes+"  "+unit);
      this.unit=unit;
      this.measure=measure;
      this.itemid=itemid;
      //alert(ponumber);
      //this.purchasetype=purchasetype;
      this.purchasetypeflag=purchasetypeflag;
      if(purchasetypeflag=='1'){
        //localStorage.setItem("curr_sess_purchasetypeflag","1");
        this.podate=localStorage.getItem("localsess_curr_inwarddate");
        this.ponumber=ponumber;
      }
      else{
        this.podate=null;
        this.ponumber=null;
      }
      localStorage.setItem("curr_sess_showunitvalue",unit);
      localStorage.setItem("curr_sess_showmeasurevalue",measure);
      this.itemflag=1;
      this.itemdes=itemdes;
    },
    FnAddItem:function(e)
    {
      //this.$.supname.validate();
      if(this.flag!=1)
      {
        this.qtyreceived=null;
        this.remark=null;
      }
      if(this.itemflag!=1)
      this.itemdes=null;
      var existflag=0;
      var deleteflag=0;
      //alert(this.invoiceno+"  "+this.invoicedate+"  "+this.vno+"  "+this.vname+"  "+this.dname+"  "+this.dno+" "+this.itemdes+" "+this.measure+" "+this.container+" "+this.qtyreceived+" "+this.unit+" "+this.remark);
      if(this.itemdes=='deleted'||this.qtyreceived=='deleted'){
        deleteflag=1;
      }

      //if(this.container==null||this.container==""||this.itemdes==null||this.qtyreceived==null||this.nullflag==0||this.qtyreceived==""||this.unit==null||this.unit==""||this.measure==null||this.measure=="")
      if(this.itemdes==null||this.qtyreceived==null||this.nullflag==0||this.qtyreceived==""||this.unit==null||this.unit==""||this.measure==null||this.measure=="")
      {
        if(this.nullflag==0){
          document.querySelector('supplier-list').FnValidate();
          //document.querySelector('#supname').validate();
        }
        else {
          if(this.itemdes==null)
            this.$.ID_Show_Dialog.FnShowDialog("Choose atleast one item!!","");
          // else if(this.container==null||this.container=="")
            // this.$.ID_Show_Dialog.FnShowDialog("Enter received container unit!","");
          else if(this.unit==null||this.unit=="")
            this.$.ID_Show_Dialog.FnShowDialog("Enter unit value for container!","");
          else if(this.qtyreceived==null||this.qtyreceived=="")
            this.$.ID_Show_Dialog.FnShowDialog("Enter received quantity unit!","");
          else if(this.measure==null||this.measure=="")
            this.$.ID_Show_Dialog.FnShowDialog("Enter measure for Qty Received!","");
          //alert("All fields must want to be filled");
        }
      }
      // else if(this.container<=0){
        // this.$.ID_Show_Dialog.FnShowDialog("Received container unit should be greater than 0!","");
      // }
      else if(this.qtyreceived<=0){
        this.$.ID_Show_Dialog.FnShowDialog("Received quantity unit should be greater than 0!","");
      }

      else
      {
        for(var i=0;i<itemarr.length;i++)
        {
          if(itemarr[i].itemdes==this.itemdes){
            existflag=1;
            alert("Item already exist!");
          }
          if(existflag==1){
          }
        }
        if(existflag==0){
          var obj={"purchasetype":"","purchasetypeflag":"","podate":"","ponumber":"","invoiceno":"","invoicedate":"","supplier":"","itemdes":"","qtyreceive":"","remark":"","unit":"","qtymeasure":"","unitmeasure":""};
          //obj.purchasetype=this.purchasetype;
          obj.purchasetypeflag=this.purchasetypeflag;
          obj.podate=this.podate;
          obj.ponumber=this.ponumber;
          obj.invoiceno=this.invoiceno;
          obj.invoicedate=this.invoicedate;
          obj.supplier=this.supname;
          obj.itemdes=this.itemdes;
          obj.qtyreceive=this.qtyreceived;
          obj.qtymeasure=this.unit;
          obj.remark=this.remark;
          obj.unit=this.container;
          obj.unitmeasure=this.measure;
          if(deleteflag!=1)
            itemarr.push(obj);
          this.idd=this.itemArray.length;
          localStorage.setItem("curr_sess_unitset",this.idd);
          //alert(JSON.stringify(itemarr));
          if(localStorage.getItem("curr_sess_saveflag")=="false") {
            this.push('itemArray', {id: this.idd, description: '', received: '', unit: '', remark: '', 'measure': ''});
          }
          //To Fetch item under supplier whenever we go for add item
          if(localStorage.getItem("curr_sess_othersupplierflag")==true) {}
          else
          document.querySelector('autocompleteitemlist-card').FnFetchSpecificItem(this.supid,this.supname);
          //alert(JSON.stringify(this.itemArray.length));
          this.flag=0;
          this.itemflag=0;
        }
      }
    },
    FnSaveItem:function(){
      if(localStorage.getItem("curr_sess_saveflag")=="false"){
        if(this.flag!=1)
        {
          this.qtyreceived=null;
          this.remark=null;
        }
        if(this.itemflag!=1)
        this.itemdes=null;
        var existflag=0;
        var deleteflag=0;
        //alert(this.invoiceno+"  "+this.invoicedate+"  "+this.vno+"  "+this.vname+"  "+this.dname+"  "+this.dno+" "+this.itemdes+" "+this.qtyreceived+" "+this.remark);
        if(this.itemdes=='deleted'||this.qtyreceived=='deleted'){
          deleteflag=1;
        }
        //if(this.container==null||this.container==""||this.itemdes==null||this.qtyreceived==null||this.qtyreceived==""||this.nullflag==0||this.unit==""||this.unit==null||this.measure==null||this.measure=="")
        if(this.itemdes==null||this.qtyreceived==null||this.nullflag==0||this.qtyreceived==""||this.unit==null||this.unit==""||this.measure==null||this.measure=="")
        {
          if(this.nullflag==0){
            document.querySelector('supplier-list').FnValidate();
            //document.querySelector('#supname').validate();
          }
          else {
            if(this.itemdes==null)
              this.$.ID_Show_Dialog.FnShowDialog("Choose atleast one item!!","");
            // else if(this.container==null||this.container=="")
              // this.$.ID_Show_Dialog.FnShowDialog("Enter received container unit!","");
            else if(this.unit==null||this.unit=="")
            this.$.ID_Show_Dialog.FnShowDialog("Enter unit value for container!","");
            else if(this.qtyreceived==null||this.qtyreceived=="")
              this.$.ID_Show_Dialog.FnShowDialog("Enter received quantity unit!","");
            else if(this.measure==null||this.measure=="")
            this.$.ID_Show_Dialog.FnShowDialog("Enter measure for Qty Received!","");
            //alert("All fields must want to be filled");
          }
        }
        // else if(this.container<=0){
          // this.$.ID_Show_Dialog.FnShowDialog("Received container unit should be greater than 0!","");
        // }
        else if(this.qtyreceived<=0){
          this.$.ID_Show_Dialog.FnShowDialog("Received quantity unit should be greater than 0!","");
        }
        else
        {
          for(var i=0;i<itemarr.length;i++)
          {
            if(itemarr[i].itemdes==this.itemdes){
              existflag=1;
              alert("Item already exist!");
            }
            if(existflag==1){
            }
          }
          if(existflag==0){
            var obj={"purchasetype":"","purchasetypeflag":"","podate":"","ponumber":"","invoiceno":"","invoicedate":"","supplier":"","itemdes":"","qtyreceive":"","remark":"","unit":"","qtymeasure":"","unitmeasure":""};
            //obj.purchasetype=this.purchasetype;
            obj.purchasetypeflag=this.purchasetypeflag;
            obj.podate=this.podate;
            obj.ponumber=this.ponumber;
            obj.invoiceno=this.invoiceno;
            obj.invoicedate=this.invoicedate;
            obj.supplier=this.supname;
            obj.itemdes=this.itemdes;
            obj.qtyreceive=this.qtyreceived;
            obj.qtymeasure=this.unit;
            obj.unit=this.container;
            obj.unitmeasure=this.measure;
            obj.remark=this.remark;
            if(deleteflag!=1)
              itemarr.push(obj);
            //alert(JSON.stringify(itemarr));
            this.itemdes='deleted';
            this.qtyreceived='deleted';
            this.remark='deleted';
            this.flag=1;
            this.itemflag=1;
            this.$.itemservice.FnItemwriteService(this.invoiceno,this.invoicedate,this.vno,this.vname,this.dname,this.dno,itemarr);
          }

        }
        //document.querySelectorAll("paper-input").readonly=true;
        //alert(this.querySelector("item-card"));
      }
      else{
        this.$.ID_Show_Dialog.FnShowDialog("INR already created for this Invoice, Please click 'CREATE' for new IRN with another Invoice!!","");
        //alert("INR already created for this Invoice, Please click 'CREATE' for new IRN with another Invoice!!");
      }

    },
    FnDeleteItem:function(e)
    {
      itemarr.splice(e.model.index,1);
      this.splice('itemArray',e.model.index,1);
      this.itemdes='deleted';
      this.qtyreceived='deleted';
      this.remark='deleted';
      this.flag=1;
      this.itemflag=1;
      //alert(JSON.stringify(itemarr));
    },
    FnBtnDisable:function(){
      document.querySelector('#save').style.backgroundColor='grey';
      document.querySelector('#additem').style.backgroundColor='grey';
      this.Btn_disable_flag=true;
    },
    FnEnableHide:function(){
      this.isHidden=false;
    }
  });
})();
