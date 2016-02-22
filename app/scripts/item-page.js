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
      this.Supplier_Name="Supplier Name";
      this.Supplier_Name_error="Enter supplier name";
      this.nullflag=0;
      this.flag=0;
      this.itemflag=0;
      this.idd=0;
      localStorage.setItem("curr_sess_unitset",this.idd);
      /*Dynamic array for creating rows of item card*/
      this.itemArray=[{id:this.idd,description:'',received:'',unit:'',remark:'','measure':''}];
      this.splice('itemArray',1,1);
    },
    FnInputChanged:function(){
      //alert('yes');
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
      //alert(this.vno+"  "+this.vname+"  "+this.dname+"  "+this.dno);
    },
    FnSetIteminfo:function(container,qtyreceived,remark){
      this.flag=1;
      this.container=container;
      this.qtyreceived=qtyreceived;
      this.remark=remark;
    },
    FnSetMenuinfo:function(itemdes,unit,measure){
      //alert(itemdes+"  "+unit);
      this.unit=unit;
      this.measure=measure;
      localStorage.setItem("curr_sess_showunitvalue",unit);
      localStorage.setItem("curr_sess_showmeasurevalue",measure);
      this.itemflag=1;
      this.itemdes=itemdes;
    },
    FnAddItem:function(e)
    {
      //alert(e.model.index);
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

      if(this.container==null||this.itemdes==null||this.qtyreceived==null||this.nullflag==0||this.qtyreceived=="")
      {
        if(this.nullflag==0){
          document.querySelector('#supname').validate();
        }
        else {
          if(this.itemdes==null)
            this.$.ID_Show_Dialog.FnShowDialog("Choose atleast one item!!","");
          else if(this.container==null)
            this.$.ID_Show_Dialog.FnShowDialog("Enter received container unit!","");
          else if(this.qtyreceived==null||this.qtyreceived=="")
            this.$.ID_Show_Dialog.FnShowDialog("Enter received quantity unit!","");
          //alert("All fields must want to be filled");
        }
      }
      else if(this.container<=0){
        this.$.ID_Show_Dialog.FnShowDialog("Received container unit should be greater than 0!","");
      }
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
          var obj={"invoiceno":"","invoicedate":"","supplier":"","itemdes":"","qtyreceive":"","remark":"","unit":"","qtymeasure":"","unitmeasure":""};
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
          if(localStorage.getItem("curr_sess_saveflag")=="false")
          this.push('itemArray',{id:this.idd,description:'',received:'',unit:'',remark:'','measure':''});
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
        if(this.container==null||this.itemdes==null||this.qtyreceived==null||this.nullflag==0||this.qtyreceived=="")
        {
          if(this.nullflag==0){
            document.querySelector('#supname').validate();
          }
          else {
            if(this.itemdes==null)
              this.$.ID_Show_Dialog.FnShowDialog("Choose atleast one item!!","");
            else if(this.container==null)
              this.$.ID_Show_Dialog.FnShowDialog("Enter received container unit!","");
            else if(this.qtyreceived==null||this.qtyreceived=="")
              this.$.ID_Show_Dialog.FnShowDialog("Enter received quantity unit!","");
            //alert("All fields must want to be filled");
          }
        }
        else if(this.container<=0){
          this.$.ID_Show_Dialog.FnShowDialog("Received container unit should be greater than 0!","");
        }
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
            var obj={"invoiceno":"","invoicedate":"","supplier":"","itemdes":"","qtyreceive":"","remark":"","unit":"","qtymeasure":"","unitmeasure":""};
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
            this.$.itemservice.FnItemwriteService(this.invoiceno,this.invoicedate,this.vno,this.vname,this.dname,this.dno,itemarr)
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
    }
  });
})();
